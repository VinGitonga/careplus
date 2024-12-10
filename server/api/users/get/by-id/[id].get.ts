import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	const id = getRouterParam(event, "id");

	const queryResult = await db.select().from(usersTable).where(eq(usersTable.id, id!)).limit(1);

	setResponseStatus(event, 200, "OK");
	return {
		status: "success",
		data: queryResult?.[0],
	};
});
