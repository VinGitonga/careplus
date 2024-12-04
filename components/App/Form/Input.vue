<script setup lang="ts">
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-icons/vue";
import { cn } from "~/lib/utils";

interface AppInputProps {
	name?: string;
	label?: string;
	type?: string;
	placeholder?: string;
	class?: string;
	helperText?: string;
	modelValue?: string;
	controlled?: boolean;
	isPassword?: boolean;
}

const props = withDefaults(defineProps<AppInputProps>(), {
	type: "text",
	controlled: false,
});

const showPass = ref<boolean>(false);

const handleToggle = () => {
	showPass.value = !showPass.value;
};

const emit = defineEmits(["update:modelValue"]);
</script>
<template>
	<FormField v-if="controlled" v-slot="{ componentField }" :name="props.name!">
		<FormItem>
			<FormLabel class="text-[#ABB8C4]"v-if="label">{{ label }}</FormLabel>
			<FormControl>
				<div v-if="isPassword" class="relative">
					<Input :type="type === 'password' ? (showPass ? 'text' : 'password') : type" :placeholder="placeholder" v-bind="componentField" :class="cn('hide-password-toggle pr-10', props.class)" class="w-full" />
					<Button type="button" variant="ghost" size="sm" class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" @click="handleToggle()">
						<EyeOpenIcon v-if="showPass" class="w-4 h-4" aria-hidden="true" />
						<EyeClosedIcon v-else class="w-4 h-4" aria-hidden="true" />
					</Button>
				</div>
				<Input v-else :type="type" :placeholder="placeholder" v-bind="componentField" :class="class" class="w-full" />
			</FormControl>
			<FormDescription v-if="helperText">{{ helperText }}</FormDescription>
			<FormMessage />
		</FormItem>
	</FormField>
	<div class="space-y-2" v-else>
		<Label v-if="label" class="font-semibold text-[#ABB8C4]">
			{{ label }}
		</Label>
		<div v-if="isPassword" class="relative">
			<Input
				:type="type === 'password' ? (showPass ? 'text' : 'password') : type"
				:placeholder="placeholder"
				:model-value="modelValue"
				@update:modelValue="emit('update:modelValue', $event)"
				:class="cn('hide-password-toggle pr-10', props.class)"
				class="w-full" />
			<Button type="button" variant="ghost" size="sm" class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" @click="handleToggle()">
				<EyeOpenIcon v-if="showPass" class="w-4 h-4" aria-hidden="true" />
				<EyeClosedIcon v-else class="w-4 h-4" aria-hidden="true" />
			</Button>
		</div>
		<div class="relative" v-else>
			<div class="absolute left-0 top-0 h-full">
                <div class="px-3 py-4">
                    <slot name="leftIcon"></slot>
                </div>
			</div>
			<Input :type="type" :placeholder="placeholder" :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :class="cn($slots.leftIcon ? 'pl-8' : '', props.class)" class="w-full" />
		</div>
		<p v-if="helperText" class="text-sm text-muted-foreground">
			{{ helperText }}
		</p>
	</div>
</template>
<style scoped>
.hide-password-toggle::-ms-reveal,
.hide-password-toggle::-ms-clear {
	visibility: hidden;
	pointer-events: none;
	display: none;
}
</style>
