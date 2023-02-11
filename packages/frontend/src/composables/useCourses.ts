import type { MaybeRef } from '@vueuse/shared'
import { CourseStatus, type Course } from 'shared'
import { computed, ref } from 'vue'
import { useApi } from './useApi'

export function useCourses(rawItems: MaybeRef<Course[]>) {
	const items = ref(rawItems)

	const { create, update, del, find, handleSort } = useApi(items)

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

	async function toggleArchive(_id: string) {
		const item = find(_id)
		if (!item) throw Error('Not found.')

		let order = 2000
		if (item.archived) {
			if (item.status === CourseStatus['In Progress']) {
				if (itemsInprogress.value.items.length > 0)
					order = itemsInprogress.value.items.slice(-1)[0].order + 50
			} else {
				if (itemsDone.value.items.length > 0)
					order = itemsDone.value.items.slice(-1)[0].order + 50
			}
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
		toggleStatus,
		handleSort
	}
}
