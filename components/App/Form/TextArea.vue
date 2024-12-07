<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
interface AppTextAreaProps {
	name?: string;
	label?: string;
	placeholder?: string;
	class?: string;
	helperText?: string;
	modelValue?: string;
	controlled?: boolean;
}

const props = withDefaults(defineProps<AppTextAreaProps>(), {
	controlled: false,
	placeholder: "Type something ...",
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
	<FormField v-if="controlled" v-slot="{ componentField }" :name="props.name!">
		<FormItem>
			<FormLabel class="text-[#ABB8C4]" v-if="label">{{ label }}</FormLabel>
			<FormControl>
				<Textarea :placeholder="placeholder" :class="class" v-bind="componentField"></Textarea>
			</FormControl>
			<FormDescription v-if="helperText"> {{ helperText }} </FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
	<div class="space-y-2" v-else>
		<Label v-if="label" class="font-semibold text-[#ABB8C4]">
			{{ label }}
		</Label>
		<Textarea :placeholder="placeholder" :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" :class="class"></Textarea>
		<p v-if="helperText" class="text-sm text-muted-foreground">
			{{ helperText }}
		</p>
	</div>
</template>
