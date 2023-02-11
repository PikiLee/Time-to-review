import { mount } from '@vue/test-utils'
import { describe, test, vi, beforeEach, expect } from 'vitest'
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
			},
			stubs: { RouterLink: true }
		})

		await get(wrapper, 'wrapper')
		await get(wrapper, 'archive')
		await get(wrapper, 'done')
	})

	test.each([
		{ course, element: 'archive' },
		{ course: { ...course, archived: true }, element: 'unarchive' }
	])(
		'emit toggle:archive when click archive button',
		async ({ course, element }) => {
			const $t = () => ''

			const wrapper = mount(CourseCard, {
				props: {
					course
				},
				global: {
					mocks: {
						$t
					}
				},
				stubs: { RouterLink: true }
			})

			await get(wrapper, element).trigger('click')

			expect(wrapper.emitted()).toHaveProperty('toggle:archive')
		}
	)

	test.each([
		{ course, element: 'done' },
		{ course: { ...course, status: 1 }, element: 'undone' }
	])(
		'emit toggle:status when click done button',
		async ({ course, element }) => {
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

			await get(wrapper, element).trigger('click')

			expect(wrapper.emitted()).toHaveProperty('toggle:status')
		}
	)

	test('emit delete when click delete button', async () => {
		const $t = () => ''

		const wrapper = mount(CourseCard, {
			props: {
				course: { ...course, archived: true }
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'delete').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('delete')
	})
})
