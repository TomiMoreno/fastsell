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
--> statement-breakpoint
CREATE TABLE `fastsell_product_sales` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`price` real NOT NULL,
	`amount` integer NOT NULL,
	`product_id` text NOT NULL,
	`sale_id` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `fastsell_products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sale_id`) REFERENCES `fastsell_sales`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fastsell_products` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`organization_id` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer NOT NULL,
	`image` text NOT NULL,
	`hotkey` text,
	`category` text,
	FOREIGN KEY (`organization_id`) REFERENCES `fastsell_organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fastsell_sales` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`total` real NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `fastsell_organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fastsell_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`organization_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `fastsell_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`organization_id`) REFERENCES `fastsell_organizations`(`id`) ON UPDATE no action ON DELETE cascade
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