import type { SortableEvent } from 'sortablejs'

export function calcOrder<T extends { order: number }>(
	fromIndex: number,
	toIndex: number,
	items: T[]
) {
	if (fromIndex === toIndex) return
	const DEFAULT_INTERVAL = 50

	const updatedItems = new Set<T>()

	if (fromIndex < toIndex) {
		if (toIndex === items.length - 1) {
			items[fromIndex].order = items[toIndex].order + 100
			updatedItems.add(items[fromIndex])
		} else {
			let notEuqalIndex
			// find the index of the item whose order is not equal than toIndex
			for (let i = toIndex + 1; i < items.length; i++) {
				if (items[i].order !== items[toIndex].order) {
					notEuqalIndex = i
					break
				}
			}

			if (!notEuqalIndex) {
				// the index is not found
				for (let i = toIndex + 1; i < items.length; i++) {
					items[i].order = items[i - 1].order + DEFAULT_INTERVAL
					updatedItems.add(items[i])
				}
			} else if (notEuqalIndex !== toIndex + 1) {
				// when the index is not toIndex
				for (let i = toIndex + 1; i < notEuqalIndex; i++) {
					const interval =
						(items[notEuqalIndex].order - items[toIndex].order) /
						(notEuqalIndex - toIndex + 1)
					items[i].order = items[i - 1].order + interval
					updatedItems.add(items[i])
				}
			}

			items[fromIndex].order =
				(items[toIndex].order + items[toIndex + 1].order) * 0.5
			updatedItems.add(items[fromIndex])
		}
	} else {
		if (toIndex === 0) {
			items[fromIndex].order = items[toIndex].order - 100
			updatedItems.add(items[fromIndex])
		} else {
			let notEuqalIndex
			// find the index of the item whose order is not equal than toIndex
			for (let i = toIndex - 1; i >= 0; i--) {
				if (items[i].order !== items[toIndex].order) {
					notEuqalIndex = i
					break
				}
			}

			if (notEuqalIndex === undefined) {
				// the index is not found
				for (let i = toIndex - 1; i >= 0; i--) {
					items[i].order = items[i + 1].order - DEFAULT_INTERVAL
					updatedItems.add(items[i])
				}
			} else if (notEuqalIndex !== toIndex - 1) {
				// when the index is not toIndex
				for (let i = toIndex - 1; i > notEuqalIndex; i--) {
					const interval =
						(items[toIndex].order - items[notEuqalIndex].order) /
						(toIndex - notEuqalIndex + 1)
					items[i].order = items[i + 1].order - interval
					updatedItems.add(items[i])
				}
			}

			items[fromIndex].order =
				(items[toIndex].order + items[toIndex - 1].order) * 0.5
			updatedItems.add(items[fromIndex])
		}
	}

	items.sort((a, b) => a.order - b.order)

	return Array.from(updatedItems)
}

export function handleSort<T extends { order: number }>(
	items: T[],
	evt: SortableEvent
) {
	if (
		evt.oldDraggableIndex !== undefined &&
		evt.newDraggableIndex !== undefined
	) {
		const updatedItems = calcOrder(
			evt.oldDraggableIndex,
			evt.newDraggableIndex,
			items
		)

		return updatedItems
	} else {
		return null
	}
}
