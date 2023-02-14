import type { MaybeRef } from '@vueuse/shared'
import { assign } from 'lodash-es'
import { isRef, ref } from 'vue'

export type Nullable<T> = undefined | T

export function resolveMaybeRef<T>(r: MaybeRef<T>) {
	return isRef(r) ? r : ref(r)
}

export function resolveNullableMaybeRef<T>(r?: MaybeRef<T>) {
	return r === undefined ? ref<T>() : isRef(r) ? r : ref(r)
}

export function createWithDefaults<T>(defautls: T) {
	return (options?: Partial<T>) => {
		return assign({}, defautls, options)
	}
}

export interface Options {
	successMsg?: boolean
	errorMsg?: boolean
}

export const withDefaults = createWithDefaults({
	successMsg: false,
	errorMsg: true
})
