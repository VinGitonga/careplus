<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { toTypedSchema } from "@vee-validate/zod";
import { LoaderCircleIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { z } from "zod";
import type { IApiResponseType } from "~/types/Api";
import type { TApiError } from "~/types/Error";
const { isOpen, onOpen, onClose } = useDisclosure();

const loading = ref<boolean>(false);
const expectedAppointmentDate = ref<DateValue>();

const { data: respDoctorsVal } = useFetch<IApiResponseType<{ name: string; doctorId: string; speciality: string; userId: string }[]>, TApiError>("/api/doctors/onboarding", { method: "GET" });

const doctorsOptions = computed(() => {
	if (respDoctorsVal?.value && respDoctorsVal?.value?.status === "success") {
		return respDoctorsVal.value.data?.map((item) => ({ label: item.name, value: item.doctorId }));
	}

	return [];
});

const selectedDoctor = ref<string>("");
const formObject = z.object({
	doctor: z.string().min(1, "Please select the doctor"),
	reason: z.string().min(1, "Please enter the reason for appointment"),
	comments: z.string(),
	appointmentDate: z.string().refine((v) => v, { message: "Expected appointment date is required" }),
});

const formSchema = toTypedSchema(formObject);

const { handleSubmit, resetForm, values, setFieldValue } = useForm<z.infer<typeof formObject>>({
	validationSchema: formSchema,
	initialValues: {
		doctor: "",
		reason: "",
		comments: "",
		appointmentDate: "",
	},
});

const updateFieldValue = (name: string, value?: string) => {
	setFieldValue(name as any, value);
};

const onSubmit = handleSubmit(async (data) => {});
</script>
<template>
	<div>
		<Button @click="onOpen">New Appointment</Button>
		<Dialog v-model:open="isOpen">
			<DialogContent class="sm:max-w-[700px] font-sans bg-[#181d23] text-white border-none">
				<DialogHeader>
					<DialogTitle>New Appointment</DialogTitle>
					<DialogDescription class="text-gray-300 text-sm"> Add new appointment information here. Click save when you're done. </DialogDescription>
				</DialogHeader>
				<form @submit="onSubmit">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
						<div class="col-auto md:col-span-2">
							<AppFormCombobox
								controlled
								name="doctor"
								label="Doctor"
								:options="doctorsOptions!"
								v-model:model-value="selectedDoctor"
								:selected-value="values.doctor"
								:set-selected-value="updateFieldValue"
								trigger-class-name="w-full" />
						</div>
						<AppFormTextArea controlled name="reason" label="Reason for appointment" placeholder="ex: Health Checkup" />
						<AppFormTextArea :controlled="true" name="comments" label="Additional comments/notes" placeholder="ex: Prefer afternoon appointments. if possible" />
						<div class="col-auto md:col-span-2 w-full">
							<AppFormDatePicker
								:controlled="true"
								name="appointmentDate"
								label="Expected appointment date"
								placeholder="Select expected appointment date"
								v-model:modelValue="expectedAppointmentDate"
								triggerClassName="w-full sm:w-[472px] md:w-[650px] h-12 mt-1"
								:selected-value="values.appointmentDate"
								:set-selected-value="updateFieldValue"
								:min-date="today(getLocalTimeZone())" />
						</div>
						<div class="w-full col-auto md:col-span-2">
							<Button :disabled="loading" class="bg-[#24AE7C] w-full hover:bg-[#127D6B] transition-colors duration-300 ease-in-out h-12 text-base font-semibold" size="lg" @click="onSubmit()">
								<LoaderCircleIcon class="w-20 h-20 animate-spin mr-2" v-if="loading" />
								Submit and Continue</Button
							>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>
