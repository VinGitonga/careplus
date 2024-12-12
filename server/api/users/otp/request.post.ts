import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType } from "~/types/Api";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (!body.email) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "Email is required" }));
	}

	const user = await db.select().from(usersTable).where(eq(usersTable.email, body.email)).limit(1);

	if (!user?.[0]) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "Invalid email address" }));
	}

	// generate otp of size 6
	const generatedOTP = nanoid(6);

	const uppercaseOTP = generatedOTP.toUpperCase();

	await db.update(usersTable).set({ otp: uppercaseOTP }).where(eq(usersTable.id, user?.[0].id));
});
