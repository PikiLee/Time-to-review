import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { update, del } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'
import ProgressForm from '@/components/Progress/ProgressForm.vue'
import { createGetter } from './utils'

const NAME_SPACE = 'progress-form'
const { get, find } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

vi.mock('@/database/progress', () => {
	return {
		update: vi.fn(async () => 'hello'),
		del: vi.fn(async () => {})
	}
})
vi.mock('@/utils/useMessage', () => {
	return {
		errorMsg: vi.fn(() => {}),
		successMsg: vi.fn(() => {})
	}
})

const $t = () => {}

const progress = {
	_id: 'test',
	course: 'test',
	owner: 'test',
	name: 'test',
	stage: 0,
	lastDate: '2022-1-2',
	createdAt: 'test',
	updatedAt: 'test',
	order: 0,
	nextDate: 'test',
	isDue: true
}

const intervals = [1, 7, 14, 28]

describe('ProgressForm', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test('Rendered', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		expect(await find(wrapper, 'wrapper').exists()).toBe(true)
	})

	test('call update(), successMsg(), emit "ok" if update', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'input').setValue('good')
		await get(wrapper, 'confirm').trigger('click')

		await flushPromises()
		expect(update).toHaveBeenCalledOnce()
		expect(successMsg).toHaveBeenCalledOnce()
		expect(wrapper.emitted()).toHaveProperty('ok')
	})

	test('call errorMsg() when input is empty', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'input').setValue('')
		await get(wrapper, 'confirm').trigger('click')

		await flushPromises()
		expect(errorMsg).toHaveBeenCalledOnce()
	})

	test('call del() when delete', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'delete').trigger('click')

		await flushPromises()
		expect(del).toHaveBeenCalledOnce()
	})
})