# Upscayl enhancement integration

The editor exposes **Улучшить качество** above the preview. Users select a library video/photo, see the extra credit price, submit a job, inspect progress, compare original/result, download or explicitly add the result as a new library file. Original media is never overwritten. Closing the window leaves the server job running; reopen and select a recent job to resume checking.

## Billing and limits
- Defaults: video10 credits/file, image3 credits/file, minimum Lite. Administrator can change both prices and tier.
- Reserve once at accepted submission; request key prevents duplicate charges. Worker rejection, explicit failure, unknown job or undelivered expired output refunds once. Transient polling errors do not cause extra charges; checking can be retried.
- Images: PNG/JPEG/WebP, <=20MB, <=4MP/4096px. Videos: MP4/WebM, <=20MB, <=10sec, <=720p/30fps. Output fixed2x PNG/MP4; max64MB. Longer source videos must first be reduced to a supported short clip. This release does not silently trim or degrade originals.
- Authenticated owner-only jobs/results, paid submission and plan checks, one active job per account. Credit price is server-side, never accepted from the browser.
- Worker endpoint and bearer token remain server-side; token encrypted with AI_CONFIG_KEY. No client-supplied result URL. Redirects not followed. Output streams through the authorized site API.

## Connect the separate server later
The production configuration is intentionally absent/disabled, reflecting the owner's choice to connect a separate server later. There are no live charges while unconfigured.

1. Deploy `services/upscayl-worker` to the GPU server using its README. The actual official Upscayl NCNN executable/model and FFmpeg are required; code does not bundle binaries/weights.
2. Admin → ИИ и скиллы → Улучшение качества · Upscayl.
3. Save HTTPS endpoint + secret token with the feature disabled.
4. Click **Проверить готовность API**. This checks auth/component readiness, not GPU inference quality.
5. Enable and save. Now eligible users can submit real work.

## Evidence
This release was checked with an actual GTX1660, not only mocks. The site API submitted a160x90,0.5sec MP4 to the local private worker, received a320x180 MP4, and deducted10 credits from a disposable100-credit fixture. The browser repeated the end-to-end workflow and added the result as a separate file. Local testing used an explicit test-only HTTPS-fixture→127.0.0.1 transport mapping; no localhost exception or GPU tunnel was added to production. No production provider credentials or user balances were used.

Source/API tests also cover unconfigured no-charge, encrypted configuration, admin roles, health gating, job ownership, duplicate keys, redirect rejection, concurrent jobs and exactly-once refunds. `outputs/enhance-evidence/VERIFICATION.txt` records exact commands and publication.

## Rollback
Keep database tables/job history. Disable enhancement first; settle/refund outstanding jobs before restoring the previous source release. The supplied source ROLLBACK.sh only extracts baseline into an empty separate directory. It does not revert production balances or remove user files.
