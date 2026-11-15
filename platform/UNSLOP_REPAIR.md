# VMET / Unslop repair — 2026-11-15
Unslop by Damir Sokolovsky, https://heydamir.design/unslop — CC BY 4.0.

Direction: a working video-editing room. Calm, exact, concrete.
Existing white logo, monochrome interface and local Golos Text stay.
Real footage is the visual focus; timecodes are used only for real video.

Audit and resolution:
- Root overlap: ws-shell acquired grid columns but stayed display:flex, while
  ws-sidebar remained fixed and ws-main retained a second left offset.
  The shared layer now defines one actual grid and a sticky 240px sidebar.
- Public fixed headers covered headings. Headers now take space in document flow.
- Composer/model/banner used intersecting grid rows and wasteful empty areas.
  Model selection now lives inside the composer in normal document flow.
- Decorative frame glyph, three empty scene-label bars, duplicated card borders,
  section rules and selection stripes are removed.
- Headline/label sizes, 4px spacing rhythm, input padding and focus are normalized.
- Examples and all six current templates now use edited live-action footage:
  sports-car overview/detail, coffee preparation, and mountain-road aerial.
  The old ring, fake headphone and geometric illustration previews are no longer used.
- Demo editor assets also contain real footage. Existing user uploads/projects
  are not rewritten. The same legacy demo URLs remain for compatibility.
- Video frames have no baked titles at the native control strip. Examples do not loop.
- Unconfigured email cannot request a code; unavailable Yandex ID is hidden.
  The available ChatGPT action leads. No mail delivery is claimed without setup.
- Existing permission, quota, payment and secret rules remain unchanged.

Nine passes:
1 Spacing — uniform 20/24/32px task groups and card padding.
2 Color — neutral #111/#191919/#252525 surfaces, no extra accent effects.
3 Icons — retain existing aligned 18px line icons; remove decorative frame glyph.
4 Copy — actual tasks and footage categories; no future-capability filler.
5 Type — local Golos, restrained 500 heads, normal small-text tracking.
6 Layout — one shell grid, flowing public header, model within composer, phone drawer.
7 Details — clear fields, one primary action, keyboard focus and disabled states.
8 Visuals — six 12-second real-footage edits, three examples, renewed demo media.
9 Motion — preserve native play/pause and reduced-motion behavior, no new loop effects.

Media provenance:
dist/assets/footage/sources.json records source URLs, licenses and SHA256.
New sources verified as Mixkit Stock Video Free License:
https://mixkit.co/free-stock-video/latte-art-810/
https://mixkit.co/free-stock-video/aerial-shot-of-a-mountainous-relief-51780/
Car sources were retained from the existing licensed source manifest.
No image generation prompt was used: real video was explicitly requested.
Demonstrations are stock-footage edits, not claimed customer results.
