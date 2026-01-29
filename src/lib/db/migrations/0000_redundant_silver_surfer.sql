CREATE TABLE `item_relations` (
	`from_item_id` text NOT NULL,
	`to_item_id` text NOT NULL,
	`relation_type` text NOT NULL,
	PRIMARY KEY(`from_item_id`, `to_item_id`, `relation_type`),
	FOREIGN KEY (`from_item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to_item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_item_relations_to` ON `item_relations` (`to_item_id`);--> statement-breakpoint
CREATE TABLE `item_tags` (
	`item_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`item_id`, `tag_id`),
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_item_tags_tag` ON `item_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`collection_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text,
	`category_id` text,
	`icon` text,
	`source` text,
	`source_url` text,
	`added_date` text,
	`flavor_heat` integer,
	`flavor_sweet` integer,
	`flavor_zest` integer,
	`flavor_heft` integer,
	`status_id` text DEFAULT 'published' NOT NULL,
	`submitted_by` text,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_items_collection_slug` ON `items` (`collection_id`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_items_collection` ON `items` (`collection_id`);--> statement-breakpoint
CREATE INDEX `idx_items_status` ON `items` (`status_id`);--> statement-breakpoint
CREATE INDEX `idx_items_category` ON `items` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_items_flavor_heat` ON `items` (`flavor_heat`);--> statement-breakpoint
CREATE INDEX `idx_items_flavor_sweet` ON `items` (`flavor_sweet`);--> statement-breakpoint
CREATE INDEX `idx_items_flavor_zest` ON `items` (`flavor_zest`);--> statement-breakpoint
CREATE INDEX `idx_items_flavor_heft` ON `items` (`flavor_heft`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);