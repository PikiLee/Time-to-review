import { resolveMaybeRef } from './shared'
import type { MaybeRef } from '@vueuse/shared'
import { ref } from 'vue'

export function useFetchData<T>(fetchFunc: Function, rawData?: MaybeRef<T>) {
	const loading = ref(false)
	const error = ref(false)
	const data = rawData ? resolveMaybeRef(rawData) : ref<T>()

	function runFetchFunc() {
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
	}

	function rerun() {
		runFetchFunc()
	}

	rerun()

	return { loading, error, data, rerun }
}
