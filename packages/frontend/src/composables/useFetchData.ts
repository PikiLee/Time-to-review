import type { MaybeRef } from '@vueuse/shared'
import { ref, type Ref } from 'vue'

export function useFetchData<T>(fetchFunc: Function, rawData?: Ref<T>) {
	const loading = ref(false)
	const error = ref(false)
	const data = ref(rawData)

	loading.value = true
	fetchFunc()
		.then((d: any) => {
			data.value = d
		})
		.catch(() => {
			error.value = true
		})
		.finally(() => {
			loading.value = false
		})

	return { loading, error, data }
}
