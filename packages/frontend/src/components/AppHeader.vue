<script setup lang="ts">
import { api } from "@/database/api";
import { useUserStore } from "@/store/user.store";
import { useDark, useToggle } from "@vueuse/core";
import { AUTH_URL } from "shared";
import { useRouter } from "vue-router";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const userStore = useUserStore();
const router = useRouter();

function logout() {
	api.post(`${AUTH_URL}/logout`).finally(() => {
		userStore.user = null;
		localStorage.removeItem("user");
		router.push({ name: "login" });
	});
}
</script>

<template>
	<div grid grid-cols-12 py-4 gap-8>
		<div col-span-1 md:col-span-2></div>
		<RouterLink
			flex
			justify-start
			items-center
			flex-row
			gap-3
			col-span-2
			md:col-span-4
			link-decoration-none
			:to="{ name: 'home' }"
		>
			<div>
				<img
					src="../assets/icon.png"
					alt="website icon"
					border-rounded-full
					w-10
				/>
			</div>
			<h1 text-5 display-none md:block>Time To Review</h1>
		</RouterLink>
		<div col-span-6 md-col-span-4 flex flex-row gap-4 items-center justify-end>
			<RouterLink
				font-600
				text-lg
				link-decoration-none
				hover:text-lime-500
				:to="{ name: 'home' }"
				>HOME</RouterLink
			>
			<RouterLink
				font-600
				text-lg
				link-decoration-none
				hover:text-lime-500
				:to="{ name: 'courses' }"
				>COURSES</RouterLink
			>
		</div>
		<div
			col-span-3
			md:col-span-2
			flex
			flex-row
			items-center
			gap-4
			justify-start
			self-center
		>
			<div @click="toggleDark()" cursor-pointer mb="0.125rem">
				<span
					text-xl
					text-warmgray-100
					i-material-symbols-dark-mode
					v-if="isDark"
				/>
				<span text-xl text-warmgray-700 i-material-symbols-light-mode v-else />
			</div>
			<el-popover placement="bottom" trigger="hover">
				<ul>
					<li>
						<el-button text w-full @click="$i18n.locale = 'en'"
							>English</el-button
						>
					</li>
					<li>
						<el-button text w-full @click="$i18n.locale = 'zh-Hans'"
							>中文</el-button
						>
					</li>
				</ul>
				<template #reference>
					<div i-mdi-spoken-language text-xl></div>
				</template>
			</el-popover>
			<el-popover placement="bottom" trigger="hover" v-if="userStore.user">
				<div>
					<el-button text w-full data-testid="app-header-logout" @click="logout"
						>Log out</el-button
					>
				</div>
				<template #reference>
					<div data-testid="app-header-username">
						{{ userStore.user.username }}
					</div>
				</template>
			</el-popover>
		</div>
	</div>
</template>
