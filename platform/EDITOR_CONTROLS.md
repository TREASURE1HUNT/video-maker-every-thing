# Studio controls upgrade

## Credits
Per successful AI text/planning/cover-proposal request: Auto5, Gemma8, GPTmini12, Gemini12, GPT25, Claude35 credits. The price and current balance appear beside the model selector. Provider failures refund the reservation; repeated request IDs do not charge twice. Administrator overrides remain available. Paid models remain disabled until separately funded/enabled; higher internal credit prices do not create an external provider balance.

Local editing, subtitle editing, PNG rendering and rule-based local plans do not consume provider tokens or site credits. Provider token limits were not artificially inflated.

## Subtitles
Open **Субтитры**. Add a row at the playhead, enter start/end seconds and text, then **Сохранить субтитры**. Overlap, empty text and times outside the project are rejected. Jump to a row, split it at the playhead or delete it. **Разбить длинные реплики** creates short phrases with distributed timing; review before saving. SRT import/export and the advanced text form remain available.

Fonts: locally bundled Golos Text and Roboto Condensed (OFL license included). Choose plate/outline/shadow, position, size and safe margin. The settings persist in project JSON and appear in rendered WebM.

## Brand kits
Legacy single-kit IDs are migrated and persisted once. Create, duplicate and save multiple kits in the current account/browser. PNG/JPEG/WebP logos up to20MB and64MP are decoded and optimized to1200px WebP, preserving transparency. Optimized data is bounded rather than silently truncated. The save button waits for decoding. In the editor pick a kit and apply to selected/all scenes. Scene titles remain intact unless replacement is explicitly selected. Clearing brand styling is explicit. Existing project branding survives reload/export.

## Covers
Use **Обложка** above the preview, **Экспорт → Обложка PNG**, or the assistant's cover action. Styles: informative, clickbait, minimal, editorial. Pick a frame from the actual timeline, write headline/subtitle, adjust shading and optionally include the active brand logo. The preview/export is a new composited PNG at the project aspect, not an unchanged canvas screenshot. Caption overlays are excluded. Settings persist per project.

The assistant can return a validated cover text proposal without inventing footage. Users review the constructor before downloading. For an empty project a typographic background is used; no video source is fabricated.

## Verification
See outputs/studio-controls-evidence: baseline74 tests, modified81 tests, rendered WebM/frame, two downloaded PNG covers, branded project JSON, browser checks and tested source rollback. Production version recorded in VERIFICATION.txt.
