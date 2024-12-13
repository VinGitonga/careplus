import type { SelectPatient } from "~/server/schemas/patient.schema";
import type { IDoctor, TDoctorData } from "./Doctor";
import type { IUser } from "./User";

export interface IPatient {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	email: string;
	phoneNo: string;
	dob: string;
	gender: string;
	address: string;
	occupation: string;
	emergencyContactName: string;
	emergencyContactPhoneNo: string;
	primaryPhysician?: IDoctor;
	insuranceProvider: string;
	insurancePolicyNuumber: string;
	allergies?: string;
	currentMedications?: string;
	familyHistory?: string;
	pastMedicalHistory?: string;
	identificationType: string;
	identificationNumber: string;
	identificationUrl: string;
	acceptedReceiveTreatment: boolean;
	acceptedDisclosureOfInformation: boolean;
	acceptedPrivacyPolicy: boolean;
}

export interface TPatientData extends SelectPatient {
	user?: IUser;
	primaryPhysician?: TDoctorData;
}
