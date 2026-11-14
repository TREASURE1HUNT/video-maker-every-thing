CREATE TABLE `ai_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`provider` text NOT NULL,
	`model_id` text NOT NULL,
	`enabled` integer NOT NULL,
	`secret` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `video_skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`instructions` text NOT NULL,
	`enabled` integer NOT NULL,
	`min_plan` text NOT NULL,
	`source` text NOT NULL,
	`revision` text NOT NULL,
	`updated_at` text NOT NULL
);
