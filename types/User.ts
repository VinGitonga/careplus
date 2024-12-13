import type { SelectDoctor } from "~/server/schemas/doctor.schema";
import type { SelectPatient } from "~/server/schemas/patient.schema";
import type { SelectUser } from "~/server/schemas/user.schema";

export interface IUser extends SelectUser {
	patientInfo?: SelectPatient;
	doctorInfo?: SelectDoctor;
}
