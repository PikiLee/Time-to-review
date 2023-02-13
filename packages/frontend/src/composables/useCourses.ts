import type { MaybeRef } from '@vueuse/shared'
import { CourseStatus, type Course, type UpdateCourse } from 'shared'
import type { SortableEvent } from 'sortablejs'
import { computed, ref, watch } from 'vue'
import type { Options } from './shared'
import { createCourse, delCourse, updateCourse } from './useCourse'
import { rawHandleSort } from './useSort'

export function useCourses(rawItems: MaybeRef<Course[]>) {
	const items = ref(rawItems)

	watch(items, () => items.value.sort((a, b) => a.order - b.order), {
		deep: true
	})

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

	function find(_id: string) {
		return items.value.find((item) => item._id === _id)
	}

	async function create(name: string, options?: Options) {
		const res = await createCourse(
			{
				name
			},
			options
		)
		items.value.push(res)
	}

	async function update(
		courseId: string,
		updateItem: UpdateCourse,
		options?: Options
	) {
		const res = await updateCourse(courseId, updateItem, options)
		if (res) {
			items.value = items.value.map((item) => {
				if (item._id === res._id) {
					return res
				} else {
					return item
				}
			})
		}
	}

	async function del(courseId: string, options?: Options) {
		await delCourse(courseId, options)
		items.value = items.value.filter((item) => item._id !== courseId)
	}

	async function toggleArchive(_id: string) {
		const item = find(_id)
		if (!item) throw Error('Not found.')

		const order = items.value.length

		await update(item._id, {
			archived: !item.archived,
			order
		})
	}

	async function toggleStatus(_id: string) {
		const item = find(_id)
		if (!item) throw Error('Not found.')

		const order = items.value.length

		const newStatus =
			item.status === CourseStatus['In Progress']
				? CourseStatus.Done
				: CourseStatus['In Progress']
		await update(item._id, { status: newStatus, order })
	}

	function handleSort(items: Course[], evt: SortableEvent) {
		const updatedItems = rawHandleSort(items, evt)
		if (updatedItems)
			updatedItems.forEach((item) =>
				update(item._id, {
					order: item.order
				})
			)
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
		toggleStatus,
		handleSort
	}
}
