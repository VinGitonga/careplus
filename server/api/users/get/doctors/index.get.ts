import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { doctorsTable } from "~/server/schemas/doctor.schema";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	const queryResult = await db.select().from(usersTable).leftJoin(doctorsTable, eq(usersTable.id, doctorsTable.userId));

	const cleanedResult = queryResult.map((item) => ({ ...item.users, doctorInfo: item.doctors }));

	setResponseStatus(event, 200, "OK");
	return {
		status: "success",
		data: cleanedResult,
	};
});
