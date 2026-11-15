"""Private, bounded Upscayl GPU worker. Site backend owns authorization and billing."""
import json, os, secrets, shutil, subprocess, threading, time, uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from fastapi import FastAPI, Header, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from PIL import Image, ImageOps

TOKEN = os.environ.get('UPSCAYL_SERVICE_TOKEN', '')
if len(TOKEN) < 32:
    raise RuntimeError('UPSCAYL_SERVICE_TOKEN must contain at least 32 random characters')
ROOT = Path(os.environ.get('UPSCAYL_JOBS_DIR', './jobs')).resolve()
ROOT.mkdir(parents=True, exist_ok=True)
BIN = os.environ.get('UPSCAYL_BIN', 'upscayl-bin')
MODELS = os.environ.get('UPSCAYL_MODELS', './models')
FFMPEG = os.environ.get('FFMPEG_BIN', 'ffmpeg')
FFPROBE = os.environ.get('FFPROBE_BIN', 'ffprobe')
MODEL = 'upscayl-standard-4x'
Image.MAX_IMAGE_PIXELS = 4_194_304
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)
executor = ThreadPoolExecutor(max_workers=1)
slots = threading.BoundedSemaphore(4)
jobs, guard = {}, threading.Lock()

def auth(value):
    if not secrets.compare_digest(value or '', 'Bearer ' + TOKEN):
        raise HTTPException(401, 'Authentication required')

def run(args, timeout=120):
    return subprocess.run([str(x) for x in args], check=True, capture_output=True, timeout=timeout)

def update(job, **fields):
    with guard:
        job.update(fields)
        folder = ROOT / job['id']
        temporary = folder / 'state.tmp'
        temporary.write_text(json.dumps(job), encoding='utf-8')
        temporary.replace(folder / 'state.json')

def probe(path):
    data = json.loads(run([FFPROBE, '-v', 'error', '-protocol_whitelist', 'file,pipe', '-show_streams', '-show_format', '-of', 'json', path], 20).stdout)
    video = next(s for s in data['streams'] if s['codec_type'] == 'video')
    a, b = video.get('avg_frame_rate', '0/1').split('/')
    return int(video['width']), int(video['height']), float(data['format']['duration']), float(a) / max(float(b), 1)

def upscale(source, target):
    run([BIN, '-i', source, '-o', target, '-m', MODELS, '-n', MODEL, '-z', '4', '-s', '2', '-t', '128', '-j', '1:1:1', '-f', 'png'], 480)

def process(job):
    directory = ROOT / job['id']
    try:
        update(job, status='running', progress=5)
        source = directory / 'input.media'
        if job['kind'] == 'image':
            with Image.open(source) as image:
                if image.format not in ('PNG', 'JPEG', 'WEBP'):
                    raise ValueError('Unsupported image')
                image = ImageOps.exif_transpose(image)
                if max(image.size) > 4096 or image.width * image.height > 4_194_304:
                    raise ValueError('Image exceeds 4096px edge or 4 megapixels')
                image.convert('RGB').save(directory / 'normalized.png')
            upscale(directory / 'normalized.png', directory / 'result.png')
            result = directory / 'result.png'
            with Image.open(result) as image:
                output = dict(type='image/png', width=image.width, height=image.height)
        else:
            signature = source.read_bytes()[:16]
            if not (signature[4:8] == b'ftyp' or signature[:4] == b'\x1aE\xdf\xa3'):
                raise ValueError('Only MP4 and WebM containers are supported')
            width, height, duration, fps = probe(source)
            if duration <= 0 or duration > 10 or fps <= 0 or fps > 30 or max(width,height) > 1280 or min(width,height) > 720:
                raise ValueError('Video limit: 10 seconds, 720p, 30 fps')
            frames, enhanced = directory / 'frames', directory / 'enhanced'
            frames.mkdir(); enhanced.mkdir()
            run([FFMPEG, '-v', 'error', '-protocol_whitelist', 'file,pipe', '-i', source, '-an', '-vf', f'fps={fps}', '-frames:v', '300', frames / '%08d.png'])
            update(job, progress=20)
            upscale(frames, enhanced)
            update(job, progress=85)
            result = directory / 'result.mp4'
            run([FFMPEG, '-v', 'error', '-framerate', str(fps), '-i', enhanced / '%08d.png', '-protocol_whitelist', 'file,pipe', '-i', source, '-map', '0:v:0', '-map', '1:a:0?', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-c:a', 'aac', '-shortest', '-movflags', '+faststart', result])
            w, h, d, _ = probe(result)
            output = dict(type='video/mp4', width=w, height=h, duration=d)
            shutil.rmtree(frames); shutil.rmtree(enhanced)
        if result.stat().st_size > 64 * 1024 * 1024:
            raise ValueError('Output exceeds 64 MB')
        output['bytes'] = result.stat().st_size
        update(job, status='complete', progress=100, output=output)
    except ValueError as error:
        update(job, status='failed', error=str(error), progress=0)
    except Exception:
        update(job, status='failed', error='Enhancement failed; inspect worker configuration and GPU availability', progress=0)
    finally:
        slots.release()

def cleanup():
    for folder in ROOT.iterdir():
        if folder.is_dir() and len(folder.name) == 32 and all(c in '0123456789abcdef' for c in folder.name):
            state = jobs.get(folder.name)
            if (not state or state['status'] in ('complete', 'failed')) and time.time() - folder.stat().st_mtime > 3600:
                shutil.rmtree(folder)
                jobs.pop(folder.name, None)

@app.get('/health')
def health(authorization: str = Header(default='')):
    auth(authorization)
    available = lambda value: Path(value).is_file() or shutil.which(value) is not None
    ready = available(BIN) and available(FFMPEG) and available(FFPROBE) and all((Path(MODELS) / (MODEL + suffix)).is_file() for suffix in ('.bin', '.param'))
    return {'ready': ready, 'engine': 'upscayl-ncnn', 'model': 'upscayl-standard', 'scale': 2}

@app.post('/v1/jobs', status_code=202)
async def create(file: UploadFile = File(...), kind: str = Form('image'), scale: int = Form(2), model: str = Form('upscayl-standard'), authorization: str = Header(default='')):
    auth(authorization)
    if kind not in ('image', 'video') or scale != 2 or model != 'upscayl-standard':
        raise HTTPException(422, 'Supported: image/video, scale=2, model=upscayl-standard')
    cleanup()
    if not slots.acquire(blocking=False):
        raise HTTPException(429, 'Worker queue is full')
    identifier = uuid.uuid4().hex
    folder = ROOT / identifier
    folder.mkdir()
    try:
        count, limit = 0, (20 if kind == 'image' else 50) * 1024 * 1024
        with (folder / 'input.media').open('wb') as target:
            while chunk := await file.read(1024 * 1024):
                count += len(chunk)
                if count > limit:
                    raise HTTPException(413, 'Upload exceeds worker limit')
                target.write(chunk)
        if count == 0:
            raise HTTPException(422, 'Empty upload')
        job = dict(id=identifier, kind=kind, status='queued', progress=0, createdAt=time.time())
        jobs[identifier] = job
        update(job)
        executor.submit(process, job)
        return dict(id=identifier, status='queued')
    except Exception:
        shutil.rmtree(folder)
        slots.release()
        raise
    finally:
        await file.close()

def lookup(identifier):
    if identifier not in jobs:
        raise HTTPException(404, 'Job not found or expired')
    return jobs[identifier]

@app.get('/v1/jobs/{identifier}')
def status(identifier: str, authorization: str = Header(default='')):
    auth(authorization)
    cleanup()
    return lookup(identifier).copy()

@app.get('/v1/jobs/{identifier}/result')
def result(identifier: str, authorization: str = Header(default='')):
    auth(authorization)
    job = lookup(identifier)
    if job['status'] != 'complete':
        raise HTTPException(409, 'Result is not ready')
    filename = 'result.png' if job['kind'] == 'image' else 'result.mp4'
    return FileResponse(ROOT / identifier / filename, media_type=job['output']['type'], filename=filename, headers={'Cache-Control': 'no-store'})
