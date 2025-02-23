<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate, type DateValue } from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

interface IProps {
	label?: string;
	modelValue?: DateValue;
	helperText?: string;
	placeholder?: string;
	triggerClassName?: string;
	name?: string;
	controlled?: boolean;
	selectedValue?: string;
	setSelectedValue?: (name: string, value: string | undefined) => void;
	minDate?: CalendarDate;
	maxDate?: CalendarDate;
}

const props = withDefaults(defineProps<IProps>(), {
	placeholder: "Pick a date",
	controlled: false,
});

const df = new DateFormatter("en-US", {
	dateStyle: "long",
});

const emit = defineEmits(["update:modelValue"]);

const value = computed({
	get: () => (props.selectedValue ? parseDate(props.selectedValue) : undefined),
	set: (val) => val,
});
</script>
<template>
	<FormField v-if="props.controlled" :name="name!">
		<FormItem class="flex flex-col items-start gap-y-4">
			<FormLabel v-if="label" class="text-[#ABB8C4]">
				{{ label }}
			</FormLabel>
			<Popover>
				<PopoverTrigger as-child>
					<FormControl>
						<Button variant="outline" :class="cn('w-[280px] justify-start text-left font-normal bg-inherit hover:bg-inherit', !modelValue && 'text-muted-foreground', triggerClassName)">
							<CalendarIcon class="mr-2 h-4 w-4" />
							<span class="text-gray-200">
								{{ value ? df.format(value.toDate(getLocalTimeZone())) : placeholder }}
							</span>
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<Calendar
						:model-value="value"
						:min-value="props.minDate"
						:max-value="props.maxDate"
						@update:modelValue="(v) => {
						if(v){
							props.setSelectedValue && props.setSelectedValue(props.name!, v.toString())
						} else {
							props.setSelectedValue && props.setSelectedValue(props.name!, undefined)
						}
					}"
						initial-focus />
				</PopoverContent>
			</Popover>
			<FormDescription v-if="helperText"> {{ helperText }} </FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
	<div v-else class="flex flex-col items-start gap-y-4">
		<Label v-if="label" class="font-semibold text-[#ABB8C4]">
			{{ label }}
		</Label>
		<Popover>
			<PopoverTrigger>
				<Button variant="outline" :class="cn('w-[280px] justify-start text-left font-normal bg-inherit hover:bg-inherit', !modelValue && 'text-muted-foreground', triggerClassName)">
					<CalendarIcon class="mr-2 h-4 w-4" />
					<span class="text-gray-200">
						{{ modelValue ? df.format(modelValue.toDate(getLocalTimeZone())) : placeholder }}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent class="w-auto p-0">
				<Calendar :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" initial-focus :min-value="props.minDate" :max-value="props.maxDate" />
			</PopoverContent>
		</Popover>
	</div>
</template>
