import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, test, vi, beforeEach, expect } from 'vitest'
import { createGetter } from './utils'
import { course1 as course } from './dummyData'
import CourseCard from '@/components/Course/CourseCard.vue'

const NAME_SPACE = 'course-card'
const { get } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => 'i18n' }),
		createI18n: () => ({
			global: {
				locale: {
					value: 'en'
				}
			}
		})
	}
})

describe('Rendered', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test.each([
		{ course, element: 'archive' },
		{ course: { ...course, archived: true }, element: 'unarchive' }
	])(
		'emit toggle:archive when click archive button',
		async ({ course, element }) => {
			const $t = () => 'i18n'

			const wrapper = mount(CourseCard, {
				props: {
					course
				},
				global: {
					mocks: {
						$t
					},
					stubs: { RouterLink: RouterLinkStub }
				}
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
					},
					stubs: { RouterLink: RouterLinkStub }
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
				},
				stubs: { RouterLink: RouterLinkStub }
			}
		})

		await get(wrapper, 'delete').trigger('click')

		expect(wrapper.emitted()).toHaveProperty('delete')
	})
})
