<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateFormatter, getLocalTimeZone, type DateValue } from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";

interface IProps {
	label?: string;
	modelValue?: DateValue;
	helperText?: string;
	placeholder?: string;
    triggerClassName?: string
}

withDefaults(defineProps<IProps>(), {
	placeholder: "Pick a date",
});

const df = new DateFormatter("en-US", {
	dateStyle: "long",
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
	<div class="flex flex-col items-start gap-y-4">
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
				<Calendar :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" initial-focus />
			</PopoverContent>
		</Popover>
	</div>
</template>
