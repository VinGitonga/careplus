<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { CalendarRoot, type CalendarRootEmits, type CalendarRootProps, useDateFormatter, useForwardPropsEmits } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNextButton, CalendarPrevButton } from ".";
import { getLocalTimeZone, today, type DateValue } from "@internationalized/date";
import { useVModel } from "@vueuse/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDecade, createYear, toDate } from "reka-ui/date";

const props = withDefaults(defineProps<CalendarRootProps & { class?: HTMLAttributes["class"]; showPresets?: boolean }>(), {
	modelValue: undefined,
	placeholder() {
		return today(getLocalTimeZone());
	},
	weekdayFormat: "short",
	showPresets: true,
});

const emits = defineEmits<CalendarRootEmits>();

const delegatedProps = computed(() => {
	const { class: _, placeholder: __, ...delegated } = props;

	return delegated;
});

const placeholder = useVModel(props, "modelValue", emits, {
	passive: true,
	defaultValue: today(getLocalTimeZone()),
}) as Ref<DateValue>;

const forwarded = useForwardPropsEmits(delegatedProps, emits);

const formatter = useDateFormatter("en");
</script>

<template>
	<CalendarRoot v-slot="{ grid, weekDays, date }" :class="cn('p-3', props.class)" v-bind="forwarded" v-model:placeholder="placeholder">
		<CalendarHeader>
			<template v-if="props.showPresets">
				<CalendarHeading class="flex w-full items-center justify-between gap-2">
					<Select
						:default-value="placeholder.month.toString()"
						@update:model-value="
							(v: any) => {
								if (!v || !placeholder) return;
								if (Number(v) === placeholder?.month) return;
								placeholder = placeholder.set({
									month: Number(v),
								});
							}
						">
						<SelectTrigger aria-label="Select month" class="w-[60%]">
							<SelectValue placeholder="Select month" />
						</SelectTrigger>
						<SelectContent class="max-h-[200px]">
							<SelectItem v-for="month in createYear({ dateObj: date })" :key="month.toString()" :value="month.month.toString()">
								{{ formatter.custom(toDate(month), { month: "long" }) }}
							</SelectItem>
						</SelectContent>
					</Select>

					<Select
						:default-value="placeholder.year.toString()"
						@update:model-value="
							(v: any) => {
								if (!v || !placeholder) return;
								if (Number(v) === placeholder?.year) return;
								placeholder = placeholder.set({
									year: Number(v),
								});
							}
						">
						<SelectTrigger aria-label="Select year" class="w-[40%]">
							<SelectValue placeholder="Select year" />
						</SelectTrigger>
						<SelectContent class="max-h-[200px]">
							<SelectItem v-for="yearValue in createDecade({ dateObj: date, startIndex: -80, endIndex: 0 })" :key="yearValue.toString()" :value="yearValue.year.toString()">
								{{ yearValue.year }}
							</SelectItem>
						</SelectContent>
					</Select>
				</CalendarHeading>
			</template>
			<template v-else>
				<CalendarPrevButton />
				<CalendarHeading />
				<CalendarNextButton />
			</template>
		</CalendarHeader>

		<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
			<CalendarGrid v-for="month in grid" :key="month.value.toString()">
				<CalendarGridHead>
					<CalendarGridRow>
						<CalendarHeadCell v-for="day in weekDays" :key="day">
							{{ day }}
						</CalendarHeadCell>
					</CalendarGridRow>
				</CalendarGridHead>
				<CalendarGridBody class="grid">
					<CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
						<CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
							<CalendarCellTrigger :day="weekDate" :month="month.value" />
						</CalendarCell>
					</CalendarGridRow>
				</CalendarGridBody>
			</CalendarGrid>
		</div>
	</CalendarRoot>
</template>
