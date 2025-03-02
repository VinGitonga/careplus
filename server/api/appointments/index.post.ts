import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db/get-db";
import { EmailTemplate, sendEmail } from "~/server/emails/send";
import { appointmentInsertSchema, appointmentsTable, SelectAppointment } from "~/server/schemas/appointment.schema";
import { patientsTable } from "~/server/schemas/patient.schema";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType<SelectAppointment>> => {
	const body = await readBody(event);

	const newAppointmentData = body as Omit<z.infer<typeof appointmentInsertSchema>, "id" | "createdAt" | "updatedAt" | "status">;

	validator.validateSchema(appointmentInsertSchema, newAppointmentData);

	const createdAppointmentData = await db.insert(appointmentsTable).values(newAppointmentData).returning();

	// send an email
	try {
		const patientInfo = await db.select().from(patientsTable).where(eq(patientsTable.id, newAppointmentData.patientId!)).leftJoin(usersTable, eq(usersTable.id, patientsTable.userId)).limit(1);

		const userData = patientInfo[0].users;

		await sendEmail({ to: [userData?.email!], subject: "Appointment Received", template: EmailTemplate.APPOINTMENT_CONFIRMATION });
	} catch (err) {}

	return {
		status: "success",
		msg: "Appointment created successfully",
		data: createdAppointmentData[0],
	};
});
