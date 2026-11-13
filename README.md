# Video Maker Every Thing

Multipage video studio concept with an Invideo-inspired editorial design.

Pages: home, examples, product, editor, order brief.

Working demo features: local video preview, text styling, aspect ratio selection, sample transitions, PNG cover export and downloadable brief. AI montage, speech recognition and rendered MP4 export are not connected.

## Run locally

python -m http.server 4173

Open http://127.0.0.1:4173/.

## Hosting

Static HTML/CSS/JavaScript. GitHub Pages: deploy main branch, root directory.

Original logo and cinematic illustration generated for this project. Demo MP4s are illustrative assets created for the website, not exports from the editor. Three.js 0.170.0 is distributed under the MIT license: https://github.com/mrdoob/three.js/blob/r170/LICENSE.

## Studio workbench

The editor now includes local video/photo/audio import, a scene timeline, trim/speed/reorder/undo, text overlays, SRT import/export, background music, IndexedDB persistence, PNG covers, JSON projects, TXT briefs and real-time WebM recording.

The local assistant is rule-based, not a neural model. Provider/model selection and a configurable server URL are ready for an external AI backend. No provider API keys are embedded. See [EDITOR_GUIDE.md](EDITOR_GUIDE.md) and [AI_ENDPOINT.md](AI_ENDPOINT.md).
