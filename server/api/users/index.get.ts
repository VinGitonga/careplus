import { db } from "~/server/db/get-db";
import { SelectUser, usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType, IApiErrorResponse } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	try {
		const users = await db.select().from(usersTable) as unknown as SelectUser[];

		return {
			status: "success",
			data: users,
		};
	} catch (err) {
		throw createError<IApiErrorResponse>({
			statusCode: 400,
			message: "Unknown error",
			data: {
				status: "error",
				msg: "Something went wrong",
			},
		});
	}
});
