import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CoursesView from '../views/CoursesView.vue'
import CourseView from '../views/CourseView.vue'
import RegisterView from '../views/AuthView.vue'
import { errorMsg } from '@/utils/useMessage'
import { fetchAll } from '@/database/course'
import { useUserStore } from '@/store/user.store'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/home',
			name: 'home',
			component: HomeView,
			meta: { requiresAuth: true }
		},
		{
			path: '/courses',
			name: 'courses',
			component: CoursesView,
			meta: { requiresAuth: true },
			async beforeEnter() {
				await fetchAll()
			}
		},
		{
			path: '/course/:id',
			name: 'course',
			component: CourseView,
			meta: { requiresAuth: true }
		},
		{
			path: '/auth',
			name: 'auth',
			children: [
				{
					path: 'register',
					name: 'register',
					component: RegisterView
				},
				{
					path: 'login',
					name: 'login',
					component: RegisterView
				}
			]
		},
		{
			path: '/:catchAll(.*)',
			name: '404',
			component: NotFound
		}
	]
})

router.beforeEach((to) => {
	const userStore = useUserStore()
	if (to.meta.requiresAuth && !userStore.isLogin) {
		errorMsg('Please login first.')
		return {
			name: 'login'
		}
	}
	return true
})
export default router
