import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import CreatorDialog from '../components/CreatorDialog.vue'
import { create } from '@/composables/useApi'
import { errorMsg } from '@/utils/useMessage'
import { course1WithProgresses, courses } from './dummyData'

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

vi.mock('@/composables/useApi', () => {
	return {
		create: vi.fn(() => {})
	}
})
vi.mock('@/utils/useMessage', () => {
	return {
		errorMsg: vi.fn(() => {}),
		successMsg: vi.fn(() => {})
	}
})

describe('Rendered', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})
	describe('Rendered', () => {
		test('Rendered when creating course', () => {
			const $t = () => ''

			const wrapper = mount(CreatorDialog, {
				props: {
					resource: { type: 'course', courses }
				},
				global: {
					mocks: {
						$t
					}
				}
			})

			expect(
				wrapper.find(`[data-testid="creator-dialog"]`).exists()
			).toBe(true)
		})

		test('Rendered when creating progress', () => {
			const $t = () => ''

			const wrapper = mount(CreatorDialog, {
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
				}
			})

			expect(
				wrapper.find(`[data-testid="creator-dialog"]`).exists()
			).toBe(true)
		})
	})

	test('Call create() when type is course and press button.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				resource: { type: 'course', courses }
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

		expect(create).toHaveBeenCalledOnce()
	})

	test('Call create() when type is course and press button.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
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
			}
		})

		await wrapper
			.get(`[data-testid="creator-dialog-input"]`)
			.setValue('good')
		await wrapper
			.get(`[data-testid="creator-dialog-button"]`)
			.trigger('click')

		expect(create).toHaveBeenCalledOnce()
	})

	test('Emit ok when press button.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				resource: { type: 'course', courses }
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

		expect(wrapper.emitted()).toHaveProperty('ok')
	})

	test('Call errorMsg() when input is empty.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				resource: { type: 'course', courses }
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await wrapper.get(`[data-testid="creator-dialog-input"]`).setValue('')
		await wrapper
			.get(`[data-testid="creator-dialog-button"]`)
			.trigger('click')

		expect(errorMsg).toHaveBeenCalledOnce()
	})
})
