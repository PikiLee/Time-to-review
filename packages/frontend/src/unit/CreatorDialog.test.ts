import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import CreatorDialog from '../components/CreatorDialog.vue'

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

describe.each([['course'], ['progress']])('Rendered', (t) => {
	const type = t as 'course' | 'progress'
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test(`Rendered when creating ${type}`, () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		expect(wrapper.find(`[data-testid="creator-dialog"]`).exists()).toBe(
			true
		)
	})

	test(`Emit create:${type} when type is ${type} and press button.`, async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await wrapper
			.get(`[data-testid="creator-dialog-input"]`)
			.setValue('good')
		await wrapper
			.get(`[data-testid="creator-dialog-button"]`)
			.trigger('click')

		expect(wrapper.emitted()).toHaveProperty(`create:${type}`)
	})
})
