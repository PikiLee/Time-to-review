import { useUserStore } from '@/store/user.store'
import { assign, keys } from 'lodash-es'
import {
	COURSE_URL,
	type NewCourse,
	type UpdateCourse,
	type Options,
	buildOptions,
	type Course
} from 'shared'
import { api } from './api'

// export function withCourseDefaults(name: string) {
// 	const userStore = useUserStore()
// 	if (!userStore.user) throw new Error('Please login first.')

// 	const DEFAULT_COURSE = {
// 		owner: userStore.user._id,
// 		status: 0,
// 		archived: false,
// 		intervals: [1, 7, 14, 28]
// 	}
// 	const newCourse = assign({}, DEFAULT_COURSE, { name })

// 	return newCourse
// }

export async function create(newCourse: NewCourse) {
	const res = await api.post(COURSE_URL, newCourse)
	return res.data
}

export async function update(courseId: string, updateCourse: UpdateCourse) {
	if (keys(updateCourse).length === 0) throw Error('Nothing need to updated.')

	const res = await api.put(`${COURSE_URL}/${courseId}`, updateCourse)
	return res.data
}

export async function del(_id: string) {
	return await api.delete(`${COURSE_URL}/${_id}`)
}

export async function fetch(courseId: string) {
	const res = await api.get(`${COURSE_URL}/${courseId}`)
	return res.data
}

export async function fetchAll(): Promise<Course[]> {
	const res = await api.get(`${COURSE_URL}`)
	return res.data
}

export async function fetchDue(): Promise<Course[]> {
	const res = await api.get(`${COURSE_URL}`, {
		params: {
			isDue: true
		}
	})
	return res.data
}
