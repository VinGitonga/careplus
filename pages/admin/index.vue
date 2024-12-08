<script setup lang="ts">
definePageMeta({ layout: "admin" });

import { CalendarCheck2Icon, HourglassIcon, TriangleAlertIcon } from "lucide-vue-next";
</script>
<template>
	<Title>Admin</Title>
	<div class="text-white font-sans">
		<div class="mb-10 space-y-2">
			<h1 class="text-4xl font-bold">Welcome, Admin</h1>
			<p class="text-lg font-medium text-[#ABB8C4]">Start day with managing new appointments</p>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
			<div class="px-6 py-6 border-t border-t-white/10 w-full rounded-xl bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00] ">
				<div class="flex items-center gap-3">
					<CalendarCheck2Icon class="w-8 h-8 text-[#FFD147]" />
					<span>
						<h1 class="text-[32px] leading-10 font-bold">94</h1>
					</span>
				</div>
                <div class="mt-3">
                    <p>Total number of scheduled appointments</p>
                </div>
			</div>
			<div class="px-6 py-6 border-t border-t-white/10 w-full rounded-xl bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00] ">
				<div class="flex items-center gap-3">
					<HourglassIcon class="w-8 h-8 text-[#77B5EC]" />
					<span>
						<h1 class="text-[32px] leading-10 font-bold">32</h1>
					</span>
				</div>
                <div class="mt-3">
                    <p class="font-medium">Total number of scheduled appointments</p>
                </div>
			</div>
			<div class="px-6 py-6 border-t border-t-white/10 w-full rounded-xl bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00] ">
				<div class="flex items-center gap-3">
					<TriangleAlertIcon class="w-8 h-8 text-[#FF4F4E]" />
					<span>
						<h1 class="text-[32px] leading-10 font-bold">56</h1>
					</span>
				</div>
                <div class="mt-3">
                    <p class="font-medium">Total number of cancelled  appointments</p>
                </div>
			</div>
		</div>
	</div>
</template>
