import { defineStore } from "pinia";
import type { User } from "shared";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
	const user = ref<User | null>(null);

	const isLogin = computed(() => !!user.value);

	return { user, isLogin };
});
