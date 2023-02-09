import type { VueWrapper } from '@vue/test-utils'

const prefix = 'data-test-unit='

export function get<T extends VueWrapper<any>>(wrapper: T, selector: string) {
	return wrapper.get(`[${prefix}"${selector}"]`)
}

export function find<T extends VueWrapper<any>>(wrapper: T, selector: string) {
	return wrapper.find(`[${prefix}"${selector}"]`)
}
