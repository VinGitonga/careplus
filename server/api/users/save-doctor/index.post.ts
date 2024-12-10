import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db/get-db";
import { doctorInsertSchema, doctorsTable } from "~/server/schemas/doctor.schema";
import { userInsertSchema, usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType, IApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<IApiResponseType> => {
	const body = await readBody(event);

	const { userInfo, doctorInfo } = body;

	const userData = userInfo as Omit<z.infer<typeof userInsertSchema>, "id" | "createdAt" | "updatedAt" | "otp" | "status">;
	const doctorData = doctorInfo as Omit<z.infer<typeof doctorInsertSchema>, "id" | "createdAt" | "updatedAt">;

	validator.validateSchema(userInsertSchema, userData);
	validator.validateSchema(doctorInsertSchema, doctorData);

	const userExists = await db.select().from(usersTable).where(eq(usersTable.email, userData.email)).limit(1);

	if (userExists && userExists?.[0]) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "User already exists." }));
	}

	await db.insert(usersTable).values(userData);

	const createdUser = await db.select().from(usersTable).where(eq(usersTable.email, userData.email)).limit(1);

	const toSaveDoctorInfo = {
		...doctorData,
		userId: createdUser?.[0].id,
	};

	await db.insert(doctorsTable).values(toSaveDoctorInfo);

	setResponseStatus(event, 201, "Created");
	return {
		status: "success",
		msg: "Doctor's account created successfully.",
	};
});
