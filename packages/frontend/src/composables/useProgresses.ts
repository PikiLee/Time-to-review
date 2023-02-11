import { useUserStore } from '../store/user.store'
import { successMsg, errorMsg } from '@/utils/useMessage'
import type { Progress, UpdateProgress, UpdateCourse } from 'shared'
import {
	update as rawUpdateProgress,
	del as rawDelProgress,
	create as rawCreateProgress
} from '@/database/progress'
import { assign } from 'lodash-es'
import { getStartOfDay } from '@/utils/progress.utils'
import type { MaybeRef } from '@vueuse/shared'
import { withDefaults, type Options, resolveMaybeRef } from './shared'
import type { SortableEvent } from 'sortablejs'
import { watch } from 'vue'
import { rawHandleSort } from './useSort'

export async function updateProgress(
	_id: string,
	updateItem: UpdateProgress,
	options?: Options
) {
	const opts = withDefaults(options)
	try {
		const updatedItem = await rawUpdateProgress(_id, updateItem)
		if (opts?.successMsg) {
			successMsg('Updation succeeded.')
		}

		return updatedItem
	} catch (err) {
		if (opts?.errorMsg) errorMsg('Updation failed.')
	}
}

export async function delProgress(_id: string, options?: Options) {
	const opts = withDefaults(options)
	try {
		await rawDelProgress(_id)

		if (opts?.successMsg) {
			successMsg('Deletion succeeded.')
		}
	} catch (err) {
		if (opts?.errorMsg) errorMsg('Deletion failed.')
	}
}

export async function createProgress(
	newItem: {
		name: string
		course: string
		order: number
	},
	options?: Options
) {
	const opts = withDefaults(options)
	try {
		const userStore = useUserStore()
		if (!userStore.user) throw new Error('Please login first.')

		const DEFAULT_PROGRESS = {
			owner: userStore.user._id,
			stage: 0,
			lastDate: getStartOfDay(Date.now())
		}
		const newProgress = assign({}, DEFAULT_PROGRESS, newItem)
		const progress = await rawCreateProgress(newProgress)

		if (opts?.successMsg) {
			successMsg(`Creation succeeded.`)
		}

		return progress
	} catch (err) {
		if (opts?.errorMsg) errorMsg(`Creation failed.`)
	}
}

export function useProgresses(rawItems: MaybeRef<Progress[]>) {
	const items = resolveMaybeRef(rawItems)

	watch(items, () => items.value.sort((a, b) => a.order - b.order), {
		deep: true
	})

	function find(_id: string) {
		return items.value.find((item) => item._id === _id)
	}

	async function update(
		_id: string,
		updateItem: UpdateCourse | UpdateProgress,
		options?: Options
	) {
		const res = await updateProgress(_id, updateItem, options)
		items.value = items.value.map((item) => {
			if (item._id === _id) {
				return res
			} else {
				return item
			}
		})
	}

	async function del(_id: string, options?: Options) {
		await delProgress(_id, options)

		const index = items.value.findIndex((el) => el._id === _id)
		items.value.splice(index, 1)
	}

	async function create(name: string, course: string, options?: Options) {
		const progress = await createProgress(
			{
				name,
				course,
				order:
					items.value.length === 0
						? 2000
						: items.value.slice(-1)[0].order + 50
			},
			options
		)
		items.value.push(progress)
	}

	function handleSort(evt: SortableEvent) {
		const updatedItems = rawHandleSort(items.value, evt)
		if (updatedItems)
			updatedItems.forEach((item) =>
				update(item._id, {
					order: item.order
				})
			)
	}

	return { items, create, update, del, find, handleSort }
}
