<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toTypedSchema } from "@vee-validate/zod";
import { LoaderCircle, MailIcon, PhoneIcon, UserRoundIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";
import type { IApiResponseType } from "~/types/Api";
import type { TApiError } from "~/types/Error";

const loading = ref<boolean>(false);
const emits = defineEmits<{ onSave: [] }>();

const formObject = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email({ message: "Invalid Email Address" }),
	phoneNo: z
		.string()
		.length(10, "Phone Number must be 10 characters")
		.refine((val) => phoneNoRegex.test(val), {
			message: "Invalid Phone Number",
		}),
	speciality: z.string().min(1, "Speciality is required"),
});

const formSchema = toTypedSchema(formObject);

const { handleSubmit, resetForm } = useForm({
	validationSchema: formSchema,
	initialValues: {
		name: "",
		email: "",
		phoneNo: "",
		speciality: "",
	},
});

const onSubmit = handleSubmit(async (data) => {
	const { speciality, ...userData } = data;

	const userInfo = {
		...userData,
		role: "doctor",
	};

	const doctorInfo = {
		speciality,
	};

	const body = {
		userInfo,
		doctorInfo,
	};

	const id = toast.loading("Saving Info ...");
	loading.value = true;

	const { data: _respVal, error } = await useFetch<IApiResponseType, TApiError>("/api/users/save-doctor", { method: "POST", body });

	const errorVal = error.value;

	if (!errorVal) {
		toast.success("Doctor Info saved successfully", { id });
		resetForm();
		loading.value = false;
		emits("onSave");
	} else {
		toast.error(errorVal.data.data?.msg ?? "Unable to save doctor information at the moment", { id });
	}
});
</script>
<template>
	<Dialog>
		<DialogTrigger as-child>
			<Button> New Doctor </Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[600px] font-sans bg-[#181d23] text-white">
			<form @submit="onSubmit">
				<DialogHeader>
					<DialogTitle>Onboard New Doctor</DialogTitle>
					<DialogDescription class="text-gray-300 text-sm"> Add new doctor information here. Click save when you're done. </DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<AppFormInput name="name" controlled label="Name" placeholder="Adrian Hajdin" class="focus:border-[#82ac9d] focus:border-4 transition-colors ease-in-out duration-500">
						<template v-slot:leftIcon>
							<UserRoundIcon class="w-4 h-4" />
						</template>
					</AppFormInput>
					<AppFormInput name="email" controlled label="Email address" placeholder="adrian@jsmastery.org" class="focus:border-[#82ac9d] focus:border-4 duration-500 ease-in-out">
						<template v-slot:leftIcon>
							<MailIcon class="w-4 h-4" />
						</template>
					</AppFormInput>
					<AppFormInput name="phoneNo" label="Phone number" controlled placeholder="0704260663" class="focus:border-[#82ac9d] focus:border-4 duration-500 ease-in-out">
						<template v-slot:leftIcon>
							<PhoneIcon class="w-4 h-4" />
						</template>
					</AppFormInput>
					<AppFormInput name="speciality" label="Speciality" controlled placeholder="e.g. Dentistry, Pharmacists" class="focus:border-[#82ac9d] focus:border-4 duration-500 ease-in-out transition-colors" />
				</div>
				<DialogFooter>
					<Button :disabled="loading" class="bg-[#24AE7C] hover:bg-[#127D6B] transition-colors duration-300 ease-in-out h-12 text-base font-semibold" size="lg" type="submit">
						<LoaderCircle class="w-20 h-20 animate-spin mr-2" v-if="loading" />
						Save</Button
					>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
