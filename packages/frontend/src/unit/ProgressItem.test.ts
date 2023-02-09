import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { update, del } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'
import ProgressForm from '@/components/Progress/ProgressForm.vue'
import { createGetter } from './utils'
import ProgressItem from '@/components/Progress/ProgressItem.vue'

const NAME_SPACE = 'progress-item'
const { get, find } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
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
	createdAt: '2022-1-1',
	updatedAt: '2022-1-1',
	order: 0,
	nextDate: '2022-1-2',
	isDue: true
}

const intervals = [1, 7, 14, 28]

describe(NAME_SPACE, () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test('Rendered', async () => {
		const wrapper = mount(ProgressItem, {
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

	test('call update() if press next stage button', async () => {
		const wrapper = mount(ProgressItem, {
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

		await get(wrapper, 'next-stage').trigger('click')

		await flushPromises()
		expect(update).toHaveBeenCalledOnce()
		expect(successMsg).toHaveBeenCalledOnce()
	})

	test('show dialog if press edit button', async () => {
		const wrapper = mount(ProgressItem, {
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

		await get(wrapper, 'edit').trigger('click')

		await get(wrapper, 'dialog')
	})
})
