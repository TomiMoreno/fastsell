CREATE TABLE `fastsell_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `fastsell_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fastsell_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`lastName` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fastsell_user_email_unique` ON `fastsell_user` (`email`);