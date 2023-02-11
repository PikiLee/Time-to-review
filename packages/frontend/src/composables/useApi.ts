import { useUserStore } from '../store/user.store'
import { successMsg, errorMsg } from '@/utils/useMessage'
import {
	type Course,
	type Progress,
	type UpdateProgress,
	type UpdateCourse,
	CourseStatus
} from 'shared'
import {
	update as updateCourse,
	del as delCourse,
	create as rawCreateCourse
} from '@/database/course'
import {
	update as updateProgress,
	del as delProgress,
	create as rawCreateProgress
} from '@/database/progress'
import { assign, entries } from 'lodash-es'
import { getStartOfDay } from '@/utils/progress.utils'
import type { MaybeRef } from '@vueuse/shared'
import { computed, ref } from 'vue'
import { createWithDefaults, resolveMaybeRef } from '@/utils/helper'

interface Options {
	successMsg?: boolean
	errorMsg?: boolean
}

const withDefaults = createWithDefaults({
	successMsg: false,
	errorMsg: true
})

export function useApi(rawItems: MaybeRef<Course[] | Progress[]>) {
	const items = resolveMaybeRef(rawItems)

	function find(_id: string) {
		// @ts-expect-error
		return items.value.find((item) => item._id === _id)
	}

	async function update(
		_id: string,
		newItem: UpdateCourse | UpdateProgress,
		options?: Options
	) {
		const opts = withDefaults(options)
		try {
			const item = find(_id)
			if (!item) throw Error('Not found.')
			let updatedItem
			if (item.type === 'course') {
				updatedItem = await updateCourse(item._id, newItem)
			} else {
				updatedItem = await updateProgress(item._id, newItem)
			}

			if (updatedItem) {
				for (const [key, value] of entries(updatedItem)) {
					item[key] = value
				}
			}
			if (opts?.successMsg) {
				successMsg('Updation succeeded.')
			}
		} catch (err) {
			if (opts?.errorMsg) errorMsg('Updation failed.')
		}
	}

	async function del(_id: string, options?: Options) {
		const opts = withDefaults(options)
		try {
			const item = find(_id)
			if (!item) throw Error('Not found.')
			if (item.type === 'course') {
				await delCourse(item._id)
			} else {
				await delProgress(item._id)
			}

			const index = items.value.findIndex((el) => el._id === item._id)
			items.value.splice(index, 1)
			if (opts?.successMsg) {
				successMsg('Deletion succeeded.')
			}
		} catch (err) {
			if (opts?.errorMsg) errorMsg('Deletion failed.')
		}
	}

	async function create(
		newItem:
			| {
					type: 'course'
					name: string
			  }
			| {
					type: 'progress'
					name: string
					course: string
			  },
		options?: Options
	) {
		const opts = withDefaults(options)
		try {
			const userStore = useUserStore()
			if (!userStore.user) throw new Error('Please login first.')

			if (newItem.type === 'course') {
				const DEFAULT_COURSE = {
					owner: userStore.user._id,
					status: 0,
					archived: false,
					intervals: [1, 7, 14, 28],
					order:
						items.value.length === 0
							? 2000
							: items.value[items.value.length - 1].order + 50
				}
				const newCourse = assign({}, DEFAULT_COURSE, {
					name: newItem.name
				})
				const course = await rawCreateCourse(newCourse)
				items.value.push(course)
			} else {
				const DEFAULT_PROGRESS = {
					owner: userStore.user._id,
					stage: 0,
					order:
						items.value.length === 0
							? 2000
							: items.value[items.value.length - 1].order + 50,
					lastDate: getStartOfDay(Date.now())
				}
				const newProgress = assign({}, DEFAULT_PROGRESS, {
					name: newItem.name,
					course: newItem.course
				})
				const progress = await rawCreateProgress(newProgress)
				items.value.push(progress)
			}

			if (opts?.successMsg) {
				successMsg(`Creation succeeded.`)
			}
		} catch (err) {
			if (opts?.errorMsg) errorMsg(`Creation failed.`)
		}
	}

	return { items, create, update, del, find }
}

export function useCourses(rawItems: MaybeRef<Course[]>) {
	const items = ref(rawItems)

	const itemsInprogress = computed(() => ({
		title: 'In Progress',
		items: items.value.filter(
			(item) =>
				item.status === CourseStatus['In Progress'] && !item.archived
		)
	}))

	const itemsDone = computed(() => ({
		title: 'Done',
		items: items.value.filter(
			(item) => item.status === CourseStatus['Done'] && !item.archived
		)
	}))

	const itemsArchived = computed(() => ({
		title: 'Archived',
		items: items.value.filter((item) => item.archived)
	}))

	const { create, update, del, find } = useApi(items)

	async function toggleArchive(_id: string) {
		const item = find(_id)
		if (!item) throw Error('Not found.')

		let order = 2000
		if (item.archived) {
			if (itemsInprogress.value.items.length > 0)
				order = itemsInprogress.value.items.slice(-1)[0].order + 50
		} else {
			if (itemsArchived.value.items.length > 0)
				order = itemsArchived.value.items.slice(-1)[0].order + 50
		}

		await update(item._id, {
			archived: !item.archived,
			order
		})
	}

	async function toggleStatus(_id: string) {
		const item = find(_id)
		if (!item) throw Error('Not found.')

		let order = 2000
		if (item.status === CourseStatus['In Progress']) {
			if (itemsDone.value.items.length > 0)
				order = itemsDone.value.items.slice(-1)[0].order + 50
		} else {
			if (itemsInprogress.value.items.length > 0)
				order = itemsInprogress.value.items.slice(-1)[0].order + 50
		}

		const newStatus =
			item.status === CourseStatus['In Progress']
				? CourseStatus.Done
				: CourseStatus['In Progress']
		await update(item._id, { status: newStatus, order })
	}

	return {
		itemsInprogress,
		itemsDone,
		itemsArchived,
		itemsCategoried: [itemsInprogress, itemsDone, itemsArchived],
		items,
		create,
		update,
		del,
		find,
		toggleArchive,
		toggleStatus
	}
}
