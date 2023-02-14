import type { SortableEvent } from 'sortablejs'

export function calcOrder<T extends { order: number }>(
	fromIndex: number,
	toIndex: number,
	items: T[]
) {
	if (fromIndex === toIndex) return

	items[fromIndex].order = items[toIndex].order
	if (fromIndex < toIndex) {
		for (let i = toIndex; i > fromIndex; i--) {
			items[i].order--
		}
	} else {
		for (let i = toIndex; i < fromIndex; i++) {
			items[i].order++
		}
	}

	items.sort((a, b) => a.order - b.order)
}

export async function handleSort<T extends { _id: string; order: number }>(
	list: T[],
	evt: SortableEvent,
	updateFunc: <P extends { order: number }>(
		_id: string,
		data: P
	) => Promise<any>
) {
	if (
		evt.oldDraggableIndex !== undefined &&
		evt.newDraggableIndex !== undefined &&
		list
	) {
		await updateFunc(list[evt.oldDraggableIndex]._id, {
			order: evt.newDraggableIndex
		})

		calcOrder(evt.oldDraggableIndex, evt.newDraggableIndex, list)
	}
}
