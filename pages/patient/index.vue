<script setup lang="ts">
import type { ColumnDef } from "@tanstack/vue-table";
import { AppointmentStatus, type IAppointment } from "~/types/Appointment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, HourglassIcon, XIcon } from "lucide-vue-next";
import { DateFormatter } from "@internationalized/date";
import Badge from "~/components/ui/badge/Badge.vue";
import { appointmentsData } from "~/data/appointments-data";

definePageMeta({ layout: "patient" });

const { data } = useAuth();

const account = computed(() => {
	return data.value?.user;
});

const df = new DateFormatter("en-US", {
	dateStyle: "long",
});

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
];
</script>
<template>
	<div>
		<Title>Patient</Title>
		<div class="text-white font-sans">
			<div class="flex items-center justify-between">
				<div class=" space-y-2">
					<h1 class="text-4xl font-bold">Hey, {{ account?.name }} 👋</h1>
					<p class="text-lg font-medium text-[#ABB8C4]">Request a new appointment in 10 seconds</p>
				</div>
				<NewAppointmentDialog />
			</div>
			<div class="mt-10">
				<DataTable :columns="columns" :data="appointmentsData" />
			</div>
		</div>
	</div>
</template>
