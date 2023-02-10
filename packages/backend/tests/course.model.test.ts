import {
	CourseWithProgress,
	CourseWithDueProgresses
} from './../../shared/dist/types/course.type.d'
import { beforeAll, expect, describe, test } from 'vitest'
import { createApp } from '../src/app'
import request from 'supertest'
import {
	AUTH_URL,
	Course as CourseType,
	COURSE_URL,
	generateAuthInfo,
	NewCourse
} from 'shared'
import lodash from 'lodash-es'

function expectToBeTypeOfCourse(
	course: CourseType,
	opts?: {
		withDueProgresses?: boolean
		withProgresses?: boolean
	}
) {
	const options = lodash.assign(
		{},
		{
			withDueProgresses: false,
			withProgresses: false
		},
		opts
	)
	const properties = [
		'_id',
		'name',
		'owner',
		'status',
		'archived',
		'intervals',
		'createdAt',
		'updatedAt',
		'order',
		'dueCount',
		'isDue',
		'progressCount'
	]
	for (const p of properties) {
		expect(course).toHaveProperty(p)
	}
	let length = properties.length
	if (options.withDueProgresses) {
		expect(course).toHaveProperty('dueProgresses')
		length++
	} else if (options.withProgresses) {
		expect(course).toHaveProperty('progresses')
		length++
	}

	expect(lodash.keys(course)).toHaveLength(length)
}

const app = createApp({ port: 3004 })
let userId: string
let course: CourseType | CourseWithProgress | CourseWithDueProgresses | null

const { username, password } = generateAuthInfo()
const client = request.agent(app)

beforeAll(async () => {
	// register
	const res = await client.post(`${AUTH_URL}/register`).send({
		username,
		password
	})
	expect(res.status).toBe(200)
	userId = res.body._id
	console.log(userId)
})

describe('', () => {
	test('create', async () => {
		const newCourse: NewCourse = {
			name: 'test',
			owner: userId,
			order: 3,
			status: 0,
			archived: false
		}
		const res = await client.post(`${COURSE_URL}`).send(newCourse)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		expect(res.body).toMatchObject(newCourse)
		course = res.body
	})

	describe('update', () => {
		test('udpate', async () => {
			const udpateCourse = {
				name: 'update',
				owner: userId,
				order: 1
			}
			const res = await client
				.put(`${COURSE_URL}/${course!._id}`)
				.send(udpateCourse)

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			expectToBeTypeOfCourse(res.body)
			expect(res.body).toMatchObject(udpateCourse)
			course = res.body
		})

		test('get course with progresses when udpate', async () => {
			const udpateCourse = {
				name: 'update',
				owner: userId,
				order: 1
			}
			const res = await client
				.put(`${COURSE_URL}/${course!._id}`)
				.send(udpateCourse)
				.query({
					withProgresses: true
				})

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			expectToBeTypeOfCourse(res.body, { withProgresses: true })
			expect(res.body).toMatchObject(udpateCourse)
			course = res.body
		})

		test('get course with dueProgresses when udpate', async () => {
			const udpateCourse = {
				name: 'update',
				owner: userId,
				order: 1
			}
			const res = await client
				.put(`${COURSE_URL}/${course!._id}`)
				.send(udpateCourse)
				.query({
					withDueProgresses: true
				})

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			expectToBeTypeOfCourse(res.body, { withDueProgresses: true })
			expect(res.body).toMatchObject(udpateCourse)
			course = res.body
		})
	})

	describe('get', () => {
		test('get', async () => {
			const res = await client.get(`${COURSE_URL}/${course!._id}`)

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			expectToBeTypeOfCourse(res.body)
			course = res.body
		})

		test('get course with progresses', async () => {
			const res = await client.get(`${COURSE_URL}/${course!._id}`).query({
				withProgresses: true
			})

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			expectToBeTypeOfCourse(res.body, { withProgresses: true })
			course = res.body
		})

		test('get course with dueProgresses', async () => {
			const res = await client.get(`${COURSE_URL}/${course!._id}`).query({
				withDueProgresses: true
			})

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			expectToBeTypeOfCourse(res.body, { withDueProgresses: true })
			course = res.body
		})
	})

	describe('get all', () => {
		test('get all', async () => {
			const res = await client.get(`${COURSE_URL}`)

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			for (const course of res.body) {
				expectToBeTypeOfCourse(course)
			}
		})

		test('get all course with progresses', async () => {
			const res = await client.get(`${COURSE_URL}`).query({
				withProgresses: true
			})

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			for (const course of res.body) {
				expectToBeTypeOfCourse(course, { withProgresses: true })
			}
		})

		test('get all course with dueProgresses', async () => {
			const res = await client.get(`${COURSE_URL}`).query({
				withDueProgresses: true
			})

			console.log({ body: res.body })
			expect(res.status).toBe(200)
			for (const course of res.body) {
				expectToBeTypeOfCourse(course, { withDueProgresses: true })
			}
		})
	})

	test('delete', async () => {
		const res = await client.delete(`${COURSE_URL}/${course!._id}`)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		course = null
	})
})
