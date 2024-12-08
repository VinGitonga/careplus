<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import type { IOption } from "~/types/Option";

interface IProps {
	name?: string;
	label?: string;
	subLabel?: string;
	options: IOption[];
	controlled?: boolean;
	modelValue?: string[];
}

const props=withDefaults(defineProps<IProps>(), { controlled: false });

const emit = defineEmits(["update:modelValue"]);

console.log('modelValue', props.modelValue)
</script>
<template>
	<FormField :name="name!" v-if="controlled">
		<FormItem>
			<div class="mb-4">
				<FormLabel class="text-base text-[#ABB8C4]" v-if="label"> {{ label }} </FormLabel>
				<FormDescription v-if="subLabel">{{ subLabel }} </FormDescription>
			</div>
			<FormField v-for="item in options" v-slot="{ value, handleChange }" :key="item.value" type="checkbox" :value="item.value" :unchecked-value="false" :name="name!">
				<FormItem class="flex flex-row items-start space-x-3 space-y-0">
					<FormControl>
						<Checkbox :checked="value.includes(item.value)" @update:checked="handleChange" />
					</FormControl>
					<FormLabel class="font-normal">
						{{ item.label }}
					</FormLabel>
				</FormItem>
			</FormField>
			<FormMessage />
		</FormItem>
	</FormField>
	<div class="space-y-2" v-else>
		<div class="mb-4">
			<Label class="font-semibold text-[#ABB8C4]" v-if="label">
				{{ label }}
			</Label>
			<p class="text-sm text-muted-foreground" v-if="subLabel">
				{{ subLabel }}
			</p>
		</div>
		<div :key="item.value" v-for="item in options" class="">
			<div class="flex flex-row items-center space-x-3 space-y-0 mb-5">
				<Checkbox
                    :value="item.value"
					:checked="modelValue?.includes(item.value)"
                    :unchecked-value="false"
					@update:checked="val => {
						if (val) {
							emit('update:modelValue', [...modelValue!, item.value]); // Add value if checked
						} else {
							emit('update:modelValue', modelValue!.filter(value => value !== item.value)); // Remove value if unchecked
						}
					}" />
				<Label class="text-[#ABB8C4] font-normal">
					{{ item.label }}
				</Label>
			</div>
		</div>
	</div>
</template>
