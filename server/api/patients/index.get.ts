import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { patientsTable } from "~/server/schemas/patient.schema";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	const queryResult = await db.select().from(patientsTable).leftJoin(usersTable, eq(patientsTable.userId, usersTable.id)).where(eq(usersTable.role, "patient"));

	const cleanedResult = queryResult.map((item) => ({ ...item.patients, user: item.users }));

	setResponseStatus(event, 200, "OK");

	return {
		status: "success",
		data: cleanedResult,
	};
});
