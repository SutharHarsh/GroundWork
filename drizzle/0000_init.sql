CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`ref_id` text,
	`label` text NOT NULL,
	`minutes` integer DEFAULT 0 NOT NULL,
	`counts_for_streak` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `activities_user_date_idx` ON `activities` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `domain_prereqs` (
	`domain_id` text NOT NULL,
	`prereq_domain_id` text NOT NULL,
	PRIMARY KEY(`domain_id`, `prereq_domain_id`)
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`id` text PRIMARY KEY NOT NULL,
	`path_id` text NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`stage` text NOT NULL,
	`stage_number` integer NOT NULL,
	`label_text` text DEFAULT '' NOT NULL,
	`depth_text` text DEFAULT '' NOT NULL,
	`prereq_text` text DEFAULT '' NOT NULL,
	`why_text` text DEFAULT '' NOT NULL,
	`notes_md` text DEFAULT '' NOT NULL,
	`is_specialization` integer DEFAULT false NOT NULL,
	`is_ai` integer DEFAULT false NOT NULL,
	`sort` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `domains_path_idx` ON `domains` (`path_id`);--> statement-breakpoint
CREATE TABLE `learning_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`topic_id` text,
	`project_id` text,
	`schedule_item_id` text,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`minutes` integer DEFAULT 0 NOT NULL,
	`note` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sessions_learn_user_idx` ON `learning_sessions` (`user_id`,`started_at`);--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`success` integer NOT NULL,
	`at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `login_attempts_user_idx` ON `login_attempts` (`username`,`at`);--> statement-breakpoint
CREATE TABLE `mastery_assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`ratings` text NOT NULL,
	`explanation` text NOT NULL,
	`proof_ids` text DEFAULT '[]' NOT NULL,
	`passed` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `mastery_user_topic_idx` ON `mastery_assessments` (`user_id`,`topic_id`);--> statement-breakpoint
CREATE TABLE `parent_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`domain_id` text NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`tier` text NOT NULL,
	`sort` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `parent_domain_idx` ON `parent_topics` (`domain_id`);--> statement-breakpoint
CREATE TABLE `paths` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`role` text NOT NULL,
	`source_file` text NOT NULL,
	`intro_md` text DEFAULT '' NOT NULL,
	`sequence_md` text DEFAULT '' NOT NULL,
	`timeless_md` text DEFAULT '' NOT NULL,
	`capstones` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`week_start` text,
	`level` text NOT NULL,
	`title` text NOT NULL,
	`problem` text NOT NULL,
	`objectives` text DEFAULT '[]' NOT NULL,
	`topic_ids` text DEFAULT '[]' NOT NULL,
	`requirements` text DEFAULT '[]' NOT NULL,
	`deliverables` text DEFAULT '[]' NOT NULL,
	`criteria` text DEFAULT '[]' NOT NULL,
	`due_date` text NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`deliverable_text` text DEFAULT '' NOT NULL,
	`self_assessment` text DEFAULT '{}' NOT NULL,
	`reflection` text DEFAULT '' NOT NULL,
	`skills` text DEFAULT '' NOT NULL,
	`submitted_at` integer,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`sort` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `projects_user_idx` ON `projects` (`user_id`);--> statement-breakpoint
CREATE TABLE `proofs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`topic_id` text,
	`project_id` text,
	`type` text NOT NULL,
	`url` text,
	`file_name` text,
	`file_path` text,
	`mime` text,
	`size` integer,
	`reflection` text DEFAULT '' NOT NULL,
	`review_status` text DEFAULT 'submitted' NOT NULL,
	`submitted_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `proofs_user_idx` ON `proofs` (`user_id`);--> statement-breakpoint
CREATE TABLE `resource_states` (
	`user_id` text NOT NULL,
	`resource_id` text NOT NULL,
	`bookmarked` integer DEFAULT false NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `resource_id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`path_id` text NOT NULL,
	`domain_id` text,
	`section` text NOT NULL,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT '' NOT NULL,
	`creator` text DEFAULT '' NOT NULL,
	`url` text NOT NULL,
	`extra_urls` text DEFAULT '[]' NOT NULL,
	`what` text DEFAULT '' NOT NULL,
	`sort` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `resources_path_idx` ON `resources` (`path_id`);--> statement-breakpoint
CREATE TABLE `schedule_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`kind` text NOT NULL,
	`topic_id` text,
	`topic_ids` text DEFAULT '[]' NOT NULL,
	`project_id` text,
	`title` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`minutes` integer NOT NULL,
	`status` text DEFAULT 'planned' NOT NULL,
	`origin` text DEFAULT 'plan' NOT NULL,
	`rescheduled_from` text,
	`sort` integer DEFAULT 0 NOT NULL,
	`completed_at` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `schedule_user_date_idx` ON `schedule_items` (`user_id`,`date`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `subtopic_progress` (
	`user_id` text NOT NULL,
	`subtopic_id` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `subtopic_id`)
);
--> statement-breakpoint
CREATE TABLE `subtopics` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`title` text NOT NULL,
	`concepts` text DEFAULT '[]' NOT NULL,
	`sort` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `subtopics_topic_idx` ON `subtopics` (`topic_id`);--> statement-breakpoint
CREATE TABLE `topic_progress` (
	`user_id` text NOT NULL,
	`topic_id` text NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`plan_bucket` text DEFAULT 'continued' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`minutes_spent` integer DEFAULT 0 NOT NULL,
	`started_at` integer,
	`completed_at` integer,
	`mastered_at` integer,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `topic_id`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` text PRIMARY KEY NOT NULL,
	`path_id` text NOT NULL,
	`domain_id` text NOT NULL,
	`parent_id` text NOT NULL,
	`code` text NOT NULL,
	`title` text NOT NULL,
	`tier` text NOT NULL,
	`est_minutes` integer NOT NULL,
	`sort` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `topics_path_idx` ON `topics` (`path_id`);--> statement-breakpoint
CREATE INDEX `topics_domain_idx` ON `topics` (`domain_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`path_id` text NOT NULL,
	`hours_weekday` real,
	`hours_weekend` real,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL,
	`onboarded_at` integer,
	`last_plan_date` text,
	`plan_note` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);