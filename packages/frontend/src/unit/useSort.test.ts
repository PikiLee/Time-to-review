import { calcOrder } from '@/composables/useSort'
import { describe, test, beforeEach, expect } from 'vitest'

interface Context {
	items: { order: number }[]
}

describe('useSort', () => {
	describe.each([
		{ oldIndex: 1, newIndex: 2 },
		{ oldIndex: 2, newIndex: 1 },
		{ oldIndex: 1, newIndex: 3 },
		{ oldIndex: 2, newIndex: 0 }
	])('move from $oldIndex to $newIndex ', ({ oldIndex, newIndex }) => {
		beforeEach<Context>((context) => {
			const items = [
				{
					order: 100
				},
				{
					order: 200
				},
				{
					order: 300
				},
				{
					order: 400
				}
			]
			context.items = items
		})

		test<Context>('', (context) => {
			const item = context.items[oldIndex]
			const updatedItems = calcOrder(oldIndex, newIndex, context.items)

			expect(updatedItems).toHaveLength(1)
			expect(item === context.items[newIndex]).toBe(true)
		})
	})

	describe.each([
		{ oldIndex: 2, newIndex: 3 },
		{ oldIndex: 3, newIndex: 2 },
		{ oldIndex: 2, newIndex: 5 },
		{ oldIndex: 3, newIndex: 0 }
	])(
		'move from $oldIndex to $newIndex when all orders is the same.',
		({ oldIndex, newIndex }) => {
			beforeEach<Context>((context) => {
				const items = [
					{
						order: 100
					},
					{
						order: 100
					},
					{
						order: 100
					},
					{
						order: 100
					},
					{
						order: 100
					},
					{
						order: 100
					}
				]
				context.items = items
			})

			test<Context>('', (context) => {
				const item = context.items[oldIndex]
				const updatedItems = calcOrder(
					oldIndex,
					newIndex,
					context.items
				)
				expect(item === context.items[newIndex]).toBe(true)
				if (newIndex > oldIndex) {
					expect(updatedItems).toHaveLength(
						context.items.length - newIndex
					)
				} else {
					expect(updatedItems).toHaveLength(newIndex + 1)
				}
			})
		}
	)
})
