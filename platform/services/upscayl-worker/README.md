# Private Upscayl worker

A separate GPU service, not the desktop application. Image enhancement invokes the real official `upscayl-bin`; video enhancement extracts frames with FFmpeg, upscales every frame, re-encodes H.264 and preserves optional original audio. It does not invent missing detail accurately and is not a generative video model.

## Install on the future server

Python 3.11+, FFmpeg/ffprobe, a Vulkan-capable GPU and the official NCNN binary are required. Install `pip install -r requirements.txt`. Download the official platform binary and `upscayl-standard-4x.bin` + `.param` into operator-owned folders. No global desktop installation is needed.

Set these server-only environment variables:

```
UPSCAYL_SERVICE_TOKEN=<random secret at least 32 characters>
UPSCAYL_BIN=/opt/upscayl/upscayl-bin
UPSCAYL_MODELS=/opt/upscayl/models
FFMPEG_BIN=/usr/bin/ffmpeg
FFPROBE_BIN=/usr/bin/ffprobe
UPSCAYL_JOBS_DIR=/var/lib/upscayl/jobs
```

Run `uvicorn app:app --host 127.0.0.1 --port 8091`. Place behind an authenticated HTTPS reverse proxy/private network. Configure proxy request-body limit 51 MB, rate limiting, and a dedicated unprivileged account/container with no network egress, CPU/memory/disk quotas. One worker process only; queue state is intentionally in memory, and jobs must be retried after a restart. The site must detect unknown jobs and refund its reserved credits. Do not enable public CORS or send this token to browsers. Do not connect to production until the operator supplies the separate server URL/token.

## HTTP contract

Every endpoint requires `Authorization: Bearer <UPSCAYL_SERVICE_TOKEN>`.

- `GET /health`: `{ready,engine:"upscayl-ncnn",model:"upscayl-standard",scale:2}`. Readiness verifies executable/model presence, not a successful GPU inference.
- `POST /v1/jobs`: multipart `file`, `kind=image|video`, `scale=2`, `model=upscayl-standard`. Returns HTTP202 `{id,status:"queued"}`. No URLs or filesystem paths accepted.
- `GET /v1/jobs/{id}`: `{id,kind,status,progress,createdAt,error?,output?}`. Status queued/running/complete/failed; output has `type,width,height,bytes,duration?`.
- `GET /v1/jobs/{id}/result`: PNG or MP4 attachment when complete; otherwise409. Unknown/expired job404.

Inputs: PNG/JPEG/WebP <=20 MB, <=4 MP and <=4096px edge. MP4/WebM <=50 MB, <=10sec, <=1280x720 (portrait allowed), <=30fps. Fixed2x output; fixed operator-selected standard4x model with documented2x output scaling. Queue4, one GPU process, subprocess timeouts, output <=64 MB. Finished job files expire after1h on API activity. Private intermediate files reside only below random job IDs. Put the jobs directory on a quota-limited volume; external requests should also be capped by the site. Client filenames are ignored.

Billing belongs to the site backend: reserve once before submission, poll server-to-server, download only from the configured worker, settle only after a verified completed result, and refund failed/expired/restarted jobs. Never charge a disabled/unconfigured worker. Do not accept output URLs from users.

## Official sources and license

- https://github.com/upscayl/upscayl — AGPL-3.0, desktop project and standard model files under resources/models.
- https://github.com/upscayl/upscayl-ncnn — AGPL-3.0, real CLI backend.
- https://github.com/upscayl/upscayl-ncnn/releases/tag/20251207-174704 — tested Windows binary release.
- https://github.com/upscayl/upscayl-ncnn/blob/master/src/main.cpp — documented CLI flags.
- https://github.com/upscayl/upscayl/tree/main/resources/models — model origin; preserve included notices and review model terms when distributing.

The worker source does not bundle model weights or binaries. Operators distributing or serving modified AGPL components must preserve applicable license/source obligations. FFmpeg licensing depends on the selected build. Unit tests use a stub inference function; actual GPU verification is separately recorded in the workspace evidence folder.

## Verification commands

Install test dependencies with `pip install -r requirements-dev.txt`; run `python test_worker.py`. The lifecycle tests stub only the GPU call, not authentication, uploads, output routing, or limits. For actual inference, configure the real binary/model paths above, submit a small image and video to the local worker, then compare dimensions with ffprobe/Pillow. GPU drivers and model initialization must be validated again on the future server.

Local workspace verification on GTX1660: official Windows CLI produced a640x360 PNG from320x180 input; the exact worker frame pipeline produced320x180 MP4 from160x90,0.5sec/3frames input. Both exited0. This is local inference evidence, not deployment. Source video was the existing site car-front.mp4; no new stock media was fetched by this worker.
