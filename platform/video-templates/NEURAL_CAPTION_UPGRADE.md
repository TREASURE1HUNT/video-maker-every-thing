# Neural narration and readable subtitles

## Current rendered library

All six active previews use 1280×720 landscape composition rather than narrow portrait video inside a wide player. Auto/story retain raw material that can be reframed to 9:16 in the editor. Narration captions are rendered at 46px with high-contrast dark plates; scene titles are 60px. The prior desktop Microsoft Irina voice is not used by the active v2 catalog.

Native-player safe zone: all caption plates end 180px above the intrinsic 720px lower edge (25% reserved for playback controls). The interview image is panned upward 80px so its bilingual caption band stays below the speaker's face while remaining above the controls in an actual 432×243 browser player. Catalog metadata exposes `captionStyle.safeBottom: 180` and `nativeControlsReserve: true`. Browser screenshots with controls explicitly visible verify the small-player layout; bare Remotion frames alone are not accepted as evidence of this fix.

Five narrated films use actual neural FishAudio S2.1 Pro output created through OpenRouter (`fish-audio/s2.1-pro-free:free`). Exact scene scripts and generation metadata without credentials are in `neural-production.json`. Caption timing is measured from these new scene WAVs using local Whisper. Text is checked against the supplied scripts so hallucinated credit text during trailing silence is not displayed. Scene durations come from the real neural audio, not old desktop-voice timings. Independent AAC stems and editable caption cues ship with the originals.

## NASA interview

Source: NASA’s Goddard Space Flight Center, https://svs.gsfc.nasa.gov/13868/ — the 180–198-second excerpt of `ISS_HIGH_DEF_FEED.webm`. The official page and API contain no subtitle track/transcript. The linked YouTube URL is an unplayable scheduled live record, so no official VTT is claimed.

The English transcript is derived from the original English source audio and cross-checked using Whisper base and small.en. The Russian translation follows the actual spoken content. The excerpt begins mid-sentence and is marked with an ellipsis. Eight cues have EN/RU SRT and VTT sidecars and editable catalog cue data. Both English (27px) and Russian (44px) are burned into the preview, below the speaker’s face. The original voice is retained, not replaced or cloned.

Transcript:

> …low Earth orbit. But the way they do it is a little bit different. The space shuttle also can take large payload into orbit. So it requires a huge amount of fuel to get the space shuttle into low Earth orbit. And the solid rocket boosters, when you first light off and get off the launch pad, you're kind of shaking, you're rocking and rolling.

Sources remain factually credited. No claim of NASA endorsement, customer testimonial or AI avatar is made.

## Commands

From the project `video-templates` directory:

```sh
node interview-render-v2.mjs
node neural-render-v2.mjs auto product
node neural-render-v2.mjs story travel promo
```

The render helper expects the corresponding generated WAVs and aligned `*-neural-words-N.json` inputs in the ignored production input directory; it produces versioned MP4/cover/audio/caption assets and inspection stills. Production caption sources live in `production-catalog.json`; the interview’s bilingual source is `interview-captions.json`. API keys are not embedded in source, output media, or metadata.
