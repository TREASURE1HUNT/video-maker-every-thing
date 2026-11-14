# VMET design system

Hallmark 2.0.0, full redesign. Modern-minimal app screens, Console-derived monochrome by user request. Brand logo and existing route contracts stay. No route removed.

- Neutral surfaces and type only. Colors and font families are declared in dist/tokens.css. User media and user-selected brand colors in the editor are content, not interface colors; never silently recolor an exported video.
- Paper: 12/255 neutral; panels:22/255; deeper fields:8/255; text:248/255; muted:176/255; focus:248/255. Field edge:144/255. No glow or gradients.
- Segoe UI/system body and heads; 400/500, wordmark700. Labels14, body16, screen head32/40. Mono only measured times/IDs.
- One white primary, one outlined secondary. Focus instant, native disabled semantics, 44px hit targets. No decorative status dots, tracked labels, emoji icons or arrow suffixes.
- Capped1680px shell,232px sidebar, content cap1400px. Sidebar becomes explicit menu below960px. Form/profile pairs become one column on phones. Media grids use minmax(0,1fr).
- Signature: an actual project composition/timeline, not fabricated dashboard metrics. Home leads with the project brief and model selection. Profile leads with editable identity; subscription with quota and real invoices.
- Server facts win: no account without SSO, no paid access without active subscription, no payment success from redirect. Read-only preview is distinct from creation.
- Local media/projects are browser- and origin-scoped. Account export excludes API secrets. Clearing local storage requires typed confirmation and does not remove billing history.
