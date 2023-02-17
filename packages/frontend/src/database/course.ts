import { keys } from 'lodash-es'
import type { NewCourse, UpdateCourse } from 'shared'
import { api } from './api'

export async function create(newCourse: NewCourse) {
	return await api.createCourse(newCourse)
}

export async function update(courseId: string, updateCourse: UpdateCourse) {
	if (keys(updateCourse).length === 0) throw Error('Nothing need to updated.')

	const res = await api.updateCourse(updateCourse, {
		params: {
			courseId
		}
	})
	return res
}

export async function del(courseId: string) {
	return await api.deleteCourse(undefined, {
		params: {
			courseId
		}
	})
}

export async function fetch(courseId: string) {
	return await api.getCourse({
		params: {
			courseId
		}
	})
}

export async function fetchAll() {
	return await api.getAllCourses()
}

export async function fetchDue() {
	return await api.getAllCourses({
		queries: {
			isDue: true
		}
	})
}

export async function search(phrase: string) {
	return await api.getAllCourses({
		queries: {
			search: phrase
		}
	})
}
