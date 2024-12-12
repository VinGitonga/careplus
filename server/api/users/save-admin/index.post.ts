import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, getDB } from "~/server/db/get-db";
import { userInsertSchema, usersTable } from "~/server/schemas/user.schema";
import { type ApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<ApiResponseType> => {
	const body = (await readBody(event)) as Omit<z.infer<typeof userInsertSchema>, "id" | "createdAt" | "updatedAt" | "otp" | "status">;

	validator.validateSchema(userInsertSchema, body);

	const userExists = await getDB().select().from(usersTable).where(eq(usersTable.email, body.email)).limit(1);

	if (userExists && userExists?.[0]) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "User already exists." }));
	}

	await getDB().insert(usersTable).values(body);

	const createdUser = await getDB().select().from(usersTable).where(eq(usersTable.email, body.email)).limit(1);

	setResponseStatus(event, 201, "Created");
	return {
		status: "success",
		data: createdUser,
	};
});
