<script setup lang="ts">
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { toTypedSchema } from "@vee-validate/zod";
import { MailIcon, PhoneIcon, LoaderCircle } from "lucide-vue-next";
import { useForm } from "vee-validate";
import type { DefineComponent } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import type { IApiResponseType } from "~/types/Api";
import type { TApiError } from "~/types/Error";
import type { IOption } from "~/types/Option";
import useDropzone from "~/composables/useDropzone";

const dob = ref<DateValue>();

const genderOptions = ["male", "female", "other"];
const identificationOptions = [
	{
		label: "Birth Certificate",
		value: "birth-certificate",
	},
	{
		label: "National ID",
		value: "national-id",
	},
	{
		label: "Passport",
		value: "passport",
	},
	{
		label: "Driver's License",
		value: "drivers-license",
	},
] satisfies IOption[];
const options: (IOption & { icon?: DefineComponent | string })[] = [
	{
		label: "Dr. Alex",
		value: "alex",
		icon: "https://api.dicebear.com/9.x/adventurer/svg?seed=alex",
	},
	{
		label: "Dr. Riley",
		value: "riley",
		icon: "https://api.dicebear.com/9.x/adventurer/svg?seed=riley",
	},
];

const termsOptions = [
	{
		label: "I consent to receive treatment for my health condition.",
		value: "receive-treatment",
	},
	{
		label: "I consent to the use and disclosure of my health information for treatment purposes.",
		value: "disclose-health-info",
	},
	{
		label: "I acknowledge that I have reviewed and agree to the privacy policy",
		value: "agree-privacy-policy",
	},
] satisfies IOption[];
const physician = ref<string>("");
const identificationType = ref<string>("");
const acceptedFiles = ref<File[]>([]);
const acceptedTerms = ref<string[]>([]);
const loading = ref<boolean>(false);
const filesData = ref<{ name: string; url: string }[]>([]);

const router = useRouter()

const { data: respDoctorsVal } = useFetch<IApiResponseType<{ name: string; doctorId: string; speciality: string; userId: string }[]>, TApiError>("/api/doctors/onboarding", { method: "GET" });

const doctorsOptions = computed(() => {
	if (respDoctorsVal?.value && respDoctorsVal?.value?.status === "success") {
		return respDoctorsVal.value.data?.map((item) => ({ label: item.name, value: item.doctorId }));
	}

	return [];
});

const formObject = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email({ message: "Invalid Email Address" }),
	phoneNo: z
		.string()
		.length(10, "Phone Number must be 10 characters")
		.refine((val) => phoneNoRegex.test(val), {
			message: "Invalid Phone Number",
		}),
	dob: z.string().refine((v) => v, { message: "A date of birth is required." }),
	gender: z.string().min(1, "Please select gender"),
	address: z.string().min(1, "Please enter where you're located"),
	occupation: z.string(),
	emergencyContactName: z.string(),
	emergencyContactPhoneNo: z.string(),
	insuranceProvider: z.string(),
	insurancePolicyNuumber: z.string(),
	allergies: z.string(),
	currentMedications: z.string(),
	familyHistory: z.string(),
	pastMedicalHistory: z.string(),
	identificationType: z.string().min(1, "Please select an identification type"),
	identificationNumber: z.string().min(1, "Please enter the identification number"),
	identificationUrl: z.string().min(1, "Please upload a copy of identification document"),
	acceptedTerms: z.array(z.string()).refine((val) => val.some((item) => item), {
		message: "Accept atleast one term",
	}),
	primaryPhysicianId: z.string().min(1, "Please select your primary physician"),
});

const formSchema = toTypedSchema(formObject);

const { handleSubmit, resetForm, setFieldValue, errors, values } = useForm({
	validationSchema: formSchema,
	initialValues: {
		name: "",
		email: "",
		phoneNo: "",
		dob: "",
		gender: "",
		address: "",
		occupation: "",
		emergencyContactName: "",
		emergencyContactPhoneNo: "",
		insuranceProvider: "",
		insurancePolicyNuumber: "",
		allergies: "",
		currentMedications: "",
		familyHistory: "",
		pastMedicalHistory: "",
		identificationType: "",
		identificationNumber: "",
		identificationUrl: "",
		acceptedTerms: [],
		primaryPhysicianId: "",
	},
});

const onUploadDocument = async (file: File) => {
	const formData = new FormData();

	formData.set("file", file);
	formData.set("folder", "identification");

	// Convert file to data URL
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => {
		// set identificationUrl to the uploaded file url as dataUrl
		setFieldValue("identificationUrl", reader.result as string);
	};

	const { data: _respVal, error } = await useFetch<IApiResponseType, TApiError>("/api/upload/single", { method: "POST", body: formData });

	if (error.value) {
		toast.error("Failed to upload document. Please try again.");
		// clear the identificationUrl field
		setFieldValue("identificationUrl", "");
		return;
	}

	const respVal = _respVal.value as unknown as IApiResponseType;

	if (respVal.status === "success") {
		const { name, url } = respVal.data as { name: string; url: string };
		filesData.value.push({ name, url });
		setFieldValue("identificationUrl", url);
		toast.success("Document uploaded successfully.");
	} else {
		console.log("iii", respVal);
		toast.error("Failed to upload document. Please try again.");
	}
};

const onDrop = async (files: File[]) => {
	acceptedFiles.value = files;

	if (files.length > 0) {
		const file = files[0];
		onUploadDocument(file);
	}
};

const { isDragActive, getRootProps, getInputProps } = useDropzone({ accept: ".jpg,.png,.pdf", maxSize: 10 * 1024 * 1024, onDrop });

const onSubmit = handleSubmit(async (data) => {
	loading.value = true;

	const { acceptedTerms, name, email, phoneNo, ...rest } = data;

	const userData = {
		name,
		email,
		phoneNo,
		role: "patient",
	};

	const patientData = {
		...rest,
		acceptedReceiveTreatment: acceptedTerms.includes("receive-treatment"),
		acceptedDiscloseHealthInfo: acceptedTerms.includes("disclose-health-info"),
		acceptedPrivacyPolicy: acceptedTerms.includes("agree-privacy-policy"),
	};

	const { data: respData, error } = await useFetch<IApiResponseType, TApiError>("/api/users/save-patient", {
		method: "POST",
		body: {
			userInfo: userData,
			patientInfo: patientData,
		},
	});

	if (error.value) {
		toast.error("Failed to save patient. Please try again.");
		loading.value = false;
		return;
	}

	if (respData?.value?.status === "success") {
		toast.success("Patient saved successfully.");
		resetForm();
		router.push("/auth/login");
	} else {
		toast.error(respData?.value?.msg ?? "Failed to save patient. Please try again.");
		loading.value = false;
	}
});

const updateFieldValue = (name: string, value?: string) => {
	setFieldValue(name as any, value);
};
</script>
<template>
	<Title>Onboarding</Title>
	<div class="min-h-screen h-full bg-[#131619] text-white">
		<div class="grid grid-cols-1 md:grid-cols-10">
			<div class="col-auto md:col-span-7">
				<div class="px-4 md:px-16 py-10 flex flex-col min-h-screen md:h-full bg-[#131619]">
					<div class="flex items-center gap-x-2">
						<img src="/images/Logomark.png" alt="" class="w-10 h-10" />
						<h1 class="text-xl font-bold">CarePulse</h1>
					</div>
					<form @submit="onSubmit">
						<div class="mt-5">
							<div class="mb-10 space-y-2">
								<h1 class="text-4xl font-bold">Welcome 👋</h1>
								<p class="text-lg font-medium text-[#ABB8C4]">Let us know more about yourself</p>
							</div>
							<div class="my-5 space-y-7">
								<h1 class="text-3xl font-bold">Personal Information</h1>
								<AppFormInput controlled name="name" label="Full Name" placeholder="ex: Adam" />
								<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
									<AppFormInput controlled name="email" label="Email address" placeholder="ex: adrian@jsmastery.org">
										<template v-slot:leftIcon>
											<MailIcon class="w-4 h-4" />
										</template>
									</AppFormInput>
									<AppFormInput controlled name="phoneNo" label="Phone number" placeholder="+254704260663">
										<template v-slot:leftIcon>
											<PhoneIcon class="w-4 h-4" />
										</template>
									</AppFormInput>
									<AppFormDatePicker
										controlled
										name="dob"
										label="Date of Birth"
										placeholder="Select date of birth"
										v-model:modelValue="dob"
										triggerClassName="w-[430px] h-12 mt-1"
										:max-date="today(getLocalTimeZone())"
										:selected-value="values.dob"
										:set-selected-value="updateFieldValue" />
									<AppFormRadioGroup controlled name="gender" label="Gender" :options="generateOptions(genderOptions, true)" group-class-name="flex gap-3" item-class-name="px-3 py-3.5 border border-dashed rounded-xl" />
									<AppFormInput controlled label="Address" name="address" placeholder="ex: 14 street, New York, NY-501" />
									<AppFormInput controlled name="occupation" label="Occupation" placeholder="ex: Software Engineer" />
									<AppFormInput controlled name="emergencyContactName" label="Emergency Contact Name" placeholder="Guardian's name" />
									<AppFormInput controlled name="emergencyContactPhoneNo" label="Emergency Contact Phone number" placeholder="+254704260663">
										<template v-slot:leftIcon>
											<PhoneIcon class="w-4 h-4" />
										</template>
									</AppFormInput>
								</div>
							</div>
							<div class="mt-16 space-y-7">
								<h1 class="text-3xl font-bold">Medical Information</h1>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
									<div class="col-auto md:col-span-2">
										<AppFormCombobox
											controlled
											name="primaryPhysicianId"
											label="Primary care physician"
											:options="doctorsOptions!"
											v-model:model-value="physician"
											trigger-class-name="w-full"
											:selected-value="values.primaryPhysicianId"
											:set-selected-value="updateFieldValue" />
									</div>
									<AppFormInput controlled name="insuranceProvider" label="Insurance Provider" placeholder="ex: BlueCross" />
									<AppFormInput controlled name="insurancePolicyNuumber" label="Insurance Policy Number" placeholder="ex: ERT-171717181" />
									<AppFormTextArea controlled name="allergies" label="Allergies (if any)" placeholder="ex: Peanuts, Penicillin, Pollen" />
									<AppFormTextArea controlled name="currentMedications" label="Current Medications" placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg" class="h-auto" />
									<AppFormTextArea controlled name="familyHistory" label="Family medical history (if relevant)" placeholder="ex: Mother had breast cancer" />
									<AppFormTextArea controlled name="pastMedicalHistory" label="Past medical history" placeholder="ex: Asthma diagnosis in childhood" />
								</div>
							</div>
							<div class="mt-16 space-y-7">
								<h1 class="text-3xl font-bold">Identification and Verification</h1>
								<AppFormCombobox
									controlled
									name="identificationType"
									label="Identification Type"
									:options="identificationOptions"
									v-model:model-value="identificationType"
									trigger-class-name="w-full"
									:selected-value="values.identificationType"
									:set-selected-value="updateFieldValue" />
								<AppFormInput controlled name="identificationNumber" label="Identification Number" placeholder="ex: 24145161" />
								<!-- <AppFormDropzone label="Scanned Copy of Identification Document" v-model:model-value="files" @file-uploaded="(val) => onUploadDocument(val)" /> -->
								<div class="space-y-3">
									<Label class="font-semibold text-[#ABB8C4]"> Scanned Copy of Identification Document </Label>
									<div
										v-bind="getRootProps()"
										class="w-full p-8 border-2 border-dashed rounded-lg"
										:class="{
											'border-blue-500 bg-blue-50': isDragActive,
											'border-gray-300': !isDragActive,
										}">
										<input type="file" v-bind="getInputProps()" class="hidden" />

										<div class="text-center">
											<p class="text-lg">
												{{ isDragActive ? "Drop files here..." : "Drag & drop files here" }}
											</p>
											<p class="text-sm text-gray-500">or click to select</p>
										</div>
									</div>
									<div v-if="acceptedFiles.length > 0" class="mt-4 space-y-2">
										<div v-for="file in acceptedFiles" :key="file.name" class="flex items-center p-2 rounded">
											<span class="flex-1">{{ file.name }}</span>
										</div>
									</div>
									<p v-if="errors.identificationUrl" class="text-red-500 text-sm">
										{{ errors.identificationUrl }}
									</p>
								</div>
							</div>
							<div class="mt-16 space-y-7">
								<h1 class="text-3xl font-bold">Consent and Privacy</h1>
								<AppFormCheckbox controlled name="acceptedTerms" :options="termsOptions" v-model:model-value="acceptedTerms" />
							</div>
							<div class="mt-16 space-y-7">
								<Button :disabled="loading" class="bg-[#24AE7C] w-full hover:bg-[#127D6B] transition-colors duration-300 ease-in-out h-12 text-lg font-semibold" size="lg" type="submit">
									<LoaderCircle class="w-20 h-20 animate-spin mr-2" v-if="loading" />
									Submit and Continue</Button
								>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="hidden md:block md:col-span-3 h-screen sticky">
				<img src="/images/Onboarding-Img.png" alt="" class="h-full w-full object-cover" />
			</div>
		</div>
	</div>
</template>
