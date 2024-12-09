import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { baseSchema } from "./base";
import { relations } from "drizzle-orm";
import { patientsTable } from "./patient.schema";
import { doctorsTable } from "./doctor.schema";

export const userStatus = pgEnum("status", ["active", "suspended", "deleted"]);
export const userRole = pgEnum("role", ["admin", "patient", "doctor"]);

export const usersTable = pgTable("users", {
	...baseSchema,
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	phoneNo: text("phone_no").notNull(),
	status: userStatus().notNull().default("active"),
	role: userRole().notNull(),
	otp: text('otp')
});

export const userRelations = relations(usersTable, ({ one }) => ({
	patientInfo: one(patientsTable),
	doctorInfo: one(doctorsTable)
}));

export type InsertUser = Pick<typeof usersTable.$inferInsert, "email" | "name" | "phoneNo" | "role">
