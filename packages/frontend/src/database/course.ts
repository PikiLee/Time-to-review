import lodash from 'lodash-es'
import { useUserStore } from './../store/user.store'
import {
	COURSE_URL,
	type NewCourse,
	type UpdateCourse,
	type Options,
	buildOptions
} from 'shared'
import { api } from './api'

export async function create(newCourse: string | NewCourse) {
	if (typeof newCourse === 'string') {
		const userStore = useUserStore()
		if (!userStore.user) throw 'Must login first!'
		newCourse = {
			owner: userStore.user._id,
			name: newCourse,
			order: 0
		}

		if (!newCourse.name) throw 'Must not empty!'

		return await api.post(COURSE_URL, newCourse)
	}
}

export async function update(
	courseId: string,
	updateCourse: UpdateCourse,
	options?: Options
) {
	if (lodash.keys(updateCourse).length === 0) return

	const { withProgresses, withDueProgresses } = buildOptions(options)

	return await api.put(`${COURSE_URL}/${courseId}`, updateCourse, {
		params: {
			withProgresses,
			withDueProgresses
		}
	})
}

export async function del(_id: string) {
	return await api.delete(`${COURSE_URL}/${_id}`)
}

export async function fetch(courseId: string, options?: Options) {
	const { withProgresses, withDueProgresses } = buildOptions(options)

	return await api.get(`${COURSE_URL}/${courseId}`, {
		params: {
			withProgresses,
			withDueProgresses
		}
	})
}

export async function fetchAll(options?: Options) {
	const { withProgresses, withDueProgresses } = buildOptions(options)

	return await api.get(`${COURSE_URL}/`, {
		params: {
			withProgresses,
			withDueProgresses
		}
	})
}
