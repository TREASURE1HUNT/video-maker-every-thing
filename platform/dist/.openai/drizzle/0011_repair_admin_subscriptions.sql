-- Repair previously saved paid labels only when an administrator explicitly saved the user.
-- Existing subscriptions (including expired ones) are not renewed.
INSERT OR IGNORE INTO audit SELECT 'legacy-plan-repair:'||u.id,'schema-migration','billing.legacy-repair',u.id,'{"reason":"paid label saved by admin without subscription","days":30}',strftime('%Y-%m-%dT%H:%M:%fZ','now') FROM users u WHERE u.plan IN ('lite','plus','pro') AND NOT EXISTS(SELECT 1 FROM subscriptions s WHERE s.user_id=u.id) AND EXISTS(SELECT 1 FROM audit a WHERE a.entity=u.id AND a.action='users.save');
--> statement-breakpoint
INSERT INTO subscriptions SELECT u.id,u.plan,strftime('%Y-%m-%dT%H:%M:%fZ','now'),strftime('%Y-%m-%dT%H:%M:%fZ','now','+30 days'),'legacy-admin-repair' FROM users u WHERE u.plan IN ('lite','plus','pro') AND NOT EXISTS(SELECT 1 FROM subscriptions s WHERE s.user_id=u.id) AND EXISTS(SELECT 1 FROM audit a WHERE a.id='legacy-plan-repair:'||u.id) ON CONFLICT(user_id) DO NOTHING;
