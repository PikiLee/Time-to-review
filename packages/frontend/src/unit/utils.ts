import type { VueWrapper } from '@vue/test-utils'

const prefix = 'data-test-unit'
export function createUnitTestIdGetter(nameSpace: string) {
	return (element: string) => `${nameSpace}-${element}`
}

export function createGetter(nameSpace: string) {
	const getUnitTestId = createUnitTestIdGetter(nameSpace)
	return {
		get<T extends VueWrapper<any>>(wrapper: T, element: string) {
			return wrapper.get(`[${prefix}="${getUnitTestId(element)}"]`)
		},
		find<T extends VueWrapper<any>>(wrapper: T, element: string) {
			return wrapper.find(`[${prefix}="${getUnitTestId(element)}"]`)
		},
		findAll<T extends VueWrapper<any>>(wrapper: T, element: string) {
			return wrapper.findAll(`[${prefix}="${getUnitTestId(element)}"]`)
		}
	}
}
