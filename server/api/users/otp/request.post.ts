import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType, IApiResponseType } from "~/types/Api";
import { customAlphabet } from "nanoid";
import { EmailTemplate, sendEmail } from "~/server/emails/send";

export default defineEventHandler(async (event): Promise<IApiResponseType> => {
	const body = await readBody(event);

	if (!body.email) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "Email is required" }));
	}

	const user = await db.select().from(usersTable).where(eq(usersTable.email, body.email)).limit(1);

	if (!user?.[0]) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "Invalid email address" }));
	}

	// generate otp of size 6
	const nanoid = customAlphabet("0123456789ZYXUIQBCDJMPRSH", 6);

	const uppercaseOTP = nanoid().toUpperCase();

	await db.update(usersTable).set({ otp: uppercaseOTP }).where(eq(usersTable.id, user?.[0].id));

	try {
		await sendEmail({ to: [user?.[0].email], subject: "Sign In OTP", template: EmailTemplate.OTP, data: { name: user?.[0].name, otp: uppercaseOTP } });
	} catch (err) {
		console.log("err", err);
	}

	setResponseStatus(event, 200, "OK");
	return {
		status: "success",
		msg: "OTP sent successfully.",
	};
});
