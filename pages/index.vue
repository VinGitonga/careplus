<script setup lang="ts">
import { Button } from "~/components/ui/button";
const router = useRouter();
</script>
<template>
	<div class="h-dvh flex items-center justify-center">
		<div class="text-center space-y-3">
			<h1 class="text-center text-5xl font-semibold">Welcome to CarePulse</h1>
			<Button @click="router.push('/auth')">Get Started</Button>
		</div>
	</div>
</template>
