# Studio upgrade

- Homepage background and instructional video now autoplay muted, loop, and have no pause control. They pause offscreen/hidden to avoid unnecessary work and resume when visible. Editing controls remain in the editor.
- Ruble tariffs: Lite 790 RUB, Plus 1690 RUB, Pro 3490 RUB per 30 days. Quotas remain 5/14d, 7/7d, 10/7d. Prices stored as kopeks. Migration changes catalog prices but preserves legacy USD order currency. New NOWPayments orders use RUB price currency and USDT TRC20 settlement; final fulfillment checks exact amount, currency, network, order and finished status.
- Owner-only encrypted payment configuration, key removal and live connection test. No merchant account or key has been fabricated. Production has no payment credentials yet. Registration tabs have been prepared for the user's supplied email; password entry, terms and email confirmation remain with the owner.
- Public ChatGPT sign-in button removed. Email/Yandex entry points remain visible with accurate disabled/readiness state until providers are configured. Existing owner platform sessions and server authorization remain intact. The code flow, rate limits, expiry and single-use verification are covered by tests. Sending codes requires owner Resend setup and verified sending domain; Yandex OAuth needs its own client credentials.
- Multiple account-scoped browser-local brand kits, logo uploads (PNG/JPEG/WebP, decoded, max1MB/4096px), duplication and active selection. Active logo/color/tagline apply to an editable scene, persist on reload and appear in canvas exports.
- Chat rewritten as a flexible conversation column, not a fixed grid; verified 135.5px message area at1265x720 with no horizontal overflow, before it collapsed to8px.
- Voice mode (none/original/upload/AI), six selectable synthetic voices, speed, script, music mode, transitions, caption style and cover brief. AI settings persist server-side and are sent to the planner. Local planner still does not inspect video content.
- Real speech endpoint uses a permitted OpenAI connection, paid membership and5credits. Creates MP3, imports into editor, refunds provider failure. Without a connection it returns503 with no charge. Provider calls verified with a mock contract, not represented as a completed production synthesis. API documentation: https://developers.openai.com/api/docs/guides/text-to-speech
- Six edited video previews with card covers, original-format PNG covers, narration/music or human interview audio, timed text and transitions. Editable templates import original sources, separate audio and editable title/transition layers rather than flattened previews. NASA factual interview retains real English speech, not an avatar/endorsement. See video-templates/MEDIA_PRODUCTION.md and assets/produced/sources.json for provenance.

## Verification
Baseline55tests; modified62tests all pass. Browser QA: brand kit save/duplicate/reload/logo upload/apply/reload; AI voice selection/save; missing provider no-charge message; editable template creation,3clips with titles/transitions/audio and structural validation. Media QA all6 H264/AAC, cover and source trim validation; examples desktop/mobile/filter/playback tests recorded separately.

## Reusable implementation prompt

```text
Keep VMET's graphite editing desk: readable labels, restrained chrome, flexible chat message area, real edited footage and accessible forms. Preserve server authorization, paid entitlements and encrypted provider keys. Never treat saved API settings as proof of external service activation. Test provider failures/refunds, legacy currency and editable template source trims before publishing.
```
