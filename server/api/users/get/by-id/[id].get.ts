import { eq } from "drizzle-orm";
import { db, getDB } from "~/server/db/get-db";
import { usersTable } from "~/server/schemas/user.schema";
import  { type ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	const id = getRouterParam(event, "id");

	const queryResult = await getDB().select().from(usersTable).where(eq(usersTable.id, id!)).limit(1);

	setResponseStatus(event, 200, "OK");
	return {
		status: "success",
		data: queryResult?.[0],
	};
});
