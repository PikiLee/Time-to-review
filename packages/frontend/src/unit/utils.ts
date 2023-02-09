import type { VueWrapper } from '@vue/test-utils'

export function createGetter(nameSpace: string) {
	const prefix = 'data-test-unit'

	return {
		get<T extends VueWrapper<any>>(wrapper: T, selector: string) {
			return wrapper.get(`[${prefix}="${nameSpace}-${selector}"]`)
		},
		find<T extends VueWrapper<any>>(wrapper: T, selector: string) {
			return wrapper.find(`[${prefix}="${nameSpace}-${selector}"]`)
		}
	}
}
