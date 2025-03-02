CREATE TYPE "public"."userStatus" AS ENUM('active', 'suspended', 'deleted');--> statement-breakpoint
ALTER TYPE "public"."status" RENAME TO "appointmentStatus";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE userStatus;--> statement-breakpoint
ALTER TABLE "public"."appointments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."appointmentStatus";--> statement-breakpoint
CREATE TYPE "public"."appointmentStatus" AS ENUM('processing', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "public"."appointments" ALTER COLUMN "status" SET DATA TYPE "public"."appointmentStatus" USING "status"::"public"."appointmentStatus";