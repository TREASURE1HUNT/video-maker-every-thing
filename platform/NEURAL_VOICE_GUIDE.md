# Neural voice and model access

The supplied OpenRouter credential is stored only as a Sites production secret OPENROUTER_API_KEY. No key appears in source or client assets. Runtime catalog connections reference that server secret, preserve per-user model allowlists and paid-tier checks, and can be disabled/retiered through admin controls.

## Models
- Lite: OpenRouter Auto (free model routing),1service credit/request.
- Plus: Lite plus Gemma4free,2service credits/request. GPT4.1mini and Gemini2.5Flash are catalogued for Plus but disabled until provider funding/enablement.
- Pro: all lower tiers; GPT4.1 and ClaudeSonnet4.5 are catalogued for Pro, initially disabled pending OpenRouter balance.
Actual key probe returned200. Live free routing returned a validated JSON montage plan. A small GPT4.1mini ping returned200, but paid ElevenLabs and Claude requests returned402 insufficient provider credits; no general paid-model availability is claimed. The model list was checked against the current public OpenRouter API.

Onboarding: active existing paid subscriptions with zero service credits receive their included starting pack once (Lite100,Plus350,Pro1000), with a deterministic ledger/audit receipt. This does not alter subscription prices, dates or video quotas. Purchasing or granting a paid provider balance is a separate action.

## Voiceover
FishAudioS2.1Pro free endpoint through OpenRouter was called successfully for all15scene narration files. The five old desktop-Irina narrated previews are replaced with versioned neural-v2 MP4s and independent audio stems. Default hosted Fish voice is advertised as its natural default, not an invented list of selectable unsupported voices. It uses natural speed1x. OpenAI direct connections retain their6voices and speed control.

Four separate repository-backed engines are configurable in Admin→AI and skills→Voiceover: Coqui(Lite),F5(Plus),ChatterboxMultilingual(Plus),FishSpeech(Pro). Each has an editable HTTPS base URL, encrypted server token, voice preset ID, tier, request credit cost and actual synthesis test. They remain unavailable until an external inference server exists and is configured. Skill instructions do not install or run model code in the web Worker. Four voice-planning skills are included and linked to the upstream repositories.

The authenticated runnable worker bridge and4mocked HTTP/inference-contract tests are in services/voice-worker. Python syntax and contract tests passed. GPU/model-weight inference for the four self-hosted engines was not run or represented as live. Tokens are never sent to the browser, and the OpenRouter key is never forwarded to self-host endpoints.

## Subtitles and previews
All6previews are1280x720. Captions use large dark-backed typography with a native-player-control safe zone; the NASA interview has8accurate EN/RU cues, burnt-in translation and EN/RU SRT/VTT files. Its original human voice remains unchanged. Five other templates use neural Russian narration, audio-aligned captions, independent editable raw clips, titles, transitions and cues. New template creation imports and enables t.cues instead of silently leaving captions off. Existing previously created projects are not overwritten.

See video-templates/NEURAL_CAPTION_UPGRADE.md for transcripts and media production details; source provenance remains in assets/produced/sources.json.

## Reusable test prompt

```text
Create a VMET montage using only the supplied asset IDs, durations and verified speech. Return the documented JSON plan, never invented media or timing. Use the chosen tier-eligible model and configured voice engine. If a voice backend is not connected or the provider has no funds, report that state and refund reserved credits; never substitute desktop speech while calling it neural. Import timed caption cues and keep captions above native video controls.
```
