import importlib.util, io, os, tempfile, time, unittest
from pathlib import Path
os.environ['UPSCAYL_SERVICE_TOKEN'] = 'test-token-' + 'x' * 32
os.environ['UPSCAYL_JOBS_DIR'] = tempfile.mkdtemp()
spec = importlib.util.spec_from_file_location('worker', Path(__file__).with_name('app.py'))
worker = importlib.util.module_from_spec(spec); spec.loader.exec_module(worker)
from fastapi.testclient import TestClient
from PIL import Image
client = TestClient(worker.app)
headers = {'Authorization': 'Bearer ' + worker.TOKEN}
class Tests(unittest.TestCase):
    def test_auth(self):
        self.assertEqual(client.get('/health').status_code, 401)
        self.assertEqual(client.get('/health', headers=headers).status_code, 200)
    def test_validation(self):
        response = client.post('/v1/jobs', headers=headers, data={'model':'../../secret'}, files={'file':('x',b'x')})
        self.assertEqual(response.status_code,422)
        self.assertEqual(client.get('/v1/jobs/unknown',headers=headers).status_code,404)
    def test_image_lifecycle(self):
        original = worker.upscale
        def stub(source,target):
            with Image.open(source) as image: image.resize((image.width*2,image.height*2)).save(target)
        worker.upscale = stub
        try:
            data=io.BytesIO(); Image.new('RGB',(32,24)).save(data,format='PNG')
            response=client.post('/v1/jobs',headers=headers,files={'file':('../../evil.png',data.getvalue(),'image/png')})
            self.assertEqual(response.status_code,202)
            identifier=response.json()['id']
            for _ in range(100):
                state=client.get('/v1/jobs/'+identifier,headers=headers).json()
                if state['status'] in ('complete','failed'): break
                time.sleep(.02)
            self.assertEqual(state['status'],'complete',state)
            self.assertEqual(state['output']['width'],64)
            self.assertEqual(client.get('/v1/jobs/'+identifier+'/result',headers=headers).headers['content-type'],'image/png')
        finally: worker.upscale=original
    def test_bad_media(self):
        response=client.post('/v1/jobs',headers=headers,data={'kind':'video'},files={'file':('bad.mp4',b'not a video')})
        identifier=response.json()['id']
        for _ in range(100):
            state=client.get('/v1/jobs/'+identifier,headers=headers).json()
            if state['status']=='failed': break
            time.sleep(.02)
        self.assertEqual(state['status'],'failed')
        self.assertEqual(client.get('/v1/jobs/'+identifier+'/result',headers=headers).status_code,409)
if __name__=='__main__': unittest.main()
