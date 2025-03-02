import { relations } from "drizzle-orm/relations";
import { users, doctors, patients } from "./schema";

export const doctorsRelations = relations(doctors, ({one}) => ({
	user: one(users, {
		fields: [doctors.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	doctors: many(doctors),
	patients: many(patients),
}));

export const patientsRelations = relations(patients, ({one}) => ({
	user: one(users, {
		fields: [patients.userId],
		references: [users.id]
	}),
}));