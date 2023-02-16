import { CourseStatus, NewProgress } from 'shared'
import { expect, test, afterAll, beforeEach, afterEach, describe } from 'vitest'
import { createApp } from '../src/app'
import request from 'supertest'
import { AUTH_URL, COURSE_URL, generateAuthInfo, NewCourse } from 'shared'

import { MongoMemoryReplSet } from 'mongodb-memory-server-core'
import mongoose, { Types } from 'mongoose'
import { Course } from '../src/models/Course'
import { Progress } from '../src/models/Progress'

const replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } }) // This will create an ReplSet with 4 members
const app = await createApp({ port: 3004 })
const client = request.agent(app)

afterAll(() => {
	replset.stop()
})

interface Context {
	userId: Types.ObjectId
	sampleCourses: any[]
	newCourse: NewCourse
	parentId: Types.ObjectId
	newProgress: NewProgress
	sampleProgresses: any[]
}

describe('coures', () => {
	beforeEach<Context>(async (context) => {
		const { username, password } = generateAuthInfo()
		// const user = new User({ username, password })
		// await user.save()
		// login
		const res = await client.post(`${AUTH_URL}/register`).send({
			username,
			password
		})
		console.log({ body: res.body })
		context.userId = res.body._id
		expect(res.status).toBe(200)

		context.newCourse = {
			name: 'new course'
		}

		const newCourses = [
			{
				name: 'sample course 0',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 0
			},
			{
				name: 'sample course 1',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 1
			},
			{
				name: 'sample course 2',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,

				order: 2
			},
			{
				name: 'sample course 3',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 3
			},
			{
				name: 'sample course 4',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 4
			},
			{
				name: 'sample course 5',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 5
			},
			{
				name: 'sample course 6',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 6
			},
			{
				name: 'sample course 7',
				owner: context.userId,
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

	test<Context>('create', async (context) => {
		const res = await client.post(`${COURSE_URL}`).send(context.newCourse)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(context.newCourse)
		expect(await Course.findById(res.body._id)).toBeTruthy()
	})

	test<Context>('create with no valid name', async () => {
		const res = await client.post(`${COURSE_URL}`).send({})

		console.log({ body: res.body })
		expect(res.status).toBe(400)
	})

	test<Context>('udpate', async (context) => {
		const udpateCourse = {
			name: 'update',
			order: 1
		}
		const res = await client
			.put(`${COURSE_URL}/${context.sampleCourses[0]._id}`)
			.send(udpateCourse)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(udpateCourse)
	})

	test<Context>('udpate with invalid content', async (context) => {
		const res = await client
			.put(`${COURSE_URL}/${context.sampleCourses[0]._id}`)
			.send({ status: 'good' })
		console.log({ body: res.body.error })
		expect(res.status).toBe(400)
	})

	test<Context>('get', async (context) => {
		const res = await client.get(
			`${COURSE_URL}/${context.sampleCourses[2]._id}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(res.body.name).toBe(context.sampleCourses[2].name)
	})

	test<Context>('get all', async (context) => {
		const res = await client.get(`${COURSE_URL}`)

		console.log({ body: res.body })
		expect(res.status).toBe(200)

		for (let i = 0; i < context.sampleCourses.length; i++) {
			expect(res.body[i].name).toBe(context.sampleCourses[i].name)
		}
	})

	test<Context>('delete', async (context) => {
		const res = await client.delete(
			`${COURSE_URL}/${context.sampleCourses[2]._id}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(await Course.findById(context.sampleCourses[2]._id)).toBeNull()
	})

	test<Context>('get non-exist course', async () => {
		const res = await client.get(`${COURSE_URL}/${'1'.repeat(24)}`)

		console.log({ body: res.body })
		expect(res.status).toBe(404)
	})

	test<Context>('update non-exist course', async () => {
		const res = await client.put(`${COURSE_URL}/${'1'.repeat(24)}`)

		console.log({ body: res.body })
		expect(res.status).toBe(404)
	})

	test<Context>('delete non-exist course', async () => {
		const res = await client.delete(`${COURSE_URL}/${'1'.repeat(24)}`)

		console.log({ body: res.body })
		expect(res.status).toBe(404)
	})
})

describe('progress', () => {
	beforeEach<Context>(async (context) => {
		const { username, password } = generateAuthInfo()
		// const user = new User({ username, password })
		// await user.save()
		// login
		const res = await client.post(`${AUTH_URL}/register`).send({
			username,
			password
		})
		console.log({ body: res.body })
		context.userId = res.body._id
		expect(res.status).toBe(200)

		const newCourse = new Course({
			name: 'new course',
			owner: context.userId,
			status: CourseStatus['In Progress'],
			archived: false,
			intervals: [1, 7, 14, 28],
			order: 0
		})
		await newCourse.save()

		context.parentId = newCourse._id

		context.newProgress = {
			name: 'new progress',
			lastDate: new Date().toISOString()
		}

		const newItems = [
			{
				name: 'sample progress 0',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 0
			},
			{
				name: 'sample progress 1',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 1
			},
			{
				name: 'sample progress 2',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 2
			},
			{
				name: 'sample progress 3',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 3
			},
			{
				name: 'sample progress 4',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 4
			},
			{
				name: 'sample progress 5',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 5
			},
			{
				name: 'sample progress 6',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date().toISOString(),
				order: 6
			},
			{
				name: 'sample progress 7',
				owner: context.userId,
				course: context.parentId,
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
		context.sampleProgresses = samples
	})

	afterEach(async () => {
		await mongoose.connection.dropCollection('users')
		await mongoose.connection.dropCollection('courses')
		await mongoose.connection.dropCollection('progresses')
	})
	test<Context>('create', async (context) => {
		const res = await client
			.post(`${COURSE_URL}/${context.parentId}/progresses`)
			.send(context.newProgress)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(context.newProgress)
		expect(await Progress.findById(res.body._id)).toBeTruthy()
	})

	test<Context>('create with invalid name', async (context) => {
		const res = await client
			.post(`${COURSE_URL}/${context.parentId}/progresses`)
			.send({})

		console.log({ body: res.body })
		expect(res.status).toBe(400)
	})

	test<Context>('udpate', async (context) => {
		const udpateProgress = {
			name: 'update',
			order: 1
		}
		const res = await client
			.put(
				`${COURSE_URL}/${context.parentId}/progresses/${context.sampleProgresses[0]._id}`
			)
			.send(udpateProgress)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(udpateProgress)
	})

	test<Context>('udpate with invalid field', async (context) => {
		const res = await client
			.put(
				`${COURSE_URL}/${context.parentId}/progresses/${context.sampleProgresses[0]._id}`
			)
			.send({
				stage: -1
			})

		console.log({ body: res.body })
		expect(res.status).toBe(400)
	})

	test<Context>('get', async (context) => {
		const res = await client.get(
			`${COURSE_URL}/${context.parentId}/progresses/${context.sampleProgresses[2]._id}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(res.body.name).toBe(context.sampleProgresses[2].name)
	})

	test<Context>('get all', async (context) => {
		const res = await client.get(
			`${COURSE_URL}/${context.parentId}/progresses/`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(200)

		for (let i = 0; i < context.sampleProgresses.length; i++) {
			expect(res.body[i].name).toBe(context.sampleProgresses[i].name)
		}
	})

	test<Context>('delete', async (context) => {
		const res = await client.delete(
			`${COURSE_URL}/${context.parentId}/progresses/${context.sampleProgresses[2]._id}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expect(
			await Progress.findById(context.sampleProgresses[2]._id)
		).toBeNull()
	})

	test<Context>('get non-exist progress', async (context) => {
		const res = await client.get(
			`${COURSE_URL}/${context.parentId}/progresses/${'1'.repeat(24)}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(404)
	})

	test<Context>('update non-exist progress', async (context) => {
		const res = await client.put(
			`${COURSE_URL}/${context.parentId}/progresses/${'1'.repeat(24)}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(404)
	})

	test<Context>('delete non-exist progress', async (context) => {
		const res = await client.delete(
			`${COURSE_URL}/${context.parentId}/progresses/${'1'.repeat(24)}`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(404)
	})
})
