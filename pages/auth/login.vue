<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { LoaderCircle, MailIcon, PhoneIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { phoneNoRegex } from "~/utils";
import type { IApiResponseType } from "~/types/Api";
import type { TApiError } from "~/types/Error";

const loading = ref<boolean>(false);
const otpDialog = ref<boolean>(false);
const otpValue = ref<string[]>([]);
const isVerifyingOTP = ref<boolean>(false);

const { signIn } = useAuth();
const router = useRouter();

const loginFormObject = z.object({
	email: z.string().email({ message: "Invalid Email Address" }),
	phoneNo: z
		.string()
		.length(10, "Phone Number must be 10 characters")
		.refine((val) => phoneNoRegex.test(val), {
			message: "Invalid Phone Number",
		}),
});

const formSchema = toTypedSchema(loginFormObject);

const validatedFormData = ref<{ email: string; phoneNo: string }>();

const { handleSubmit, resetForm } = useForm({
	validationSchema: formSchema,
	initialValues: {
		email: "",
		phoneNo: "",
	},
});

const onSubmit = handleSubmit(async (data) => {
	loading.value = true;

	const { data: _, error } = await useFetch<IApiResponseType, TApiError>("/api/users/otp/request", {
		method: "POST",
		body: { ...data },
	});

	const errVal = error.value;

	if (!errVal) {
		toast.success("OTP sent successfully.");
		otpDialog.value = true;
		validatedFormData.value = { ...data };
		loading.value = false
	} else {
		toast.error(errVal?.data.data?.msg ?? "Something went wrong");
		loading.value = false
	}
});

const handleOtpComplete = async (vals: string[]) => {
	isVerifyingOTP.value = true;
	const id = toast.loading("Verifying OTP ...");

	try {
		const resp = await signIn("credentials", {
			email: validatedFormData.value?.email,
			phoneNo: validatedFormData.value?.phoneNo,
			otp: vals.join("").toUpperCase(),
			redirect: false,
		});

		if (resp?.error) {
			toast.error(resp?.error ?? "Invalid OTP", { id });
		} else {
			toast.success("OTP Verified successfully", { id });
			otpDialog.value = false;
			resetForm();
			// redirect to the appropriate page
			router.push("/admin");
		}
	} catch (err: any) {
		toast.error(err?.response?.data?.msg ?? err?.message ?? "Invalid OTP");
	} finally {
		isVerifyingOTP.value = false;
	}
};
</script>
<template>
	<Title>Login</Title>
	<div class="h-screen bg-[#131619] text-white">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5">
			<div class="col-auto md:col-span-1">
				<div class="px-4 md:px-16 py-10 flex flex-col justify-between h-screen md:h-full">
					<div class="flex items-center gap-x-2">
						<img src="/images/Logomark.png" alt="" class="w-10 h-10" />
						<h1 class="text-xl font-bold">CarePulse</h1>
					</div>
					<div class="">
						<div class="mb-10 space-y-2">
							<h1 class="text-4xl font-bold">Hi there, ...</h1>
							<p class="text-lg font-medium text-[#ABB8C4]">Welcome back to CarePulse.</p>
						</div>
						<form @submit="onSubmit">
							<div class="my-5 space-y-7">
								<AppFormInput name="email" controlled label="Email address" placeholder="adrian@jsmastery.org" class="focus:border-[#82ac9d] focus:border-4">
									<template v-slot:leftIcon>
										<MailIcon class="w-4 h-4" />
									</template>
								</AppFormInput>
								<AppFormInput name="phoneNo" controlled label="Phone number" placeholder="0704260663" class="focus:border-[#82ac9d] focus:border-4">
									<template v-slot:leftIcon>
										<PhoneIcon class="w-4 h-4" />
									</template>
								</AppFormInput>
								<Button :disabled="loading" class="bg-[#24AE7C] w-full hover:bg-[#127D6B] transition-colors duration-300 ease-in-out h-12 text-lg font-semibold" size="lg" type="submit">
									<LoaderCircle class="w-20 h-20 animate-spin mr-2" v-if="loading" />
									Login</Button
								>
							</div>
						</form>
					</div>
					<div class="">
						<p class="text-sm text-[#76828D]">&copy; CarePulse {{ new Date().getFullYear() }}</p>
					</div>
				</div>
			</div>
			<div class="hidden md:block md:col-span-1 h-screen">
				<img src="/images/Illustration.png" alt="" class="h-full w-full object-cover rounded-l-3xl" />
			</div>
		</div>
	</div>
	<Dialog v-model:open="otpDialog">
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Verify OTP</DialogTitle>
				<DialogDescription>Please enter the OTP sent to your registered mobile number.</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<PinInput class="w-full" id="pin-input" v-model="otpValue" placeholder="○" @complete="handleOtpComplete">
					<PinInputGroup class="w-full">
						<PinInputInput class="h-16 w-16 focus:ring-[#24AE7C] text-lg text-[#24AE7C] font-bold" v-for="(id, index) in 6" :key="id" :index="index" />
					</PinInputGroup>
				</PinInput>
			</div>
			<DialogFooter class="justify-center w-full">
				<Button :disabled="isVerifyingOTP || otpValue.length < 6" class="w-full bg-[#24AE7C] hover:bg-[#127D6B] transition-colors duration-300 ease-in-out">
					<LoaderCircle class="w-20 h-20 animate-spin mr-2" v-if="isVerifyingOTP" />
					Verify
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
