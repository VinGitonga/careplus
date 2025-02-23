<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const { data, signOut } = useAuth();

const account = computed(() => data.value?.user);

function getFirstName(name: string) {
	return name ? name.trim().split(" ")[0].toLowerCase() : "";
}

const logout = async () => {
	await signOut({ callbackUrl: "/auth/login" });
};
</script>
<template>
	<div class="bg-[#131619] text-white rounded-2xl">
		<div class="flex items-center justify-between py-4 px-10">
			<AppLogo />
			<DropdownMenu>
				<DropdownMenuTrigger :as-child="true">
					<Button>
						<Avatar class="border border-primary">
							<AvatarImage :src="`https://api.dicebear.com/9.x/adventurer/svg?seed=${getFirstName(account?.name!)}`" :alt="account?.name ?? 'Unknown'" />
							<AvatarFallback>
								{{ getInitials(account?.name ?? "Unknown") }}
							</AvatarFallback>
						</Avatar>
						{{ account?.name ?? "Unknown" }}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent class="w-[250px] mr-3 font-sans bg-[#131619] text-white">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem @click="logout()">Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>
</template>
