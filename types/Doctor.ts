import type { SelectDoctor } from "~/server/schemas/doctor.schema";
import type { IUser } from "./User";

export interface IDoctor {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	phoneNo: string;
	email: string;
	speciality: string;
}

export interface TDoctorData extends SelectDoctor {
	user?: IUser;
}
