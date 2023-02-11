import AddButton from '@/components/AddButton.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import CreatorDialog from '@/components/CreatorDialog.vue'
import { course1WithProgresses, courses } from './dummyData'

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
	describe('Rendered', () => {
		test('Rendered when create course', () => {
			const wrapper = mount(AddButton, {
				props: {
					resource: { type: 'course', courses }
				},
				global: {
					mocks: {
						$t
					}
				},
				components: { CreatorDialog }
			})

			expect(wrapper.find(`[data-testid="add-button"]`).exists()).toBe(
				true
			)
		})

		test('Rendered when create progress', () => {
			const wrapper = mount(AddButton, {
				props: {
					resource: {
						type: 'progress',
						course: course1WithProgresses
					}
				},
				global: {
					mocks: {
						$t
					}
				},
				components: { CreatorDialog }
			})

			expect(wrapper.find(`[data-testid="add-button"]`).exists()).toBe(
				true
			)
		})
	})

	test('Go to course page if ok', async () => {
		const wrapper = mount(AddButton, {
			props: {
				resource: { type: 'course', courses }
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
