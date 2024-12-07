<script lang="ts" setup>
import Vue3Dropzone from "@jaxtheprime/vue3-dropzone";
import "@jaxtheprime/vue3-dropzone/dist/style.css";
import { Label } from "@/components/ui/label";

interface IProps {
	label?: string;
	modelValue?: File[];
}

defineProps<IProps>();
const emit = defineEmits(["update:modelValue"]);

</script>
<template>
	<div class="flex flex-col space-y-3">
		<Label class="font-semibold text-[#ABB8C4]" v-if="label">
			{{ label }}
			<Vue3Dropzone class="mt-5" :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)"  />
		</Label>
	</div>
</template>
