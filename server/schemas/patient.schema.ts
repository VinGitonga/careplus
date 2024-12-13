import { boolean, date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseSchema } from "./base";
import { relations } from "drizzle-orm";
import { usersTable } from "./user.schema";
import { doctorsTable } from "./doctor.schema";
import { createInsertSchema } from "drizzle-zod";

export const patientsTable = pgTable("patients", {
	...baseSchema,
	userId: uuid("user_id").references(() => usersTable.id),
	dob: date({ mode: "string" }),
	gender: text("gender").notNull(),
	address: text("address").notNull(),
	occupation: text("occupation"),
	emergencyContactName: text("emergency_contact_name"),
	emergencyContactPhoneNo: text("emergency_contact_phone_no"),
	insuranceProvider: text("insurance_provider"),
	insurancePolicyNuumber: text("insurance_policy_number"),
	allergies: text("allergies"),
	currentMedications: text("current_medications"),
	familyHistory: text("family_history"),
	pastMedicalHistory: text("past_medical_history"),
	identificationType: text("identification_type").notNull(),
	identificationNumber: text("identification_number").notNull(),
	identificationUrl: text("identification_url").notNull(),
	acceptedReceiveTreatment: boolean("accepted_receive_treatment").notNull().default(false),
	acceptedDisclosureOfInformation: boolean("accepted_disclosure_of_information").notNull().default(false),
	acceptedPrivacyPolicy: boolean("accepted_privacy_policy").notNull().default(false),
	primaryPhysicianId: uuid("primary_physician_id"),
});

export const patientInfoRelations = relations(patientsTable, ({ one }) => ({
	user: one(usersTable, { fields: [patientsTable.userId], references: [usersTable.id] }),
	primaryPhysician: one(doctorsTable, {
		fields: [patientsTable.primaryPhysicianId],
		references: [doctorsTable.id],
	}),
}));

export type SelectPatient = typeof patientsTable.$inferSelect

export const patientInsertSchema = createInsertSchema(patientsTable);
