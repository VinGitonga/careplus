import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db/get-db";
import { patientInsertSchema, patientsTable } from "~/server/schemas/patient.schema";
import { userInsertSchema, usersTable } from "~/server/schemas/user.schema";
import { ApiResponseType, IApiResponseType } from "~/types/Api";

export default defineEventHandler(async (event): Promise<IApiResponseType> => {
	const body = await readBody(event);

	const { userInfo, patientInfo } = body;
	const userData = userInfo as Omit<z.infer<typeof userInsertSchema>, "id" | "createdAt" | "updatedAt" | "otp" | "status">;
	const patientsData = patientInfo as Omit<z.infer<typeof patientInsertSchema>, "id" | "createdAt" | "updatedAt">;

	validator.validateSchema(userInsertSchema, userData);
	validator.validateSchema(patientInsertSchema, patientsData);

	const userExists = await db.select().from(usersTable).where(eq(usersTable.email, userData.email)).limit(1);

	if (userExists && userExists?.[0]) {
		throw createError<ApiResponseType>(createApiError({ errorMessage: "User already exists." }));
	}

	await db.insert(usersTable).values(userData);

	const createdUser = await db.select().from(usersTable).where(eq(usersTable.email, userData.email)).limit(1);

	const patientsInfo = {
		...patientsData,
		userId: createdUser?.[0].id,
	};

	await db.insert(patientsTable).values(patientsInfo);

	setResponseStatus(event, 201, "Created");
	return {
		status: "success",
		msg: "Patient's account created successfully.",
	};
});
