import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import CreatorDialog from '../components/CreatorDialog.vue'
import { create as createCourse } from '@/database/course'
import { create as createProgress } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

vi.mock('@/database/course', () => {
	return {
		create: vi.fn(() => {})
	}
})
vi.mock('@/database/progress', () => {
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
	test('Rendered', () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type: 'course'
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		wrapper.find(`[data-testid="creator-dialog"]`).exists()
	})

	test('Call createCourse() when type is course and press button.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type: 'course'
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

		expect(createCourse).toHaveBeenCalledOnce()
	})

	test('Call createCourse() when type is course and press button.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type: 'progress'
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

		expect(createProgress).toHaveBeenCalledOnce()
	})

	test('Emit ok when press button.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type: 'course'
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

	test('Call successMsg() when succeed.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type: 'progress'
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

		expect(successMsg).toHaveBeenCalledOnce()
	})

	test('Call errorMsg() when input is empty.', async () => {
		const $t = () => ''

		const wrapper = mount(CreatorDialog, {
			props: {
				type: 'progress'
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
