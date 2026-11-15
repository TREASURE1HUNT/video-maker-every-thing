# Voice worker: Coqui / F5-TTS / Chatterbox / Fish Speech

This is a runnable authenticated bridge, **not a claim that four GPU servers are already deployed**. The site runs on a small Cloudflare Worker; model inference runs on a separate operator-managed server. Hosted Fish Audio through OpenRouter is separate and has been tested with real generated Russian audio.

Install one upstream per isolated Python environment, following its official version/hardware requirements:
- https://github.com/coqui-ai/TTS
- https://github.com/SWivid/F5-TTS
- https://github.com/resemble-ai/chatterbox
- https://github.com/fishaudio/fish-speech

Then install `fastapi`, `uvicorn`, `soundfile`, `requests` in that same environment. The bridge imports the selected upstream lazily; it does not execute commands supplied by users. Choose appropriate model weights and their license before activating commercial use. F5's default pretrained weights are noncommercial; its default language coverage is not a promise of Russian synthesis. Use suitable separately licensed/language-compatible weights. Coqui and Fish code/weights also have their own conditions.

Example server launch (Linux GPU host; same app can run in an appropriately configured container):

```bash
export TTS_ENGINE=chatterbox # coqui | f5 | chatterbox | fish
export TTS_DEVICE=cuda
export VOICE_SERVICE_TOKEN="$(python -c 'import secrets;print(secrets.token_urlsafe(48))')"
export VOICE_PRESETS=/voices/voices.json
uvicorn app:app --host 127.0.0.1 --port 8090 --workers 1
```

Expose this service through your own HTTPS reverse proxy with request limits/timeouts. Keep the bearer token server-only. Add its public HTTPS base URL and token to VMET Admin → AI and skills → Voiceover. Save, test actual synthesis, then enable access and choose Lite/Plus/Pro and request credit cost. No service becomes available merely because its skill is installed.

Server-controlled voice presets, never client filesystem paths:
```json
{"default":{"path":"/voices/authorized-speaker.wav","text":"Exact transcript of the reference recording."}}
```
For Chatterbox the default preset can be `{}` to use its own generic voice. For Fish, start the upstream official API server separately and set `FISH_NATIVE_URL`, `FISH_NATIVE_TOKEN`; presets can contain a native `reference_id`. Coqui/F5 need a suitable operator-provided reference. The wrapper does not take arbitrary reference URLs or files from public clients.

Contract: POST `/v1/audio/speech`, Authorization Bearer, JSON `{input, voice, language, speed, response_format}` → WAV. Only F5 currently applies custom speed; leave other self-host engines at 1×. Validate on your chosen hardware/model before enabling in production. `/health` is authenticated and reports loading state. Single inference at a time, text max2000 chars, output max12MB. Python syntax and mocked site/backend contracts were tested; GPU inference for these four self-host engines was not run in this task.
