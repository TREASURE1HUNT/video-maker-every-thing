# Real-footage home demo

Output: `../dist/assets/hero/intro.mp4` and `intro.jpg`.

The hero is a 12-second, three-scene edited demo: red sports-car exterior, side details, illuminated dashboard. It is an original montage, not a reupload of a TikTok video. Captions do not claim model specifications, price or condition. No looping or audio track is encoded; the browser controls playback.

Reproduce from this folder after installing the existing lockfile:

```text
node hero-download.mjs
node hero-render.mjs
```

`public/hero/` contains the original downloaded clips and is ignored by Git. The download script records original source URLs, exact source-page Free License checks, sizes and SHA256 hashes. The public website receives only the edited montage, not an unmodified stock-footage download library. Mixkit source URLs and license page are in `../dist/assets/hero/sources.json`. A captured license HTML copy is `hero-license.html`.

Render uses the existing Remotion package and `hero-index.tsx`, then transcodes full-range intermediate output to H264 yuv420p(tv) with faststart. Sources total 9,757,614 bytes. Final MP4 is about1.87MB, 1280x720, 30fps and12seconds. `verification.json` records actual measured output. The three rendered scenes were visually inspected via intro.jpg and QA stills atframes160/280.
