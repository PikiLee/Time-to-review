import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useCustomRouter() {
	const route = useRoute()
	const isCoursePage = computed(() => {
		return route.name === 'course'
	})
	const id = computed(() =>
		typeof route.params.id === 'string'
			? route.params.id
			: route.params.id[0]
	)

	return { isCoursePage, id }
}
