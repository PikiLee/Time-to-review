import { defineStore } from "pinia";
import type { User } from "shared";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
	const user = ref<User | null>(null);

	return { user };
});
