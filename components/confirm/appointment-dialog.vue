<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { IAppointment } from "~/types/Appointment";
import { DateFormatter } from "@internationalized/date";
import Badge from "../ui/badge/Badge.vue";

interface IProps {
	appointmentItem: IAppointment;
	mutate?: VoidFunction;
}

defineProps<IProps>();

const df = new DateFormatter("en-US", {
	dateStyle: "long",
    timeStyle: "short"
});
</script>
<template>
	<Dialog>
		<DialogTrigger as-child>
			<Button variant="ghost" class="text-[#24AE7C]"> Schedule </Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[500px] bg-[#181d23] border-none">
			<DialogHeader class="gap-4">
				<DialogTitle class="text-white">Confirm Appointment Schedule</DialogTitle>
				<DialogDescription class="text-[#ABB8C4]"> Please confirm in the following details to schedule appointment</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="flex flex-col gap-2">
					<Label class="font-semibold text-[#ABB8C4] text-lg"> Doctor </Label>
                    <Badge variant="secondary" class="max-w-[200px] w-full bg-gray-700 text-gray-200 py-1.5 rounded-lg ">
                        {{ appointmentItem.doctor.name }}
                    </Badge>
				</div>
				<div class="flex flex-col gap-2">
					<Label class="font-semibold text-[#ABB8C4] text-lg"> Reason for appointment </Label>
					<p class="text-gray-300 text-xs" >{{ appointmentItem.reason }} Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore voluptate nemo iusto placeat rem! Molestiae nisi consequatur fugiat facere aut.</p>
				</div>
				<div class="flex flex-col gap-2">
					<Label class="font-semibold text-[#ABB8C4] text-lg"> Expected appointment date </Label>
					<div class="bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00] px-4 py-2.5 max-w-[400px] w-full text-white rounded-xl text-sm">
                        {{ df.format(new Date(appointmentItem.appointmentDate)) }}
                    </div>
				</div>
			</div>
			<DialogFooter class="justify-center">
				<Button type="submit" class="w-full bg-[#24AE7C] hover:bg-[#127D6B] transition-colors duration-300 ease-in-out"> Save changes </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
