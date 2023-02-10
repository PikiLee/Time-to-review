import type { SortableEvent } from 'sortablejs'

function calcOrder<T extends { order: number }>(
	fromIndex: number,
	toIndex: number,
	items: T[]
) {
	if (fromIndex === toIndex) return

	if (fromIndex < toIndex) {
		if (toIndex === items.length - 1) {
			items[fromIndex].order = items[toIndex].order + 100
		} else {
			items[fromIndex].order =
				(items[toIndex].order + items[toIndex + 1].order) * 0.5
		}
	} else {
		if (toIndex === 0) {
			items[fromIndex].order = items[toIndex].order - 100
		} else {
			items[fromIndex].order =
				(items[toIndex].order + items[toIndex - 1].order) * 0.5
		}
	}

	const res = items[fromIndex]

	items.sort((a, b) => a.order - b.order)

	return res
}

export function handleSort<T extends { order: number }>(
	items: T[],
	evt: SortableEvent
) {
	if (
		evt.oldDraggableIndex !== undefined &&
		evt.newDraggableIndex !== undefined
	) {
		const item = calcOrder(
			evt.oldDraggableIndex,
			evt.newDraggableIndex,
			items
		)

		return item
	} else {
		return null
	}
}
