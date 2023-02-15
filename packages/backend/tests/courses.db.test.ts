import { NewCourse } from 'shared'
import * as dotenv from 'dotenv'
dotenv.config()

import { generateAuthInfo, CourseStatus } from 'shared'
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
import { Course, create, del, fetch, update } from '../src/models/Course'
import { entries } from 'lodash-es'
import { toObjectId } from '../src/utils/id'
import { MongoMemoryReplSet } from 'mongodb-memory-server-core'

const replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } }) // This will create an ReplSet with 4 members
beforeAll(async () => {
	// This will create an new instance of "MongoMemoryReplSet" and automatically start all Servers

	const uri = replset.getUri()
	await createDb(uri)
})

afterAll(() => {
	replset.stop()
})

interface Context {
	userId: Types.ObjectId
	sampleCourses: any[]
	newCourse: NewCourse
}

function expectToMatchObject(
	target: Record<string, unknown>,
	expected: Record<string, unknown>
) {
	for (const [key, value] of entries(expected)) {
		expect(target).toHaveProperty(key, value)
	}
}

beforeEach<Context>(async (context) => {
	const { username, password } = generateAuthInfo()
	const user = new User({ username, password })
	await user.save()
	context.userId = user._id

	context.newCourse = {
		name: 'new course',
		owner: context.userId.toJSON(),
		status: CourseStatus['In Progress'],
		archived: false
	}

	const newCourses = [
		{
			name: 'sample course 0',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 0
		},
		{
			name: 'sample course 1',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 1
		},
		{
			name: 'sample course 2',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,

			order: 2
		},
		{
			name: 'sample course 3',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 3
		},
		{
			name: 'sample course 4',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 4
		},
		{
			name: 'sample course 5',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 5
		},
		{
			name: 'sample course 6',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 6
		},
		{
			name: 'sample course 7',
			owner: context.userId.toJSON(),
			status: CourseStatus['In Progress'],
			archived: false,
			order: 7
		}
	]

	const sampleCourses = []
	for (const course of newCourses) {
		const item = new Course(course)
		await item.save()
		sampleCourses.push(item)
	}
	context.sampleCourses = sampleCourses
})

afterEach(async () => {
	await mongoose.connection.dropCollection('users')
	await mongoose.connection.dropCollection('courses')
})

describe('fetch', () => {
	test<Context>('fetch', async (context) => {
		const course = (
			await fetch({ _id: toObjectId(context.sampleCourses[0]._id) })
		)[0]
		expect(course).toHaveProperty('name', context.sampleCourses[0].name)
	})

	describe.each([[0], [1], [2], [3], [4], [5], [6], [7]])(
		'make sure the item %i is in the correct position',
		(a) => {
			test<Context>('fetch', async (context) => {
				const courses = await fetch({ owner: context.userId })
				expect(courses[a]._id.toJSON()).toBe(
					context.sampleCourses[a]._id.toJSON()
				)
			})
		}
	)

	test<Context>('Throw Error when fetch non-exist course', async () => {
		expect(
			async () => await fetch({ _id: toObjectId('1'.repeat(24)) })
		).rejects.toThrowError()
	})

	test<Context>('Throw Error when owner id is not correct', async (context) => {
		expect(
			async () =>
				await fetch({
					_id: toObjectId(context.sampleCourses[0]._id),
					owner: toObjectId('1'.repeat(24))
				})
		).rejects.toThrowError()
	})
})

describe('create', () => {
	test<Context>('create course', async (context) => {
		const course = await create(context.newCourse)
		expect(course).toHaveProperty('name', context.newCourse.name)

		const courses = await Course.find({ owner: context.userId })
		expect(courses[courses.length - 1]._id.toJSON()).toBe(
			course._id.toJSON()
		)
	})

	test<Context>('fail when currentUser is not the same as new course owner', async (context) => {
		expect(
			async () =>
				await create(context.newCourse, {
					currentUserId: toObjectId('1'.repeat(24))
				})
		).rejects.toThrowError()
	})
})

describe('update', () => {
	test<Context>('update order to larger number', async (context) => {
		const course = await update(context.sampleCourses[0]._id, {
			order: 4
		})
		const courses = await fetch({ owner: context.userId })
		expect(courses[4]._id.toJSON()).toBe(course._id.toJSON())
	})

	test<Context>('update order to little number', async (context) => {
		const course = await update(context.sampleCourses[4]._id, {
			order: 0
		})
		const courses = await fetch({ owner: context.userId })
		expect(courses[0]._id.toJSON()).toBe(course._id.toJSON())
	})

	test<Context>('update name', async (context) => {
		const updated = {
			name: 'updated',
			status: CourseStatus['Done'],
			archived: true
		}
		const course = await update(context.sampleCourses[4]._id, updated)
		expectToMatchObject(course, updated)
	})

	test<Context>('Throw error if course not exist', async () => {
		const updated = {
			name: 'updated',
			status: CourseStatus['Done'],
			archived: true
		}

		expect(
			async () => await update(toObjectId('1'.repeat(24)), updated)
		).rejects.toThrowError()
	})

	test<Context>('Throw error if currentUser is not the owner of the course', async (context) => {
		const updated = {
			name: 'updated',
			status: CourseStatus['Done'],
			archived: true
		}

		expect(
			async () =>
				await update(context.sampleCourses[4]._id, updated, {
					currentUserId: toObjectId('1'.repeat(24))
				})
		).rejects.toThrowError()
	})
})

test<Context>('delete a course', async (context) => {
	await del(context.sampleCourses[2]._id)

	expect(
		async () =>
			await fetch({
				_id: toObjectId(context.sampleCourses[2]._id)
			})
	).rejects.toThrowError()
})

test<Context>('delete a non-exist course', async () => {
	expect(
		async () => await del(toObjectId('1'.repeat(24)))
	).rejects.toThrowError()
})
