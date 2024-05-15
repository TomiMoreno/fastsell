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
	`name` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer NOT NULL,
	`image` text NOT NULL,
	`hotkey` text
);
--> statement-breakpoint
CREATE TABLE `fastsell_sales` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`total` real NOT NULL
);
