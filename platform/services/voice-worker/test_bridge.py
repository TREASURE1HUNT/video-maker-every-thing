"""Contract tests with fake inference, not GPU/model-quality tests."""
import io, os, unittest
os.environ['VOICE_SERVICE_TOKEN'] = 'fixture-service-token-not-for-production-12345'
from fastapi.testclient import TestClient
import numpy as np
import soundfile as sf
import app as bridge

class Tensor:
    def squeeze(self): return self
    def detach(self): return self
    def cpu(self): return self
    def numpy(self): return np.zeros(2400, dtype='float32')
class Model:
    sr = 24000
    synthesizer = type('Synth', (), {'output_sample_rate': 24000})()
    def generate(self, *a, **kw): return Tensor()
    def tts(self, **kw): return np.zeros(2400, dtype='float32')
    def infer(self, **kw): return np.zeros(2400, dtype='float32'), 24000, None

class BridgeTests(unittest.TestCase):
    def setUp(self):
        self.client=TestClient(bridge.app)
        self.auth={'Authorization':'Bearer '+bridge.TOKEN}
        bridge.model=Model()
        bridge.presets={'default':{'path':'/operator/reference.wav','text':'Operator reference transcript'}}
    def test_auth_and_payload(self):
        self.assertEqual(self.client.get('/health').status_code,401)
        self.assertEqual(self.client.get('/health',headers=self.auth).status_code,200)
        self.assertEqual(self.client.post('/v1/audio/speech',headers=self.auth,json={'input':''}).status_code,422)
        self.assertEqual(self.client.post('/v1/audio/speech',headers=self.auth,json={'input':'Text','voice':'../../file'}).status_code,422)
    def test_three_library_contracts(self):
        for engine in ['coqui','f5','chatterbox']:
            bridge.ENGINE=engine
            response=self.client.post('/v1/audio/speech',headers=self.auth,json={'input':'Тестовая речь.','voice':'default','language':'ru'})
            self.assertEqual(response.status_code,200,engine)
            self.assertTrue(response.content.startswith(b'RIFF'))
            self.assertEqual(response.headers['content-type'],'audio/wav')
    def test_fish_native_contract(self):
        import requests
        original=requests.post
        buf=io.BytesIO();sf.write(buf,np.zeros(2400),24000,format='WAV')
        class Reply:
            content=buf.getvalue()
            def raise_for_status(self): pass
        requests.post=lambda *a,**kw: Reply()
        try:
            bridge.ENGINE='fish'
            r=self.client.post('/v1/audio/speech',headers=self.auth,json={'input':'Тестовая речь.'})
            self.assertEqual(r.status_code,200)
            self.assertTrue(r.content.startswith(b'RIFF'))
        finally: requests.post=original
    def test_unknown_voice_and_concurrency(self):
        self.assertEqual(self.client.post('/v1/audio/speech',headers=self.auth,json={'input':'Hello','voice':'unknown'}).status_code,400)
        bridge.lock.acquire()
        try: self.assertEqual(self.client.post('/v1/audio/speech',headers=self.auth,json={'input':'Hello'}).status_code,429)
        finally: bridge.lock.release()

if __name__=='__main__': unittest.main()
