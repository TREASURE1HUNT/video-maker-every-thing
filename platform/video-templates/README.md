# VMET motion templates

Six original, silent motion-graphic templates. Generated using the production breakdown, scene sequencing and transition workflow in DojoCodingLabs/remotion-superpowers, pinned commit `970efd2d2f4ce2492231a31ee684c2ead883f4bc` (MIT notice retained). Markup and renderer APIs follow official Remotion skills and documentation. No provider-generated footage, voice or music is claimed; these are real deterministic Remotion MP4 renders, not AI footage.

Each composition contains three 128-frame scenes with two 12-frame overlapping transitions: `128 * 3 - 12 * 2 = 360` frames at 30 fps, exactly 12 seconds. Portrait safe areas and legible Russian headlines are built into the source. Product/car/mountain visuals are original SVG drawings.

## Reproduce

Install Node.js, run `npm ci` here, then `npm run render`. The render script uses Google Chrome on Windows by default; set `VMET_RENDER_BROWSER` to a different executable when needed. Output goes to `../dist/assets/remotion` including MP4s, PNG posters, manifest and measured verification metadata. No API keys are required. Dependencies are pinned to Remotion 4.0.543.

`catalog.mjs` provides scene names, timings, presets and web asset paths. Project-specific media and captions can be layered/trimmed in the VMET editor after template selection. The pre-rendered SVG graphics and baked typography remain within the MP4 source; changing their internal design requires a new Remotion render with edited catalog/source.

Source guidance:
- https://github.com/DojoCodingLabs/remotion-superpowers/tree/970efd2d2f4ce2492231a31ee684c2ead883f4bc/skills
- https://www.remotion.dev/docs/transitions/transitionseries
- https://www.remotion.dev/docs/renderer/render-media

Remotion's own license applies to its packages independently of the upstream MIT skill license.
## Verification (2026-11-15, Asia/Krasnoyarsk)

`node render.mjs` exited 0 and produced all six MP4s and six PNG posters. `node verify.mjs` exited 0. Each output: H264, 30fps, 12 seconds, browser-playable and seekable; dimensions agree with the manifest and PNG. Frames at65/30s and95/30s differ for every template, proving the previews are not static images. All six poster images were reopened and visually inspected; lesson/promo second scenes were also extracted and inspected. No clipping/overlapping headlines was observed in the inspected frames.

The previews are intentionally silent. Three scene durations are128frames each; two12frame transitions overlap, yielding360frames. All provider API credentials remain unnecessary for these original vector motion graphics.
