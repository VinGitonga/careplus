<script setup lang="ts">
import { Button } from "~/components/ui/button";
const { status } = useAuth();
const computedStatus = computed(() => status.value);
const router = useRouter();
</script>
<template>
	<div class="h-dvh flex items-center justify-center">
		<div class="text-center space-y-3">
			<h1 class="text-center text-5xl font-semibold">Welcome to CarePulse</h1>
			<div class="flex items-center justify-center gap-2">
				<Button @click="router.push(computedStatus === 'authenticated' ? '/admin' : '/auth/onboarding')">
					{{ computedStatus === "authenticated" ? "Dashboard" : "Get Started" }}
				</Button>
				<Button variant="outline" v-if="computedStatus !== 'authenticated'" @click="router.push('/auth/login')">
					Login
				</Button>
			</div>
		</div>
	</div>
</template>
