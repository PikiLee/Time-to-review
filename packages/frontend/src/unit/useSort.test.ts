import { calcOrder } from '@/composables/useSort'
import { describe, test, beforeEach, expect } from 'vitest'

interface Context {
	items: { order: number }[]
}

describe.each([
	{ oldIndex: 1, newIndex: 2 },
	{ oldIndex: 2, newIndex: 1 },
	{ oldIndex: 1, newIndex: 3 },
	{ oldIndex: 2, newIndex: 0 }
])('move from $oldIndex to $newIndex ', ({ oldIndex, newIndex }) => {
	beforeEach<Context>((context) => {
		const items = [
			{
				order: 0
			},
			{
				order: 1
			},
			{
				order: 2
			},
			{
				order: 3
			},
			{
				order: 4
			}
		]
		context.items = items
	})

	test<Context>('', (context) => {
		const item = context.items[oldIndex]
		calcOrder(oldIndex, newIndex, context.items)

		expect(context.items[newIndex]).toBe(item)
	})
})
