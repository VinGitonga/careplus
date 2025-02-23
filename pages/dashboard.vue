<script setup lang="ts">
import { Loader2Icon } from "lucide-vue-next";
const { data } = useAuth();
const router = useRouter();

onMounted(() => {
	if (data.value) {
		const val = data.value;
		if (val.user?.role === "admin") {
			router.push("/admin");
		} else if(val?.user?.role === 'patient'){
            router.push("/patient");
        } else {
            router.push("/auth/onboarding");
        }
	} else {
		router.push("/auth/login");
	}
});
</script>
<template>
	<div class="text-white h-dvh font-sans bg-[#131619]">
		<div class="flex flex-col items-center justify-center h-full space-y-3">
			<div class="flex items-center justify-center space-x-2">
				<Loader2Icon class="w-20 h-20 animate-spin" />
			</div>
			<h1 class="text-center text-5xl font-semibold">CarePulse</h1>
		</div>
	</div>
</template>
