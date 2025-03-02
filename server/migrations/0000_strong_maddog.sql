CREATE TYPE "public"."status" AS ENUM('active', 'suspended', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'patient', 'doctor');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"patient_id" uuid,
	"doctor_id" uuid,
	"reason" text NOT NULL,
	"comments" text,
	"appointmentDate" date NOT NULL,
	"status" "status" DEFAULT 'processing' NOT NULL,
	"approved_rejected_by_id" uuid,
	"approved_date_time" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "doctors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" uuid,
	"speciality" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"user_id" uuid,
	"dob" date,
	"gender" text NOT NULL,
	"address" text NOT NULL,
	"occupation" text,
	"emergency_contact_name" text,
	"emergency_contact_phone_no" text,
	"insurance_provider" text,
	"insurance_policy_number" text,
	"allergies" text,
	"current_medications" text,
	"family_history" text,
	"past_medical_history" text,
	"identification_type" text NOT NULL,
	"identification_number" text NOT NULL,
	"identification_url" text NOT NULL,
	"accepted_receive_treatment" boolean DEFAULT false NOT NULL,
	"accepted_disclosure_of_information" boolean DEFAULT false NOT NULL,
	"accepted_privacy_policy" boolean DEFAULT false NOT NULL,
	"primary_physician_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_no" text NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"role" "role" NOT NULL,
	"otp" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
