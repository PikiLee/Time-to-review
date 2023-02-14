import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, vi, beforeEach, expect } from 'vitest'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import { createGetter } from './utils'
import type { Course } from 'shared'

const NAME_SPACE = 'course-setting'
const { get, findAll } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

const course: Course = {
	_id: 'test',
	owner: 'test',
	type: 'course',
	name: 'test',
	status: 0,
	archived: false,
	intervals: [1, 7, 14, 28],
	createdAt: '2022-1-1',
	updatedAt: '2022-1-1',
	dueCount: 1,
	isDue: true,
	order: 1,
	progressCount: 1
}

describe('Rendered', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test.each([
		['confirm', 'update'],
		['cancel', 'cancel']
	])('when click %s, emit %s', async (selector, event) => {
		const $t = () => ''

		const wrapper = mount(CourseSetting, {
			props: {
				course
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, selector).trigger('click')

		await flushPromises()
		expect(wrapper.emitted()).toHaveProperty(event)
	})

	test.each([
		[5, 'add-interval'],
		[4, 'remove-interval'],
		[3, 'remove-interval'],
		[4, 'add-interval']
	])('the number of intervals is %i when click %s', async (num, selector) => {
		const $t = () => ''

		const wrapper = mount(CourseSetting, {
			props: {
				course
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, selector).trigger('click')
		expect(await findAll(wrapper, 'interval-input')).toHaveLength(num)
	})
})
