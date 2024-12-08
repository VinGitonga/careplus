import type { IDoctor } from "./Doctor";
import type { IPatient } from "./Patient";

export enum AppointmentStatus {
	PENDING = "pending",
	SCHEDULED = "scheduled",
	CANCELLED = "cancelled",
}

export interface IAppointment {
	id: string;
	createdAt: string;
	updatedAt: string;
    patient: IPatient
	doctor: IDoctor;
	reason: string;
	comments?: string;
	appointmentDate: string;
	status: AppointmentStatus;
}
