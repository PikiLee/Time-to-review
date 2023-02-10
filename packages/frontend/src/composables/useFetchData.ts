import { ref } from 'vue'

export function useFetchData(fetchFunc: Function) {
	const loading = ref(false)
	const error = ref(false)
	const data = ref()

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
