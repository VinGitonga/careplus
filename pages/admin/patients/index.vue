<script lang="ts" setup>
import type { ColumnDef } from "@tanstack/vue-table";
import { CheckIcon, HourglassIcon, XIcon } from "lucide-vue-next";
import type { IApiResponseType } from "~/types/Api";
import type { TApiError } from "~/types/Error";
import type { TPatientData } from "~/types/Patient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

definePageMeta({ layout: "admin" });

const patients = ref<TPatientData[]>([]);

const icons = {
	["active"]: {
		icon: h(CheckIcon, { class: "text-[#24AE7C] w-4 h-4 mr-2" }),
		textColor: "text-[#24AE7C]",
		bgColor: "bg-[#0D2A1F]",
	},
	["deleted"]: {
		icon: h(XIcon, { class: "text-[#F37877] w-4 h-4 mr-2" }),
		textColor: "text-[#F37877]",
		bgColor: "bg-[#3E1716]",
	},
	["suspended"]: {
		icon: h(HourglassIcon, { class: "text-[#79B5EC] w-4 h-4 mr-2" }),
		textColor: "text-[#79B5EC]",
		bgColor: "bg-[#152432]",
	},
};

const columns: ColumnDef<TPatientData>[] = [
	{
		accessorKey: "user.name",
		header: () => h("div", { class: "capitalize text-white" }, "Patient"),
		cell({ row }) {
			const userData = row.original.user;

			const avatarContent = h(Avatar, null, { default: () => [h(AvatarImage, { src: "https://google.com", alt: "@avatar" }), h(AvatarFallback, null, getInitials(userData?.name!))] });
			const doctorName = userData && userData.name ? userData.name : "Unknown Doctor";

			return h("div", { class: "flex items-center gap-2" }, { default: () => [avatarContent, doctorName] });
		},
	},
	{
		accessorKey: "user.email",
		header: () => h("div", { class: "capitalize text-white" }, "Email"),
		cell({ row }) {
			const userData = row.original.user;

			return h("span", userData?.email);
		},
	},
	{
		accessorKey: "gender",
		header: () => h("div", { class: "capitalize text-white" }, "Gender"),
		cell({ row }) {
			const textItem = h("span", null, row.original.gender);
			return h(Badge, { class: `capitalize` }, textItem);
		},
	},
	{
		accessorKey: "user.status",
		header: () => h("div", { class: "capitalize text-white" }, "Status"),
		cell({ row }) {
			const selectedIcon = icons[row?.original?.user?.status ?? "active"];
			const textItem = h("span", { class: selectedIcon.textColor }, row.original.user?.status);
			return h(Badge, { class: `${selectedIcon.bgColor} capitalize` }, { default: () => [selectedIcon.icon, textItem] });
		},
	},
];

const getAllPatients = async () => {
	const { data, error } = await useFetch<IApiResponseType<TPatientData[]>, TApiError>("/api/patients", { method: "GET" });

	if (!error.value) {
		if (data.value?.status === "success") {
			patients.value = data.value.data! ?? [];
		}
	} else {
		console.log("err", error.value);
	}
};

onMounted(() => {
	getAllPatients();
});
</script>
<template>
	<Title>Patients</Title>
	<div class="text-white font-sans">
		<div class="mb-10 flex items-center justify-between">
			<h1 class="text-4xl font-bold">Patients</h1>
		</div>
        <div class="">
			<DataTable :columns="columns" :data="patients" />
		</div>
	</div>
</template>
