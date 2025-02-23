<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { ref, type DefineComponent } from "vue";
import { cn } from "~/lib/utils";
import type { IOption } from "~/types/Option";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const open = ref(false);

type CustomOption = IOption & { icon?: DefineComponent | string };

interface IProps {
	label?: string;
	options: CustomOption[];
	placeholder?: string;
	controlled?: boolean;
	helperText?: string;
	searchPlaceholder?: string;
	modelValue?: string;
	emptySearch?: string;
	name?: string;
	selectedValue?: string;
	setSelectedValue?: (name: string, value: string) => void;
	triggerClassName?: string
	contentContainerClassName?: string
}

const props = withDefaults(defineProps<IProps>(), {
	placeholder: "Choose ...",
	controlled: false,
	emptySearch: "",
});

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
	<FormField v-if="props.controlled" :name="name!">
		<FormItem class="space-y-3 flex flex-col">
			<FormLabel v-if="label" class="text-[#ABB8C4]">{{ label }}</FormLabel>
			<Popover v-model:open="open">
				<PopoverTrigger as-child>
					<FormControl>
						<Button variant="outline" role="combobox" :class="cn('w-[430px] justify-between bg-inherit hover:bg-inherit hover:text-inherit h-12', !selectedValue && 'text-muted-foreground',triggerClassName)">
							{{ selectedValue ? props.options.find((opt) => opt.value === selectedValue)?.label : placeholder }}
							<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</FormControl>
				</PopoverTrigger>
				<PopoverContent :class="cn('w-[430px] p-0 bg-gray-800 text-white', contentContainerClassName)">
					<Command class="bg-gray-800 text-white w-full">
						<CommandInput :placeholder="props.searchPlaceholder" />
						<CommandEmpty>
							{{ props.emptySearch }}
						</CommandEmpty>
						<CommandList>
							<CommandGroup>
								<CommandItem
									v-for="opt in props.options"
									:key="opt.value"
									:value="opt.value"
									class="data-[highlighted]:bg-gray-600"
									@select="
										(ev) => {
											if (typeof ev.detail.value === 'string') {
												props.setSelectedValue && props.setSelectedValue(props.name!, ev.detail.value);
											}
											open = false;
										}
									">
									{{ opt.label }}
									<Check :class="cn('ml-auto h-4 w-4', selectedValue === opt.value ? 'opacity-100' : 'opacity-0')" />
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<FormDescription v-if="helperText">
				{{ helperText }}
			</FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
	<div class="space-y-3 flex flex-col" v-else>
		<Label class="font-semibold text-[#ABB8C4]" v-if="label">
			{{ label }}
		</Label>
		<Popover v-model:open="open">
			<PopoverTrigger as-child>
				<Button variant="outline" role="combobox" :aria-expanded="open" :class="cn('w-[430px] justify-between bg-inherit hover:bg-inherit hover:text-inherit h-12', triggerClassName)">
					{{ props.modelValue ? props.options.find((opt) => opt.value === modelValue)?.label : placeholder }}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent :class="cn('w-[430px] p-0 bg-gray-800 text-white', contentContainerClassName)">
				<Command class="bg-gray-800 text-white">
					<CommandInput class="h-9" :placeholder="props.searchPlaceholder" />
					<CommandEmpty>
						{{ props.emptySearch }}
					</CommandEmpty>
					<CommandList>
						<CommandGroup>
							<CommandItem
								v-for="opt in options"
								:key="opt.value"
								:value="opt.value"
								class="data-[highlighted]:bg-gray-600"
								@select="
									(ev: any) => {
										if (typeof ev.detail.value === 'string') {
											emit('update:modelValue', ev.detail.value);
										}
										open = false;
									}
								">
								<span class="flex items-center gap-2">
									<img v-if="typeof opt.icon === 'string'" :src="opt.icon" alt="" class="w-8 h-8 mr-2 rounded-full" />
									<component v-else :is="opt.icon" class="w-8 h-8 mr-2"></component>
									<p class="text-white">
										{{ opt.label }}
									</p>
								</span>
								<Check :class="cn('ml-auto h-4 w-4 text-white', modelValue === opt.value ? 'opacity-100' : 'opacity-0')" />
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
		<p v-if="helperText" class="text-sm text-muted-foreground">
			{{ helperText }}
		</p>
	</div>
</template>
