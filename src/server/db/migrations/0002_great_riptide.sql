CREATE TABLE `fastsell_organization_users` (
	`user_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`role` text NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `fastsell_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `fastsell_organizations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fastsell_organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`logo` text NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
