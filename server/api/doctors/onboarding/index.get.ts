import { eq } from "drizzle-orm";
import { db } from "~/server/db/get-db";
import { doctorsTable } from "~/server/schemas/doctor.schema";
import { usersTable } from "~/server/schemas/user.schema";

export default defineEventHandler(async (event) => {
    try {
        
        const queryResult = await db
            .select({
                name: usersTable.name,
                doctorId: doctorsTable.id,
                speciality: doctorsTable.speciality,
                userId: doctorsTable.userId,
            })
            .from(doctorsTable)
            .leftJoin(usersTable, eq(doctorsTable.userId, usersTable.id))
            .where(eq(usersTable.role, "doctor"));
    
        setResponseStatus(event, 200, "OK");
        return {
            status: "success",
            data: queryResult,
        };
    } catch (err) {
        console.error(err);
        setResponseStatus(event, 500, "Internal Server Error");
        return {
            status: "error",
            message: "Failed to fetch doctors",
            
        }
    }
});
