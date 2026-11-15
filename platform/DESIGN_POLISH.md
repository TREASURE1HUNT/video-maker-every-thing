# VMET · Cut room refinement
Date: 2026-11-15

Product: a video workspace for authors, with editing, footage, chat, and account access.
Character: exact, restrained, editorial.
World: an editing suite; dark neutral work surfaces, frames and timeline tracks.
Moments: the existing real car montage and actual editable video composition.
Signature: a slim white selection edge, shared by navigation and timeline clips.

Audit:
- Landing forced every section to viewport height, causing large empty gaps.
- Public/app/admin had different surface hierarchy and field density.
- Account profile and context were weakly separated.
- Studio toolbar and timeline controls competed visually with footage.
- Phone studio put all panels in a long page and hid task navigation.
- Caption inherited a column treatment; corrected for compact phone presentation.

Passes:
1. 4px spacing rhythm; bounded page sections, uniform card padding.
2. Neutral #101010 / #161616 / #1c1c1c surfaces, quieter #303030 edges.
3. Existing line icons and logo retained; no decorative generated artwork.
4. Plain functional labels; existing product/price statements retained.
5. Local Golos Text retained, measured hierarchy and tabular numbers.
6. Profile/context as separate surfaces; responsive layouts and phone task tabs.
7. White primary actions, clear selection/focus, structured dialogs and forms.
8. Original footage preserved, native video playback controls retained.
9. Reduced-motion override; no new attention animations.

No change to account permissions, subscription gates, secret handling, database,
AI provider calls or video export pixels. This is a presentation/task-layout pass.
The shared layer is dist/polish.css; admin/src/polish-admin.css adds dense data views.
Source credit: Unslop by Damir Sokolovsky, https://heydamir.design/unslop (CC BY 4.0).
Browser QA also found a pre-existing profile form bug: readonly email was submitted to a server endpoint that correctly rejects identity changes. The client now sends only name, timezone and default_model; server protection is unchanged.
