<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { LoaderCircleIcon } from "lucide-vue-next";
import type { DefineComponent } from "vue";
import { toast } from "vue-sonner";
import type { IOption } from "~/types/Option";

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
const expectedAppointmentDate = ref<DateValue>();
const loading = ref<boolean>(false);
const onSubmit = () => {
	loading.value = true;
	const id = toast.loading("Requesting ...");

	setTimeout(() => {
		loading.value = false;
		toast.success("Appointment request made successfully.", { id });
	}, 3000);
};
</script>
<template>
	<Title>Request Appointment</Title>
	<div class="h-screen bg-[#131619] text-white">
		<div class="grid grid-cols-1 md:grid-cols-10 gap-0 md:gap-5">
			<div class="col-auto md:col-span-7">
				<div class="px-4 md:px-16 py-10 flex flex-col justify-between h-screen md:h-full">
					<div class="flex items-center gap-x-2">
						<img src="/images/Logomark.png" alt="" class="w-10 h-10" />
						<h1 class="text-xl font-bold">CarePulse</h1>
					</div>
					<div class="">
						<div class="mb-10 space-y-2">
							<h1 class="text-4xl font-bold">Hi there 👋</h1>
							<p class="text-lg font-medium text-[#ABB8C4]">Request a new appointment in 10 seconds</p>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8">
							<div class="col-auto md:col-span-2">
								<AppFormCombobox label="Doctor" :options="options" v-model:model-value="physician" trigger-class-name="w-full" />
							</div>
							<AppFormTextArea label="Reason for appointment" placeholder="ex: Health Checkup" />
							<AppFormTextArea label="Additional comments/notes" placeholder="ex: Prefer afternoon appointments. if possible" />
							<div class="col-auto md:col-span-2 w-full">
								<AppFormDatePicker
									label="Expected appointment date"
									placeholder="Select expected appointment date"
									v-model:modelValue="expectedAppointmentDate"
									triggerClassName="w-full sm:w-[472px] md:w-[876px] h-12 mt-1" />
							</div>
							<div class="w-full col-auto md:col-span-2">
								<Button :disabled="loading" class="bg-[#24AE7C] w-full hover:bg-[#127D6B] transition-colors duration-300 ease-in-out h-12 text-base font-semibold" size="lg" @click="onSubmit()">
									<LoaderCircleIcon class="w-20 h-20 animate-spin mr-2" v-if="loading" />
									Submit and Continue</Button
								>
							</div>
						</div>
					</div>
					<div class="">
						<p class="text-sm text-[#76828D]">&copy; CarePulse {{ new Date().getFullYear() }}</p>
					</div>
				</div>
			</div>
			<div class="hidden md:block md:col-span-3 h-screen">
				<img src="/images/appoinment-req-banner.png" alt="" class="h-full w-full object-cover rounded-l-3xl" />
			</div>
		</div>
	</div>
</template>
