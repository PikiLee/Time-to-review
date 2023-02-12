import AddButton from '@/components/AddButton.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import CreatorDialog from '@/components/CreatorDialog.vue'

const $t = () => ''

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

const push = vi.fn(() => {})
vi.mock('vue-router', () => {
	return {
		useRouter: vi.fn(() => {
			return {
				push
			}
		})
	}
})

describe.each([['course'], ['progress']])('When creating $s', (t) => {
	const type = t as 'course' | 'progress'

	test('Rendered', () => {
		const wrapper = mount(AddButton, {
			props: {
				type
			},
			global: {
				mocks: {
					$t
				}
			},
			components: { CreatorDialog }
		})

		expect(wrapper.find(`[data-testid="add-button"]`).exists()).toBe(true)
	})

	test(`Emit create:${type} if ok`, async () => {
		const wrapper = mount(AddButton, {
			props: {
				type
			},
			global: {
				mocks: {
					$t
				}
			},
			components: { CreatorDialog }
		})

		await wrapper.get(`[data-testid="add-button"]`).trigger('click')
		await wrapper.getComponent(CreatorDialog).vm.$emit(`create:${type}`)

		expect(wrapper.emitted()).toHaveProperty(`create:${type}`)
	})
})
