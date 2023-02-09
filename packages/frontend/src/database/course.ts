import { keys } from 'lodash-es'
import { useCourseStore } from './../store/course.store'
import { useUserStore } from './../store/user.store'
import {
	CourseStatus,
	COURSE_URL,
	type NewCourse,
	type UpdateCourse
} from 'shared'
import { api } from './api'

export async function create(name: string) {
	if (!name) throw 'Must not empty!'
	const userStore = useUserStore()
	if (!userStore.user) throw 'Must login first!'
	const newCourse: NewCourse = {
		owner: userStore.user._id,
		name,
		order: 0
	}

	const res = await api.post(COURSE_URL, {
		data: newCourse
	})

	const courseStore = useCourseStore()
	courseStore.courses.push(res.data)
}
export async function update(
	courseId: string,
	updateCourse: UpdateCourse,
	options: {
		withProgresses: boolean
	} = { withProgresses: false }
) {
	if (keys(updateCourse).length === 0)
		throw new Error('Something went wrong! Please refresh!')

	const res = await api.put(`${COURSE_URL}/${courseId}`, updateCourse, {
		params: {
			withProgresses: options.withProgresses
		}
	})
	const courseStore = useCourseStore()

	courseStore.currentCourse = res.data

	return res.data
}

export async function toggleArchive(_id: string, archived: boolean) {
	return await update(_id, {
		archived
	})
}

export async function toggleStatus(_id: string, status: CourseStatus) {
	return await update(_id, {
		status
	})
}

export async function del(_id: string) {
	return await api.delete(`${COURSE_URL}/${_id}`)
}

export async function fetchDue() {
	const res = await api.get(`${COURSE_URL}/due`)

	const courseStore = useCourseStore()
	courseStore.dueCourses = res.data
}

export async function fetchWithProgresses(courseId: string) {
	const res = await api.get(`${COURSE_URL}/${courseId}`, {
		params: {
			withProgresses: true
		}
	})

	const courseStore = useCourseStore()
	courseStore.currentCourse = res.data
}

export async function fetchAll() {
	const res = await api.get(`${COURSE_URL}/`)

	const courseStore = useCourseStore()
	courseStore.courses = res.data
}
