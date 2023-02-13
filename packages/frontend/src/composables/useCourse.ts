import { useUserStore } from '../store/user.store'
import { successMsg, errorMsg } from '@/utils/useMessage'
import type { Course, UpdateProgress, UpdateCourse } from 'shared'
import {
	update as rawUpdateCourse,
	del as rawDelCourse,
	create as rawCreateCourse
} from '@/database/course'
import { assign, entries } from 'lodash-es'
import type { MaybeRef } from '@vueuse/shared'
import { withDefaults, resolveMaybeRef, type Options } from './shared'

export async function createCourse(
	newItem: { name: string },
	options?: Options
) {
	const opts = withDefaults(options)
	try {
		const userStore = useUserStore()
		if (!userStore.user) throw new Error('Please login first.')

		const DEFAULT_COURSE = {
			owner: userStore.user._id,
			status: 0,
			archived: false,
			intervals: [1, 7, 14, 28]
		}
		const newCourse = assign({}, DEFAULT_COURSE, newItem)
		const course = await rawCreateCourse(newCourse)

		if (opts?.successMsg) {
			successMsg(`Creation succeeded.`)
		}

		return course
	} catch (err) {
		if (opts?.errorMsg) errorMsg(`Creation failed.`)
	}
}

export async function updateCourse(
	courseId: string,
	updateItem: UpdateCourse,
	options?: Options
) {
	const opts = withDefaults(options)
	try {
		const updatedItem = await rawUpdateCourse(courseId, updateItem)

		if (opts?.successMsg) {
			successMsg('Updation succeeded.')
		}

		return updatedItem
	} catch (err) {
		if (opts?.errorMsg) errorMsg('Updation failed.')
	}
}

export async function delCourse(courseId: string, options?: Options) {
	const opts = withDefaults(options)
	try {
		await rawDelCourse(courseId)

		if (opts?.successMsg) {
			successMsg('Deletion succeeded.')
		}
	} catch (err) {
		if (opts?.errorMsg) errorMsg('Deletion failed.')
	}
}

export function useCourse(rawItem: MaybeRef<Course>) {
	const item = resolveMaybeRef(rawItem)

	async function update(
		newItem: UpdateCourse | UpdateProgress,
		options?: Options
	) {
		const updatedItem = await updateCourse(item.value._id, newItem, options)

		if (updatedItem) {
			for (const [key, value] of entries(updatedItem)) {
				// @ts-expect-error
				item.value[key] = value
			}
		}
	}

	async function del(options?: Options) {
		delCourse(item.value._id, options)
	}

	return { item, update, del }
}
