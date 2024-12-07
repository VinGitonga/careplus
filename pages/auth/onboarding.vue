<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { MailIcon, PhoneIcon } from "lucide-vue-next";
import type { DefineComponent } from "vue";
import type { IOption } from "~/types/Option";

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
const physician = ref<string>("");
const identificationType = ref<string>("");
const files = ref<File[]>();
</script>
<template>
	<Title>Onboarding</Title>
	<div class="h-screen bg-[#131619] text-white overflow-y-scroll">
		<div class="grid grid-cols-10">
			<div class="col-span-7">
				<div class="px-4 md:px-16 py-10 flex flex-col h-screen md:h-full overflow-y-scroll bg-inherit">
					<div class="flex items-center gap-x-2">
						<img src="/images/Logomark.png" alt="" class="w-10 h-10" />
						<h1 class="text-xl font-bold">CarePulse</h1>
					</div>
					<div class="mt-5">
						<div class="mb-10 space-y-2">
							<h1 class="text-4xl font-bold">Welcome 👋</h1>
							<p class="text-lg font-medium text-[#ABB8C4]">Let us know more about yourself</p>
						</div>
						<div class="my-5 space-y-7">
							<h1 class="text-3xl font-bold">Personal Information</h1>
							<AppFormInput label="Full Name" placeholder="ex: Adam" />
							<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
								<AppFormInput label="Email address" placeholder="ex: adrian@jsmastery.org">
									<template v-slot:leftIcon>
										<MailIcon class="w-4 h-4" />
									</template>
								</AppFormInput>
								<AppFormInput label="Phone number" placeholder="+254704260663">
									<template v-slot:leftIcon>
										<PhoneIcon class="w-4 h-4" />
									</template>
								</AppFormInput>
								<AppFormDatePicker label="Date of Birth" placeholder="Select date of birth" v-model:modelValue="dob" triggerClassName="w-[430px] h-12 mt-1" />
								<AppFormRadioGroup label="Gender" :options="generateOptions(genderOptions, true)" group-class-name="flex gap-3" item-class-name="px-3 py-3.5 border border-dashed rounded-xl" />
								<AppFormInput label="Address" placeholder="ex: 14 street, New York, NY-501" />
								<AppFormInput label="Occupation" placeholder="ex: Software Engineer" />
								<AppFormInput label="Emergency Contact Name" placeholder="Guardian's name" />
								<AppFormInput label="Emergency Contact Phone number" placeholder="+254704260663">
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
									<AppFormCombobox label="Primary care physician" :options="options" v-model:model-value="physician" trigger-class-name="w-full" />
								</div>
								<AppFormInput label="Insurance Provider" placeholder="ex: BlueCross" />
								<AppFormInput label="Insurance Policy Number" placeholder="ex: ERT-171717181" />
								<AppFormTextArea label="Allergies (if any)" placeholder="ex: Peanuts, Penicillin, Pollen" />
								<AppFormTextArea label="Current Medications" placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg" />
								<AppFormTextArea label="Family medical history (if relevant)" placeholder="ex: Mother had breast cancer" />
								<AppFormTextArea label="Past medical history" placeholder="ex: Asthma diagnosis in childhood" />
							</div>
						</div>
						<div class="mt-16 space-y-7">
							<h1 class="text-3xl font-bold">Identification and Verification</h1>
							<AppFormCombobox label="Identification Type" :options="identificationOptions" v-model:model-value="identificationType" trigger-class-name="w-full" />
							<AppFormInput label="Identification Number" placeholder="ex: 24145161" />
							<AppFormDropzone label="Scanned Copy of Identification Document" v-model:model-value="files" />
						</div>
						<div class="mt-16 space-y-7">
							<h1 class="text-3xl font-bold">Consent and Privacy</h1>
						</div>
					</div>
				</div>
			</div>
			<div class="col-span-3 max-h-screen sticky">
				<img src="/images/Onboarding-Img.png" alt="" class="h-full w-full object-cover" />
			</div>
		</div>
	</div>
</template>
