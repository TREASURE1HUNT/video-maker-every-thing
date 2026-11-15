CREATE TABLE `auth_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`code_hash` text NOT NULL,
	`browser_hash` text NOT NULL,
	`ip_hash` text NOT NULL,
	`attempts` integer NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	`used_at` text,
	`consumed_by` text
);
--> statement-breakpoint
CREATE TABLE `auth_config` (
	`id` text PRIMARY KEY NOT NULL,
	`mail_from` text NOT NULL,
	`mail_secret` text NOT NULL,
	`mail_enabled` integer NOT NULL,
	`yandex_client_id` text NOT NULL,
	`yandex_secret` text NOT NULL,
	`yandex_enabled` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_identities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`subject` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_oauth_states` (
	`id` text PRIMARY KEY NOT NULL,
	`verifier` text NOT NULL,
	`link_user` text,
	`expires_at` text NOT NULL,
	`used_at` text
);
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`method` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX auth_codes_email_time ON auth_codes(email,created_at);
--> statement-breakpoint
CREATE INDEX auth_codes_ip_time ON auth_codes(ip_hash,created_at);
--> statement-breakpoint
CREATE INDEX auth_sessions_user ON auth_sessions(user_id);
