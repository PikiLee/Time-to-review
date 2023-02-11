import { useUserStore } from '../store/user.store'
import { successMsg, errorMsg } from '@/utils/useMessage'
import type { Course, Progress, UpdateProgress, UpdateCourse } from 'shared'
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

interface Options {
	successMsg?: boolean
	errorMsg?: boolean
}

function createWithDefaults<T>(defautls: T) {
	return (options?: Partial<T>) => {
		return assign({}, defautls, options)
	}
}

const withDefaults = createWithDefaults({
	successMsg: false,
	errorMsg: true
})

export async function update(
	item: Course | Progress,
	newItem: UpdateCourse | UpdateProgress,
	options?: Options
) {
	const opts = withDefaults(options)
	try {
		let updatedItem
		if (item.type === 'course') {
			updatedItem = await updateCourse(item._id, newItem)
		} else {
			updatedItem = await updateProgress(item._id, newItem)
		}

		if (updatedItem) {
			for (const [key, value] of entries(updatedItem)) {
				// @ts-expect-error
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

export async function del(item: Course | Progress, options?: Options) {
	const opts = withDefaults(options)
	try {
		if (item.type === 'course') {
			await delCourse(item._id)
		} else {
			await delProgress(item._id)
		}
		if (opts?.successMsg) {
			successMsg('Deletion succeeded.')
		}
	} catch (err) {
		if (opts?.errorMsg) errorMsg('Deletion failed.')
	}
}

export async function create(
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
	items: Course[] | Progress[],
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
					items.length === 0
						? 2000
						: items[items.length - 1].order + 50
			}
			const newCourse = assign({}, DEFAULT_COURSE, {
				name: newItem.name
			})
			const course = await rawCreateCourse(newCourse)
			items.push(course)
		} else {
			const DEFAULT_PROGRESS = {
				owner: userStore.user._id,
				stage: 0,
				order:
					items.length === 0
						? 2000
						: items[items.length - 1].order + 50,
				lastDate: getStartOfDay(Date.now())
			}
			const newProgress = assign({}, DEFAULT_PROGRESS, {
				name: newItem.name,
				course: newItem.course
			})
			const progress = await rawCreateProgress(newProgress)
			items.push(progress)
		}

		if (opts?.successMsg) {
			successMsg(`Creation succeeded.`)
		}
	} catch (err) {
		if (opts?.errorMsg) errorMsg(`Creation failed.`)
	}
}
