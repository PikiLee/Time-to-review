import { courseZodSchema } from 'shared'
import { CourseStatus, NewProgress } from 'shared'
import { expect, test, beforeEach, afterEach, describe } from 'vitest'
import { createApp } from '../src/app'
import request from 'supertest'
import {
	AUTH_URL,
	COURSE_URL,
	generateAuthInfo,
	NewCourse,
	progressZodSchema
} from 'shared'

import mongoose, { Types } from 'mongoose'
import { Course } from '../src/models/Course'
import { Progress } from '../src/models/Progress'

const app = await createApp({ port: 13004 })
const client = request.agent(app)
const token = '123'

interface Context {
	userId: Types.ObjectId
	sampleCourses: any[]
	newCourse: NewCourse
	parentId: Types.ObjectId
	parentId2: Types.ObjectId
	newProgress: NewProgress
	sampleProgresses: any[]
}

test('get an empty array if the user do not have courses', async () => {
	const { username, password } = generateAuthInfo()
	const registerRes = await client
		.post(`${AUTH_URL}`)
		.send({
			username,
			password
		})
		.query({ token })
	console.log({ body: registerRes.body })
	expect(registerRes.status).toBe(200)

	const res = await client.get(`${COURSE_URL}`)

	console.log({ body: res.body })
	expect(res.status).toBe(200)
	expect(res.body).toEqual([])
})

describe('coures', () => {
	beforeEach<Context>(async (context) => {
		const { username, password } = generateAuthInfo()
		const res = await client
			.post(`${AUTH_URL}`)
			.send({
				username,
				password
			})
			.query({ token })
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
			},
			{
				name: 'sample course 8 .',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 8
			},
			{
				name: 'sample course 9 *',
				owner: context.userId,
				status: CourseStatus['In Progress'],
				archived: false,
				order: 8
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
		courseZodSchema.parse(res.body)
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
		courseZodSchema.parse(res.body)
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
		courseZodSchema.parse(res.body)
		expect(res.body.name).toBe(context.sampleCourses[2].name)
	})

	test<Context>('get all', async (context) => {
		const res = await client.get(`${COURSE_URL}`)

		console.log({ body: res.body })
		expect(res.status).toBe(200)

		for (let i = 0; i < context.sampleCourses.length; i++) {
			expect(res.body[i].name).toBe(context.sampleCourses[i].name)
			courseZodSchema.parse(res.body[i])
		}
	})

	test.each(['5', '0', '7', '.', '*'])(
		'search course by name',
		async (searchPhrase) => {
			const res = await client.get(`${COURSE_URL}`).query({
				search: searchPhrase
			})

			console.log({ body: res.body })
			expect(res.status).toBe(200)

			for (let i = 0; i < res.body.length; i++) {
				expect(res.body[i].name).toContain(searchPhrase)
				courseZodSchema.parse(res.body[i])
			}
		}
	)

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

	describe('auth guard', () => {
		test<Context>('create course without login', async (context) => {
			const res = await request(app)
				.post(`${COURSE_URL}`)
				.send(context.newCourse)

			console.log({ body: res.body })
			expect(res.status).toBe(401)
		})

		test<Context>('udpate course without login', async (context) => {
			const res = await request(app)
				.put(`${COURSE_URL}`)
				.send(context.newCourse)

			console.log({ body: res.body })
			expect(res.status).toBe(401)
		})

		test<Context>('delete course without login', async (context) => {
			const res = await request(app)
				.delete(`${COURSE_URL}`)
				.send(context.newCourse)

			console.log({ body: res.body })
			expect(res.status).toBe(401)
		})

		test<Context>('get course without login', async (context) => {
			const res = await request(app)
				.get(`${COURSE_URL}`)
				.send(context.newCourse)

			console.log({ body: res.body })
			expect(res.status).toBe(401)
		})
	})
})

test('get an empty array if the course do not have progresses', async () => {
	const { username, password } = generateAuthInfo()
	const registerRes = await client
		.post(`${AUTH_URL}`)
		.send({
			username,
			password
		})
		.query({ token })
	console.log({ body: registerRes.body })
	expect(registerRes.status).toBe(200)

	const newCourse = new Course({
		name: 'new course',
		owner: registerRes.body._id,
		status: CourseStatus['In Progress'],
		archived: false,
		intervals: [1, 7, 14, 28],
		order: 0
	})
	await newCourse.save()

	const res = await client.get(`${COURSE_URL}/${newCourse._id}/progresses`)

	console.log({ body: res.body })
	expect(res.status).toBe(200)
	expect(res.body).toEqual([])
})

async function register() {
	const { username, password } = generateAuthInfo()
	const res = await client
		.post(`${AUTH_URL}`)
		.send({
			username,
			password
		})
		.query({ token })
	console.log({ body: res.body })
	expect(res.status).toBe(200)

	return res.body._id
}

async function createCourse(name: string, owner: Types.ObjectId) {
	const newCourse = new Course({
		name,
		owner: owner,
		status: CourseStatus['In Progress'],
		archived: false,
		intervals: [1, 7, 14, 28],
		order: 0
	})
	await newCourse.save()
	return newCourse._id
}

describe('progress', () => {
	beforeEach<Context>(async (context) => {
		context.userId = await register()

		context.parentId = await createCourse('new course', context.userId)
		context.parentId2 = await createCourse('new course 2', context.userId)

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
				lastDate: new Date(12312).toISOString(),
				order: 6
			},
			{
				name: 'sample progress 7',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date(123123).toISOString(),
				order: 7
			},
			{
				name: 'sample progress 8.*',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date(123123).toISOString(),
				order: 8
			},
			{
				name: 'sample progress 9 **',
				owner: context.userId,
				course: context.parentId,
				stage: 0,
				lastDate: new Date(123123).toISOString(),
				order: 9
			},
			{
				name: 'sample progress 10 **',
				owner: context.userId,
				course: context.parentId2,
				stage: 0,
				lastDate: new Date(123123).toISOString(),
				order: 10
			},
			{
				name: 'sample progress 11 ..',
				owner: context.userId,
				course: context.parentId2,
				stage: 0,
				lastDate: new Date(123123).toISOString(),
				order: 11
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
		progressZodSchema.parse(res.body)
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
		progressZodSchema.parse(res.body)
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
		progressZodSchema.parse(res.body)
		expect(res.body.name).toBe(context.sampleProgresses[2].name)
	})

	test<Context>('get all', async (context) => {
		const res = await client.get(
			`${COURSE_URL}/${context.parentId}/progresses/`
		)

		console.log({ body: res.body })
		expect(res.status).toBe(200)

		const shouldFetchedCourses = context.sampleProgresses.filter(
			(p) => p.course === context.parentId
		)
		for (let i = 0; i < shouldFetchedCourses.length; i++) {
			expect(res.body[i].name).toBe(shouldFetchedCourses[i].name)
			progressZodSchema.parse(res.body[i])
		}
	})

	describe.each(['5', '0', '7', '.', '*'])(' %s', (searchPhrase) => {
		test<Context>('search progress by name', async (context) => {
			const res = await client
				.get(`${COURSE_URL}/${context.parentId}/progresses/`)
				.query({
					search: searchPhrase
				})

			console.log({ body: res.body })
			expect(res.status).toBe(200)

			for (let i = 0; i < res.body.length; i++) {
				expect(res.body[i].name).toContain(searchPhrase)
				progressZodSchema.parse(res.body[i])
			}
		})

		test<Context>('search progress by name belongs to differnet courses', async (context) => {
			const res = await client
				.get(`${COURSE_URL}/${context.parentId}/progresses/`)
				.query({
					search: '*',
					searchAll: true
				})

			console.log({ body: res.body })
			expect(res.status).toBe(200)

			expect(res.body[0].name).toContain(context.sampleProgresses[8].name)
			expect(res.body[1].name).toContain(context.sampleProgresses[9].name)
			expect(res.body[2].name).toContain(
				context.sampleProgresses[10].name
			)
			progressZodSchema.parse(res.body[0])
		})
	})

	test<Context>('get all due progresses', async (context) => {
		const res = await client
			.get(`${COURSE_URL}/${context.parentId}/progresses/`)
			.query({
				isDue: true
			})

		console.log({ body: res.body })
		expect(res.status).toBe(200)

		expect(res.body[0].name).toBe(context.sampleProgresses[6].name)
		progressZodSchema.parse(res.body[0])
		expect(res.body[1].name).toBe(context.sampleProgresses[7].name)
		progressZodSchema.parse(res.body[1])
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
