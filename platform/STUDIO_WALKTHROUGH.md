# Homepage studio walkthrough / 2026-11-15
Changes:
- Remove the top brand lockup and bottom slogan/scene counter from the authored
  background film. Real website navigation remains.
- Share a full-viewport navigation layout on index/product/examples/order pages.
  Brand left, navigation centered, studio/account controls right; phone uses two rows.
- Replace the workflow section's car still with a native, controllable real studio recording.

Recording:
A disposable localhost paid-demo fixture runs the production site's existing
editor code and server permissions. It does not create or modify production users.
The video records actual import of two licensed files, addition to the timeline,
split into three clips, typing a title, playback, and export to PNG.
Import, clip counts, title input and generated PNG 1280x720 are asserted.
A transparent toBlob observer captures actual PNG bytes for QA while preserving
the original callback. A small cursor indicator is recording-only.
Chrome's CDP screencast captures the interaction; Remotion adds step captions.
No neural model, speech recognition or automatic content-analysis claims.
Source footage remains the already documented Mixkit car footage.
