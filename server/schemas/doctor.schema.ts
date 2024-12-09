import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseSchema } from "./base";
import { relations } from "drizzle-orm";
import { usersTable } from "./user.schema";
import { patientsTable } from "./patient.schema";

export const doctorsTable = pgTable("doctors", {
	...baseSchema,
	userId: uuid("user_id").references(() => usersTable.id),
	speciality: text("speciality").notNull(),
});

export const doctorInfoRelations = relations(doctorsTable, ({ one, many }) => ({
	user: one(usersTable, { fields: [doctorsTable.userId], references: [usersTable.id] }),
	patients: many(patientsTable),
}));
