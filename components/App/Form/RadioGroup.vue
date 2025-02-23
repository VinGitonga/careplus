<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { IOption } from "~/types/Option";
import { cn } from "~/lib/utils";

interface IProps {
	name?: string;
	label?: string;
	options: IOption[];
	modelValue?: string;
	controlled?: boolean;
	defaultValue?: string;
    itemClassName?: string
    groupClassName?: string
}

const props = withDefaults(defineProps<IProps>(), {
	controlled: false,
	defaultValue: "",
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
	<FormField v-if="controlled" v-slot="{ componentField }" type="radio" :name="name!">
		<FormItem class="space-y-3">
			<FormLabel v-if="label" class="text-[#ABB8C4]">{{ label }}</FormLabel>
			<FormControl>
				<RadioGroup class="flex flex-col md:flex-row space-y-1" v-bind="componentField">
					<FormItem class="flex items-center space-y-0 gap-x-3" :key="opt.value" v-for="opt in options">
						<FormControl>
							<RadioGroupItem :value="opt.value" />
						</FormControl>
						<FormLabel class="font-normal"> {{ opt.label }} </FormLabel>
					</FormItem>
				</RadioGroup>
			</FormControl>
			<FormMessage />
		</FormItem>
	</FormField>
	<div class="space-y-2" v-else>
		<Label class="font-semibold text-[#ABB8C4]" v-if="label">
			{{ label }}
		</Label>
		<RadioGroup :default-value="defaultValue" :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :class="groupClassName" >
			<div :class="cn('flex items-center space-x-2', props.itemClassName)" :key="opt.value" v-for="(opt, idx) in options">
				<RadioGroupItem :id="`r${idx + 1}`" :value="opt.value" />
				<Label :for="`r${idx + 1}`">
					{{ opt.label }}
				</Label>
			</div>
		</RadioGroup>
	</div>
</template>
