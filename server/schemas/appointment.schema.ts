import { date, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseSchema } from "./base";
import { patientsTable } from "./patient.schema";
import { doctorsTable } from "./doctor.schema";
import { relations } from "drizzle-orm";
import { usersTable } from "./user.schema";
import { createInsertSchema } from "drizzle-zod";

export const appointmentStatus = pgEnum("appointmentStatus", ["processing", "approved", "rejected",]);

export const appointmentsTable = pgTable("appointments", {
	...baseSchema,
	patientId: uuid("patient_id").references(() => patientsTable.id),
	doctorId: uuid("doctor_id").references(() => doctorsTable.id),
	reason: text("reason").notNull(),
	comments: text("comments"),
	appointmentDate: date({ mode: "string" }).notNull(),
	status: appointmentStatus().notNull().default('processing'),
	approvedRejectedById: uuid("approved_rejected_by_id"),
	approved_date_time: date({ mode: "date" }),
});

export const appointmentInfoRelations = relations(appointmentsTable, ({ one }) => ({
	patient: one(patientsTable, { fields: [appointmentsTable.patientId], references: [patientsTable.id] }),
	doctor: one(doctorsTable, { fields: [appointmentsTable.doctorId], references: [doctorsTable.id] }),
	approvedRejectedBy: one(usersTable, {
		fields: [appointmentsTable.approvedRejectedById],
		references: [usersTable.id],
	}),
}));

export type SelectAppointment = typeof appointmentsTable.$inferSelect;

export const appointmentInsertSchema = createInsertSchema(appointmentsTable);