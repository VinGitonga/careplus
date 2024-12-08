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
		</Label>
		<Vue3Dropzone class="mt-5 !font-sans" :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" >
			<template #title >
				<p class="font-sans">Drag n Drop Files Here!</p>
			</template>
			<template #description>
				<p class="font-sans">PNG, JPG or PDF (max: 10MB)</p>
			</template>
		</Vue3Dropzone>
	</div>
</template>
