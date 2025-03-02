import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { appointmentsTable } from "~/server/schemas/appointment.schema";
import { doctorsTable } from "~/server/schemas/doctor.schema";
import { patientsTable } from "~/server/schemas/patient.schema";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	const queryResult = await db.select().from(appointmentsTable).leftJoin(patientsTable, eq(patientsTable.userId, usersTable.id)).leftJoin(doctorsTable, eq(doctorsTable.userId, usersTable.id));

	const cleanedResult = queryResult.map((item) => ({ ...item.appointments, doctor: item.doctors, patient: item.patients }));

	setResponseStatus(event, 200, "OK");

	return {
		status: "success",
		data: cleanedResult,
		msg: "Appointments retrived successfully",
	};
});
