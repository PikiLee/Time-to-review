export function findById<T extends { _id: string }>(list: T[], _id: string) {
	return list.find((item) => item._id === _id)
}

export function findByIdOrError<T extends { _id: string }>(
	list: T[],
	_id: string
) {
	const res = list.find((item) => item._id === _id)
	if (!res) throw Error('Not found')
	return res
}

export function findIndexById<T extends { _id: string }>(
	list: T[],
	_id: string
) {
	return list.findIndex((item) => item._id === _id)
}

export function findByIdAndDelete<T extends { _id: string }>(
	list: T[],
	_id: string
) {
	const index = list.findIndex((item) => item._id === _id)
	if (index === -1) throw Error('Progress Not Found')
	list.splice(index, 1)
}

export function findByIdAndDeleteAndCalcOrder<
	T extends { _id: string; order: number }
>(list: T[], _id: string) {
	const index = findIndexById(list, _id)
	for (let i = index; i < list.length; i++) {
		list[i].order--
	}
	findByIdAndDelete(list, _id)
}

export function findByIdAndUpdate<T extends { _id: string }>(
	list: T[],
	newItem: T
) {
	const index = list.findIndex((item) => item._id === newItem._id)
	if (index === -1) throw Error('Progress Not Found')
	list.splice(index, 1, newItem)
}
