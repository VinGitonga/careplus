<script setup lang="ts">
import type { DateValue } from "@internationalized/date";
import { Calendar, MailIcon, PhoneIcon } from "lucide-vue-next";

const dob = ref<DateValue>();
</script>
<template>
	<Title>Onboarding</Title>
	<div class="h-screen bg-[#131619] text-white">
		<div class="grid grid-cols-10">
			<div class="col-span-7">
				<div class="px-4 md:px-16 py-10 flex flex-col h-screen md:h-full overflow-y-scroll">
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
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
								<AppFormDatePicker label="Date of Birth" placeholder="Select date of birth" v-model:modelValue="dob" triggerClassName="w-[430px] h-12 mt-1" />
								<AppFormInput label="Full Name" placeholder="ex: Adam" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-span-3 max-h-screen">
				<img src="/images/Onboarding-Img.png" alt="" class="h-full w-full object-cover" />
			</div>
		</div>
	</div>
</template>
