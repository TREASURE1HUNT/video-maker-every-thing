"""Authenticated, single-worker bridge for independently installed TTS engines."""
import io, json, os, secrets, threading
from pathlib import Path
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

ENGINE = os.environ.get('TTS_ENGINE', 'chatterbox')
TOKEN = os.environ.get('VOICE_SERVICE_TOKEN', '')
if len(TOKEN) < 32:
    raise RuntimeError('Set a random VOICE_SERVICE_TOKEN of at least 32 characters')
app = FastAPI(docs_url=None, redoc_url=None)
lock = threading.Lock()
model = None
presets = json.loads(Path(os.environ.get('VOICE_PRESETS', '/voices/voices.json')).read_text()) if Path(os.environ.get('VOICE_PRESETS', '/voices/voices.json')).exists() else {'default': {}}

def authorize(value):
    if not secrets.compare_digest(value or '', 'Bearer ' + TOKEN):
        raise HTTPException(401, 'Authentication required')

class Speech(BaseModel):
    input: str = Field(min_length=1, max_length=2000)
    voice: str = Field(default='default', pattern=r'^[a-zA-Z0-9_-]{1,80}$')
    language: str = Field(default='ru', pattern=r'^(ru|en|fr|de|es|it|pt|zh|ja|ko|ar|hi)$')
    speed: float = Field(default=1, ge=.75, le=1.5)
    response_format: str = 'wav'

def get_model():
    global model
    if model is None:
        device = os.environ.get('TTS_DEVICE', 'cuda')
        if ENGINE == 'coqui':
            from TTS.api import TTS
            model = TTS(os.environ.get('COQUI_MODEL', 'tts_models/multilingual/multi-dataset/xtts_v2')).to(device)
        elif ENGINE == 'f5':
            from f5_tts.api import F5TTS
            model = F5TTS(device=device, ckpt_file=os.environ.get('F5_CHECKPOINT', ''), vocab_file=os.environ.get('F5_VOCAB', ''))
        elif ENGINE == 'chatterbox':
            from chatterbox.mtl_tts import ChatterboxMultilingualTTS
            model = ChatterboxMultilingualTTS.from_pretrained(device=device)
        elif ENGINE != 'fish':
            raise RuntimeError('Unknown engine')
    return model

@app.get('/health')
def health(authorization: str | None = Header(default=None)):
    authorize(authorization)
    return {'engine': ENGINE, 'loaded': model is not None, 'voices': list(presets)}

@app.post('/v1/audio/speech')
def speak(body: Speech, authorization: str | None = Header(default=None)):
    authorize(authorization)
    if body.voice not in presets:
        raise HTTPException(400, 'Unknown preset voice')
    if not lock.acquire(blocking=False):
        raise HTTPException(429, 'Voice worker is busy')
    try:
        import soundfile as sf
        preset = presets[body.voice]
        if ENGINE == 'fish':
            import requests
            # Native upstream is a fixed operator configuration, never supplied by a user.
            url = os.environ.get('FISH_NATIVE_URL', 'http://127.0.0.1:8080').rstrip('/')
            token = os.environ.get('FISH_NATIVE_TOKEN', '')
            r = requests.post(url + '/v1/tts', json={'text': body.input, 'format': 'wav', 'reference_id': preset.get('reference_id')}, headers={'Authorization': 'Bearer ' + token} if token else {}, timeout=180)
            r.raise_for_status()
            audio, rate = sf.read(io.BytesIO(r.content))
        elif ENGINE == 'coqui':
            reference = preset.get('path')
            if not reference:
                raise HTTPException(400, 'Configure an operator-owned reference voice')
            audio = get_model().tts(text=body.input, speaker_wav=reference, language=body.language)
            rate = get_model().synthesizer.output_sample_rate
        elif ENGINE == 'f5':
            if not preset.get('path') or not preset.get('text'):
                raise HTTPException(400, 'Configure reference audio and its exact transcript')
            audio, rate, _ = get_model().infer(ref_file=preset['path'], ref_text=preset['text'], gen_text=body.input, speed=body.speed)
        else:
            wav = get_model().generate(body.input, language_id=body.language, **({'audio_prompt_path': preset['path']} if preset.get('path') else {}))
            audio, rate = wav.squeeze().detach().cpu().numpy(), get_model().sr
        output = io.BytesIO()
        sf.write(output, audio, rate, format='WAV')
        if output.tell() > 12_000_000:
            raise HTTPException(413, 'Audio too large')
        return Response(output.getvalue(), media_type='audio/wav', headers={'Cache-Control':'no-store'})
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(502, 'Speech engine failed; inspect private server logs')
    finally:
        lock.release()
