<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
useHead({
	meta: [
		{
			name: "description",
			content: "A secure quiz portal",
		},
	],
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} - CarePlus` : "CarePlus";
	},
	link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});
</script>
<template>
	<div class="font-sans min-h-screen antialiased transition-colors duration-200 ease-in-out">
		<NuxtLayout>
			<NuxtPage />
			<Toaster />
		</NuxtLayout>
	</div>
</template>
