import type { IDoctor } from "./Doctor";

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
