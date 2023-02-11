import { flushPromises, mount } from '@vue/test-utils'
import { describe, test, vi, beforeEach, expect } from 'vitest'
import { update, del } from '@/composables/useApi'
import { createGetter } from './utils'
import { course1 as course } from './dummyData'
import CourseCard from '@/components/Course/CourseCard.vue'

const NAME_SPACE = 'course-card'
const { get } = createGetter(NAME_SPACE)

vi.mock('@/composables/useApi', () => {
	return {
		update: vi.fn(() => {}),
		del: vi.fn(() => {})
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

	test('Call udpate when click archive button', async () => {
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

		expect(update).toHaveBeenCalledOnce()

		await get(wrapper, 'unarchive').trigger('click')
		await flushPromises()

		expect(update).toHaveBeenCalledTimes(2)
	})

	test('Call udpate when click done button', async () => {
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

		expect(update).toHaveBeenCalledOnce()

		await get(wrapper, 'undone').trigger('click')
		await flushPromises()

		expect(update).toHaveBeenCalledTimes(2)
	})

	test('Call del() when click delete button', async () => {
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
		expect(del).toHaveBeenCalledOnce()
	})
})
