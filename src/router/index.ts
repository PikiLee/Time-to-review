import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CoursesView from "../views/CoursesView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/courses",
      name: "courses",
      component: CoursesView,
    },
  ],
});

export default router;
