import { useUserStore } from "./../store/user.store";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CoursesView from "../views/CoursesView.vue";
import CourseView from "../views/CourseView.vue";
import RegisterView from "../views/AuthView.vue";
import { errorMsg } from "@/utils/useMessage";
import { fetchDue } from "@/database/course";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/home",
			name: "home",
			component: HomeView,
			meta: { requiresAuth: true },
			beforeEnter() {
				return fetchDue();
			},
		},
		{
			path: "/courses",
			name: "courses",
			component: CoursesView,
			meta: { requiresAuth: true },
		},
		{
			path: "/course/:id",
			name: "course",
			component: CourseView,
			meta: { requiresAuth: true },
		},
		{
			path: "/auth",
			name: "auth",
			children: [
				{
					path: "register",
					name: "register",
					component: RegisterView,
				},
				{
					path: "login",
					name: "login",
					component: RegisterView,
				},
			],
		},
	],
});

router.beforeEach((to) => {
	const userStore = useUserStore();
	if (to.meta.requiresAuth && !userStore.isLogin) {
		errorMsg("Please login first.");
		return {
			name: "login",
		};
	}
	return true;
});

export default router;
