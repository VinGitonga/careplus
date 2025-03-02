import { pgTable, unique, uuid, timestamp, text, foreignKey, date, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['admin', 'patient', 'doctor'])
export const status = pgEnum("status", ['active', 'suspended', 'deleted'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	name: text().notNull(),
	email: text().notNull(),
	phoneNo: text("phone_no").notNull(),
	status: status().default('active').notNull(),
	role: role().notNull(),
	otp: text(),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const doctors = pgTable("doctors", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	userId: uuid("user_id"),
	speciality: text().notNull(),
}, (table) => {
	return {
		doctorsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "doctors_user_id_users_id_fk"
		}),
	}
});

export const patients = pgTable("patients", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	userId: uuid("user_id"),
	dob: date(),
	gender: text().notNull(),
	address: text().notNull(),
	occupation: text(),
	emergencyContactName: text("emergency_contact_name"),
	emergencyContactPhoneNo: text("emergency_contact_phone_no"),
	insuranceProvider: text("insurance_provider"),
	insurancePolicyNumber: text("insurance_policy_number"),
	allergies: text(),
	currentMedications: text("current_medications"),
	familyHistory: text("family_history"),
	pastMedicalHistory: text("past_medical_history"),
	identificationType: text("identification_type").notNull(),
	identificationNumber: text("identification_number").notNull(),
	identificationUrl: text("identification_url").notNull(),
	acceptedReceiveTreatment: boolean("accepted_receive_treatment").default(false).notNull(),
	acceptedDisclosureOfInformation: boolean("accepted_disclosure_of_information").default(false).notNull(),
	acceptedPrivacyPolicy: boolean("accepted_privacy_policy").default(false).notNull(),
	primaryPhysicianId: uuid("primary_physician_id"),
}, (table) => {
	return {
		patientsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "patients_user_id_users_id_fk"
		}),
	}
});
