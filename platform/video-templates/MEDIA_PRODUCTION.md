# Edited template library

The shipped library in `dist/assets/produced` contains six finished examples, each with a purpose-made cover. The `dist/template-catalog.js` module is the single catalog for workspace cards. `segments` contains time boundaries and titles, not fixed four-second assumptions.

Five stock-footage examples are authored in `production-index.tsx`: real footage, timed text, word-highlight captions, voice tracks, instrumental score, fade and wipe transitions. Inputs and narration timings were retained from the existing project and re-rendered successfully in this task. The earlier pipeline failed because it checked the obsolete `hasAudio` metadata field; validation now checks `audioCodec` and playable H.264 metadata.

The sixth example, `interview-index.tsx`, uses an actual factual interview from NASA’s Goddard Space Flight Center with astronaut Megan McArthur, 2 June 2021. The 180–198-second excerpt retains its original English audio. A speaker nameplate, title, fade-in/out and a dedicated editorial cover are added. It is not an AI avatar, synthetic lip sync, customer testimonial or NASA endorsement of the website.

Sources and usage notes: `dist/assets/produced/sources.json`. Existing Mixkit footage is under the Mixkit Stock Video Free License; source-page links and original hashes are preserved. NASA material is acknowledged under its factual educational media usage guidance. No third-party paid music is used.

The production approach follows Remotion Superpowers' scene planning, audio-first timing, stock sourcing, captions, transitions, separate cover rendering and rendered-frame review. The original repository attribution/license remains in `UPSTREAM-LICENSE.txt`. No ElevenLabs, TwelveLabs or other external API was called or falsely represented as connected: the retained Russian narration is local Microsoft Irina synthesis; music is an original procedural synth score. The interview voice is real original speech.

Reproduction requires the ignored `public/production` input directory and original `public/hero` files. `production-catalog.json` gives the source filenames, text, timings and composition sizes. Download URLs are recorded in sources.json. Run `node production-render.mjs` and `node interview-render.mjs` from this directory after installing its locked dependencies.

The previews are rendered masters, but template creation uses separate editable inputs: `sourceMedia` lists the original raw videos in `dist/assets/source`, `editableSegments` supplies source trim ranges and editable titles/transitions, and `audioFile` supplies an independent narration/music track. The interview keeps original source audio (`originalAudio: true`). The exact visual timing of native editor transitions can differ slightly from the Remotion preview's overlapping transitions; the source material, titles and total duration are preserved. Do not import the flattened preview in place of these inputs when creating an editable template.
