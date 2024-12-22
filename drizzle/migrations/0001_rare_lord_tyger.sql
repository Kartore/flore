CREATE TABLE `environment` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`displayId` text NOT NULL,
	`description` text,
	`projectId` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_environment_id_project_id` ON `environment` (`id`,`projectId`);--> statement-breakpoint
CREATE TABLE `featureType` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`expires` integer NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feature` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`featureTypeId` text NOT NULL,
	`description` text,
	`environmentId` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	FOREIGN KEY (`featureTypeId`) REFERENCES `featureType`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`environmentId`) REFERENCES `environment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_feature_display_id_environment_id` ON `feature` (`name`,`environmentId`);--> statement-breakpoint
CREATE TABLE `organizationUser` (
	`id` text NOT NULL,
	`userId` text NOT NULL,
	`permission` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	PRIMARY KEY(`id`, `userId`),
	FOREIGN KEY (`id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`image` text,
	`updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`image` text,
	`organizationId` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	`created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL,
	FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_project_id_organization_id` ON `project` (`id`,`organizationId`);--> statement-breakpoint
ALTER TABLE `account` ADD `updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `authenticator` ADD `updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `authenticator` ADD `created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `verificationToken` ADD `updated_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;--> statement-breakpoint
ALTER TABLE `verificationToken` ADD `created_at` integer DEFAULT (unixepoch('now','subsec')) NOT NULL;