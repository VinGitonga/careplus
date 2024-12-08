<script setup lang="ts"></script>
<template>
	<div class="flex flex-col flex-1 transition-all bg-[#181d23]">
        <div class="px-4 py-5">
            <AppAdminNavbar />
        </div>
		<!-- Navbar goes here -->
		<div class="flex flex-1 flex-col md:flex-row">
			<div class="flex flex-1 flex-col px-2 md:px-[100px] py-5 overflow-y-auto h-screen">
				<slot />
			</div>
		</div>
	</div>
</template>
