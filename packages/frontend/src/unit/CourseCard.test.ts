import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, vi, beforeEach, expect } from 'vitest'
import { toggleArchive, toggleStatus, del as rawDel } from '@/database/course'
import { successMsg } from '@/utils/useMessage'
import { createGetter } from './utils'
import type { Course } from 'shared'
import CourseCard from '@/components/Course/CourseCard.vue'

const NAME_SPACE = 'course-card'
const { get } = createGetter(NAME_SPACE)

vi.mock('@/database/course', () => {
	return {
		create: vi.fn(() => {}),
		toggleArchive: vi.fn(() => {}),
		toggleStatus: vi.fn(() => {}),
		del: vi.fn(() => {})
	}
})
const del = vi.fn(() => {})
vi.mock('@/store/course.store', () => {
	return {
		useCourseStore: () => ({
			del
		})
	}
})
vi.mock('@/utils/useMessage', () => {
	return {
		errorMsg: vi.fn(() => {}),
		successMsg: vi.fn(() => {})
	}
})

const course: Course = {
	_id: 'test',
	owner: 'test',
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

	test('Rendered', async () => {
		const $t = () => ''

		const wrapper = mount(CourseCard, {
			props: {
				course
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'wrapper')
		expect(await get(wrapper, 'badge').html()).contains(course.dueCount)
		await get(wrapper, 'archive')
		await get(wrapper, 'done')
	})

	test('Call toggleArchive(), successMsg when click archive button', async () => {
		const $t = () => ''

		const wrapper = mount(CourseCard, {
			props: {
				course
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'archive').trigger('click')
		await flushPromises()

		expect(toggleArchive).toHaveBeenCalledOnce()
		expect(successMsg).toHaveBeenCalledOnce()

		await get(wrapper, 'unarchive').trigger('click')
		await flushPromises()

		expect(toggleArchive).toHaveBeenCalledTimes(2)
		expect(successMsg).toHaveBeenCalledTimes(2)
	})

	test('Call toggleStatus(), successMsg when click done button', async () => {
		const $t = () => ''

		const wrapper = mount(CourseCard, {
			props: {
				course
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'done').trigger('click')
		await flushPromises()

		expect(toggleStatus).toHaveBeenCalledOnce()
		expect(successMsg).toHaveBeenCalledOnce()

		await get(wrapper, 'undone').trigger('click')
		await flushPromises()

		expect(toggleStatus).toHaveBeenCalledTimes(2)
		expect(successMsg).toHaveBeenCalledTimes(2)
	})

	test('Call del(), successMsg() when click delete button', async () => {
		const $t = () => ''

		const wrapper = mount(CourseCard, {
			props: {
				course
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'archive').trigger('click')
		await get(wrapper, 'delete').trigger('click')
		await flushPromises()
		expect(rawDel).toHaveBeenCalledOnce()
		expect(del).toHaveBeenCalledOnce()
		expect(successMsg).toHaveBeenCalledTimes(2)
	})
})
