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
}
