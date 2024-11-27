<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { MailIcon, PhoneIcon, UserRoundIcon } from "lucide-vue-next";
</script>
<template>
	<Title>Get Started</Title>
	<div class="h-screen bg-[#131619] text-white">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5">
			<div class="col-auto md:col-span-1">
				<div class="px-4 md:px-16 py-10 flex flex-col justify-between h-screen md:h-full">
					<div class="flex items-center gap-x-2">
						<img src="/images/Logomark.png" alt="" class="w-10 h-10" />
						<h1 class="text-xl font-bold">CarePulse</h1>
					</div>
					<div class="">
						<div class="mb-10 space-y-2">
							<h1 class="text-4xl font-bold">Hi there, ...</h1>
							<p class="text-lg font-medium text-[#ABB8C4]">Get Started with Appointments.</p>
						</div>
						<div class="my-5 space-y-7">
							<AppFormInput label="Full Name" placeholder="Adrian Hajdin" class="focus:border-[#82ac9d] focus:border-4 transition-colors ease-in-out duration-300">
								<template v-slot:leftIcon>
									<UserRoundIcon class="w-4 h-4" />
								</template>
							</AppFormInput>
							<AppFormInput label="Email address" placeholder="adrian@jsmastery.org" class="focus:border-[#82ac9d] focus:border-4">
								<template v-slot:leftIcon>
									<MailIcon class="w-4 h-4" />
								</template>
							</AppFormInput>
							<AppFormInput label="Phone number" placeholder="+254704260663" class="focus:border-[#82ac9d] focus:border-4">
								<template v-slot:leftIcon>
									<PhoneIcon class="w-4 h-4" />
								</template>
							</AppFormInput>
							<Button class="bg-[#24AE7C] w-full hover:bg-[#127D6B] transition-colors duration-300 ease-in-out h-12 text-lg font-semibold" size="lg">Get Started</Button>
						</div>
					</div>
					<div class="">
						<p class="text-sm text-[#76828D]">&copy; CarePulse {{ new Date().getFullYear() }}</p>
					</div>
				</div>
			</div>
			<div class="hidden md:block md:col-span-1 h-screen">
				<img src="/images/Illustration.png" alt="" class="h-full w-full object-cover" />
			</div>
		</div>
	</div>
</template>
