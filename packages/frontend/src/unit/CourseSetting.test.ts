import { mount } from '@vue/test-utils'
import { describe, test, vi, beforeEach } from 'vitest'
// import { create as createCourse } from '@/database/course'
// import { create as createProgress } from '@/database/progress'
// import { errorMsg, successMsg } from '@/utils/useMessage'
import CourseSetting from '@/components/Course/CourseSetting.vue'
import { createGetter } from './utils'
import type { Course } from 'shared'

const NAME_SPACE = 'course-setting'
const { get } = createGetter(NAME_SPACE)

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
	// can not test since dialog is teleport
	test.todo('Rendered', async () => {
		const $t = () => ''

		const wrapper = mount(CourseSetting, {
			props: {
				course,
				modelValue: true,
				'onUpdate:modelValue': (e: boolean) =>
					wrapper.setProps({ modelValue: e })
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'wrapper')
	})
})
