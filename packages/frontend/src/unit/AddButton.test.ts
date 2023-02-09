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

describe('AddButton', () => {
	test('Rendered', () => {
		const wrapper = mount(AddButton, {
			props: {
				type: 'course'
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

	test('Go to course page if ok', async () => {
		const wrapper = mount(AddButton, {
			props: {
				type: 'course'
			},
			global: {
				mocks: {
					$t
				}
			},
			components: { CreatorDialog }
		})

		await wrapper.get(`[data-testid="add-button"]`).trigger('click')
		await wrapper.getComponent(CreatorDialog).vm.$emit('ok')

		expect(push).toHaveBeenCalledOnce()
		expect(push).toHaveBeenCalledWith({ name: 'course' })
	})
})
