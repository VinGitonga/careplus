<script setup lang="ts">
const router = useRouter()

onMounted(() => {
    router.push('/auth/get-started')
})
</script>
<template>
    <div class="h-dvh bg-[#131619] text-white">
        <h1>Auth Page</h1>
    </div>
</template>
