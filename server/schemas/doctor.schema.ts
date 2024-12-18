import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseSchema } from "./base";
import { relations } from "drizzle-orm";
import { usersTable } from "./user.schema";
import { patientsTable } from "./patient.schema";
import { createInsertSchema } from "drizzle-zod";

export const doctorsTable = pgTable("doctors", {
	...baseSchema,
	userId: uuid("user_id").references(() => usersTable.id),
	speciality: text("speciality").notNull(),
});

export const doctorInfoRelations = relations(doctorsTable, ({ one, many }) => ({
	user: one(usersTable, { fields: [doctorsTable.userId], references: [usersTable.id] }),
	patients: many(patientsTable),
}));

export type SelectDoctor = typeof doctorsTable.$inferSelect

export const doctorInsertSchema = createInsertSchema(doctorsTable);
