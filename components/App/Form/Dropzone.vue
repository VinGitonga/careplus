<script lang="ts" setup>
import Vue3Dropzone from "@jaxtheprime/vue3-dropzone";
import "@jaxtheprime/vue3-dropzone/dist/style.css";
import { Label } from "@/components/ui/label";

interface IProps {
	label?: string;
	modelValue?: File[];
}

const props = defineProps<IProps>();
// const emit = defineEmits(["update:modelValue"]);
const emit = defineEmits<{ "update:modelValue": [val: any]; fileUploaded: [file: File] }>();

const handleFileUpload = (val: any) => {
	console.log("fileVal", val);
	console.log("modelValue", props.modelValue);
};

function handleError(error: { type: string; files: File[] }) {
	const { type, files } = error;

	if (type === "file-too-large") {
		console.error(`The following files are too large: ${files.map((file) => file.name).join(", ")}`);
	} else if (type === "invalid-file-format") {
		console.error(`The following files are not accepted formats: ${files.map((file) => file.name).join(", ")}`);
	}
}
</script>
<template>
	<div class="flex flex-col space-y-3">
		<Label class="font-semibold text-[#ABB8C4]" v-if="label">
			{{ label }}
		</Label>
		<Vue3Dropzone class="mt-5 !font-sans" :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" @fileUploaded="handleFileUpload" @error="handleError">
			<template #title>
				<p class="font-sans">Drag n Drop Files Here!</p>
			</template>
			<template #description>
				<p class="font-sans">PNG, JPG or PDF (max: 10MB)</p>
			</template>
		</Vue3Dropzone>
	</div>
</template>
