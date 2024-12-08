<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
</script>
<template>
	<div class="bg-[#131619] text-white rounded-2xl">
		<div class="flex items-center justify-between py-4 px-10">
			<div class="flex items-center gap-x-2">
				<img src="/images/Logomark.png" alt="" class="w-10 h-10" />
				<h1 class="text-xl font-bold">CarePulse</h1>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger :as-child="true">
                    <Button>
                        <Avatar class="border border-primary">
                            <AvatarImage src="https://api.dicebear.com/9.x/adventurer/svg?seed=quizzie" alt="@radix-vue" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        Admin
                    </Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-[250px] mr-3 font-sans bg-[#131619] text-white">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuItem>Subscription</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
</template>
