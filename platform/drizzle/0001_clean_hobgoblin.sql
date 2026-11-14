CREATE TABLE `cloud_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`model_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`price_minor` integer NOT NULL,
	`credits` integer NOT NULL,
	`status` text NOT NULL,
	`payment_id` text,
	`pay_amount` text,
	`pay_address` text,
	`pay_currency` text,
	`created_at` text NOT NULL,
	`last_checked` text,
	`activated_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_payment_id_unique` ON `orders` (`payment_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`price_minor` integer DEFAULT 0 NOT NULL,
	`credits` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`user_id` text PRIMARY KEY NOT NULL,
	`plan` text NOT NULL,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`source` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `models` ADD `min_plan` text DEFAULT 'lite' NOT NULL;