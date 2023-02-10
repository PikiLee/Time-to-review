import { keys } from 'lodash-es'
import {
	COURSE_URL,
	type NewCourse,
	type UpdateCourse,
	type Options,
	buildOptions
} from 'shared'
import { api } from './api'

export async function create(newCourse: NewCourse) {
	const res = await api.post(COURSE_URL, newCourse)
	return res.data
}

export async function update(
	courseId: string,
	updateCourse: UpdateCourse,
	options?: Options
) {
	if (keys(updateCourse).length === 0) return

	const { withProgresses, withDueProgresses } = buildOptions(options)

	const res = await api.put(`${COURSE_URL}/${courseId}`, updateCourse, {
		params: {
			withProgresses,
			withDueProgresses
		}
	})
	return res.data
}

export async function del(_id: string) {
	return await api.delete(`${COURSE_URL}/${_id}`)
}

export async function fetch(courseId: string, options?: Options) {
	const { withProgresses, withDueProgresses } = buildOptions(options)

	const res = await api.get(`${COURSE_URL}/${courseId}`, {
		params: {
			withProgresses,
			withDueProgresses
		}
	})
	return res.data
}

export async function fetchAll(options?: Options) {
	const { withProgresses, withDueProgresses } = buildOptions(options)

	const res = await api.get(`${COURSE_URL}/`, {
		params: {
			withProgresses,
			withDueProgresses
		}
	})
	return res.data
}
