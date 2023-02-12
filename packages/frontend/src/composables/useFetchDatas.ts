import { resolveMaybeRef } from './shared'
import type { MaybeRef } from '@vueuse/shared'
import { ref, type Ref } from 'vue'

export function useFetchDatas<T>(
	fetchFuncs: Function[],
	rawData?: MaybeRef<T>[]
) {
	const loading = ref(false)
	const error = ref(false)
	const data: Ref[] = []
	for (let i = 0; i < fetchFuncs.length; i++) {
		if (rawData) {
			data[i] = rawData[i] ? resolveMaybeRef(rawData) : ref()
		} else {
			data[i] = ref()
		}
	}

	loading.value = true
	Promise.all(fetchFuncs)
		.then((values: any) => {
			data.forEach((d, index) => d.value === values[index])
		})
		.catch(() => {
			error.value = true
		})
		.finally(() => {
			loading.value = false
		})

	return { loading, error, data }
}
