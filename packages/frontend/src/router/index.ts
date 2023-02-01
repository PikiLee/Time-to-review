import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CoursesView from "../views/CoursesView.vue";
import CourseView from "../views/CourseView.vue";
import RegisterView from "../views/AuthView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/home",
			name: "home",
			component: HomeView,
		},
		{
			path: "/courses",
			name: "courses",
			component: CoursesView,
		},
		{
			path: "/course/:id",
			name: "course",
			component: CourseView,
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

export default router;
