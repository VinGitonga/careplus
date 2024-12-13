<script setup lang="ts">
definePageMeta({ layout: "admin" });
import type { ColumnDef } from "@tanstack/vue-table";
import { CalendarCheck2Icon, CheckIcon, HourglassIcon, TriangleAlertIcon, XIcon } from "lucide-vue-next";
import { AppointmentStatus, type IAppointment } from "~/types/Appointment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateFormatter } from "@internationalized/date";
import Badge from "~/components/ui/badge/Badge.vue";
import Button from "~/components/ui/button/Button.vue";
import { appointmentsData } from "~/data/appointments-data";
import { getInitials } from "~/utils";
import ConfirmAppointmentDialog from "~/components/confirm/appointment-dialog.vue";

const df = new DateFormatter("en-US", {
	dateStyle: "long",
});

const { data } = useAuth();

const account = computed(() => {
	console.log(data.value)
	return data.value
})

const icons = {
	[AppointmentStatus.SCHEDULED]: {
		icon: h(CheckIcon, { class: "text-[#24AE7C] w-4 h-4 mr-2" }),
		textColor: "text-[#24AE7C]",
		bgColor: "bg-[#0D2A1F]",
	},
	[AppointmentStatus.CANCELLED]: {
		icon: h(XIcon, { class: "text-[#F37877] w-4 h-4 mr-2" }),
		textColor: "text-[#F37877]",
		bgColor: "bg-[#3E1716]",
	},
	[AppointmentStatus.PENDING]: {
		icon: h(HourglassIcon, { class: "text-[#79B5EC] w-4 h-4 mr-2" }),
		textColor: "text-[#79B5EC]",
		bgColor: "bg-[#152432]",
	},
};

const columns: ColumnDef<IAppointment>[] = [
	{
		accessorKey: "patient",
		header: () => h("div", { class: "capitalize text-white" }, "Patient"),
		cell({ row }) {
			const patient = row.original.patient;
			const avatarContent = h(Avatar, null, { default: () => [h(AvatarImage, { src: "https://google.com", alt: "@avatar" }), h(AvatarFallback, null, getInitials(patient.name))] });
			const patientName = patient && patient.name ? patient.name : "Unknown Patient";
			return h("div", { class: "flex items-center gap-2" }, { default: () => [avatarContent, patientName] });
		},
	},
	{
		accessorKey: "appointmentDate",
		header: () => h("div", { class: "capitalize text-white" }, "Date"),
		cell({ row }) {
			const dateVal = row.getValue("appointmentDate") as string;
			const formattedDate = df.format(dateVal ? new Date(dateVal) : new Date());
			return h("span", null, formattedDate);
		},
	},
	{
		accessorKey: "status",
		header: () => h("div", { class: "capitalize text-white" }, "Status"),
		cell({ row }) {
			const selectedIcon = icons[row.original.status];
			const textItem = h("span", { class: selectedIcon.textColor }, row.original.status);
			return h(Badge, { class: `${selectedIcon.bgColor} capitalize` }, { default: () => [selectedIcon.icon, textItem] });
		},
	},
	{
		accessorKey: "doctor",
		header: () => h("div", { class: "capitalize text-white" }, "Doctor"),
		cell({ row }) {
			const doctor = row.original.doctor;
			const avatarContent = h(Avatar, null, { default: () => [h(AvatarImage, { src: "https://api.dicebear.com/9.x/adventurer/svg?seed=quizzie", alt: "@avatar" }), h(AvatarFallback, null, getInitials(doctor.name))] });
			return h("div", { class: "flex items-center gap-2" }, { default: () => [avatarContent, doctor.name] });
		},
	},
	{
		id: "actions",
		enableHiding: false,
		header: () => h("div", { class: "capitalize text-white" }, "Actions"),
		cell({ row }) {
			// const scheduleBtn = h(Button, { variant: "ghost", class: "text-[#24AE7C]" }, "Schedule");
			const scheduleBtn = h(ConfirmAppointmentDialog, { appointmentItem: row.original });
			const cancelBtn = h(Button, { variant: "ghost" }, "Cancel");
			const containerDiv = h("div", { class: "flex items-center gap-2" }, { default: () => [scheduleBtn, cancelBtn] });

			return containerDiv;
		},
	},
];
</script>
<template>
	<Title>Admin</Title>
	<div class="text-white font-sans">
		<div class="mb-10 space-y-2">
			<h1 class="text-4xl font-bold">Welcome, Admin</h1>
			<p class="text-lg font-medium text-[#ABB8C4]">Start day with managing new appointments</p>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
			<div class="px-6 py-6 border-t border-t-white/10 w-full rounded-xl bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00]">
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
			<div class="px-6 py-6 border-t border-t-white/10 w-full rounded-xl bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00]">
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
			<div class="px-6 py-6 border-t border-t-white/10 w-full rounded-xl bg-gradient-to-r from-[#D7EDED29] from-[16%] to-[#CCEBEB00]">
				<div class="flex items-center gap-3">
					<TriangleAlertIcon class="w-8 h-8 text-[#FF4F4E]" />
					<span>
						<h1 class="text-[32px] leading-10 font-bold">56</h1>
					</span>
				</div>
				<div class="mt-3">
					<p class="font-medium">Total number of cancelled appointments</p>
				</div>
			</div>
		</div>
		<div class="mt-10">
			<p>
				{{ account?.user?.id }}
			</p>
			<!-- <DataTable :columns="columns" :data="appointmentsData" /> -->
		</div>
	</div>
</template>
