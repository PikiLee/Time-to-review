import { generateAuthInfo, CourseStatus, NewProgress } from 'shared'
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	test
} from 'vitest'
import { createDb } from '../src/models/db'
import { User } from '../src/models/User'
import mongoose, { Types } from 'mongoose'
import { Course } from '../src/models/Course'
import { Progress, create, update, fetch, del } from '../src/models/Progress'
import { entries } from 'lodash-es'
// import { toObjectId } from '../src/utils/id'

import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { isIdEqual, toObjectId } from '../src/utils/id'

// This will create an new instance of "MongoMemoryReplSet" and automatically start all Servers
const replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } }) // This will create an ReplSet with 4 members
beforeAll(async () => {
	const uri = replset.getUri()
	await createDb(uri)
})

afterAll(() => {
	replset.stop()
})

interface Context {
	userId: Types.ObjectId
	parentId: Types.ObjectId
	samples: any[]
	newItem: NewProgress
}

function expectToMatchObject(
	target: Record<string, unknown>,
	expected: Record<string, unknown>
) {
	for (const [key, value] of entries(expected)) {
		expect(target).toHaveProperty(key, value)
	}
}

describe('Test progress', () => {
	beforeEach<Context>(async (context) => {
		// create user
		const { username, password } = generateAuthInfo()
		const user = new User({ username, password })
		await user.save()
		context.userId = user._id

		// create parent
		const newParent = new Course({
			name: 'new course',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 0
		})
		await newParent.save()

		context.parentId = newParent._id

		// NewProgress
		//  course: string;
		// owner: string;
		// name: string;
		// stage: number;
		// lastDate: string;
		context.newItem = {
			name: 'new progress',
			owner: context.userId.toJSON(),
			course: context.parentId.toJSON(),
			stage: 0,
			lastDate: new Date().toISOString()
		}

		const newItems = [
			{
				name: 'sample progress 0',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 0
			},
			{
				name: 'sample progress 1',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 1
			},
			{
				name: 'sample progress 2',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 2
			},
			{
				name: 'sample progress 3',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 3
			},
			{
				name: 'sample progress 4',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 4
			},
			{
				name: 'sample progress 5',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 5
			},
			{
				name: 'sample progress 6',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 6
			},
			{
				name: 'sample progress 7',
				owner: context.userId.toJSON(),
				course: context.parentId.toJSON(),
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 7
			}
		]

		const samples = []
		for (const item of newItems) {
			const sample = new Progress(item)
			await sample.save()
			samples.push(sample)
		}
		context.samples = samples
	})

	afterEach(async () => {
		await mongoose.connection.dropCollection('users')
		await mongoose.connection.dropCollection('courses')
		await mongoose.connection.dropCollection('progresses')
	})

	describe('fetch', () => {
		test<Context>('fetch', async (context) => {
			const course = (
				await fetch({ _id: toObjectId(context.samples[0]._id) })
			)[0]
			expect(course).toHaveProperty('name', context.samples[0].name)

			const courses = await fetch({ owner: context.userId })
			expect(courses[0]._id.toJSON()).toBe(
				context.samples[0]._id.toJSON()
			)
		})

		describe.each([[0], [1], [2], [3], [4], [5], [6], [7]])(
			'make sure the item %i is in the correct position',
			(a) => {
				test<Context>('fetch', async (context) => {
					const courses = await fetch({ owner: context.userId })
					expect(courses[a]._id.toJSON()).toBe(
						context.samples[a]._id.toJSON()
					)
				})
			}
		)

		test<Context>('Throw Error when fetch non-exist progress', async () => {
			expect(
				async () => await fetch({ _id: toObjectId('1'.repeat(24)) })
			).rejects.toThrowError()
		})

		test<Context>('Throw Error when owner id is not correct', async (context) => {
			expect(
				async () =>
					await fetch({
						_id: toObjectId(context.samples[0]._id),
						owner: toObjectId('1'.repeat(24))
					})
			).rejects.toThrowError()
		})
	})

	describe('create', () => {
		test<Context>('create progress', async (context) => {
			const item = await create(context.newItem)
			expect(item).toHaveProperty('name', context.newItem.name)
			const items = await fetch({ owner: context.userId })
			expect(isIdEqual(items[items.length - 1]._id, item._id)).toBe(true)
		})
		test<Context>('fail when currentUser is not the same as new progress owner', async (context) => {
			expect(
				async () =>
					await create(context.newItem, {
						currentUserId: toObjectId('1'.repeat(24))
					})
			).rejects.toThrowError()
		})
	})

	const updated = {
		name: 'updated',
		stage: 0
	}
	describe('update', () => {
		test<Context>('update order to larger number', async (context) => {
			const course = await update(context.samples[0]._id, {
				order: 4
			})
			const courses = await fetch({ owner: context.userId })
			expect(courses[4]._id.toJSON()).toBe(course._id.toJSON())
		})

		test<Context>('update order to little number', async (context) => {
			const course = await update(context.samples[4]._id, {
				order: 0
			})
			const courses = await fetch({ owner: context.userId })
			expect(courses[0]._id.toJSON()).toBe(course._id.toJSON())
		})

		test<Context>('update name', async (context) => {
			const course = await update(context.samples[4]._id, updated)
			expectToMatchObject(course, updated)
		})

		test<Context>('Throw error if  not exist', async () => {
			expect(
				async () => await update(toObjectId('1'.repeat(24)), updated)
			).rejects.toThrowError()
		})

		test<Context>('Throw error if currentUser is not the owner of the course', async (context) => {
			expect(
				async () =>
					await update(context.samples[4]._id, updated, {
						currentUserId: toObjectId('1'.repeat(24))
					})
			).rejects.toThrowError()
		})
	})

	describe('delete', () => {
		test<Context>('delete', async (context) => {
			await del(toObjectId(context.samples[1]._id))

			expect(
				async () =>
					await fetch({
						_id: toObjectId(context.samples[1]._id)
					})
			).rejects.toThrowError()
		})

		test<Context>('delete a non-exist', async () => {
			expect(
				async () => await del(toObjectId('1'.repeat(24)))
			).rejects.toThrowError()
		})
	})
})
