CREATE TABLE telegram_config (id text PRIMARY KEY, enabled integer NOT NULL DEFAULT 0, bot_secret text NOT NULL DEFAULT '', username text NOT NULL DEFAULT '', app_url text NOT NULL DEFAULT '', welcome text NOT NULL, updated_at text NOT NULL);
--> statement-breakpoint
CREATE TABLE telegram_updates (id integer PRIMARY KEY, created_at text NOT NULL);
--> statement-breakpoint
CREATE TABLE telegram_proofs (id text PRIMARY KEY, created_at text NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX auth_identity_subject_unique ON auth_identities(provider,subject);
