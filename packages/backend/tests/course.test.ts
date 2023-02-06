import {
	NewProgress,
	Progress,
	UpdateProgress,
	Course,
	NewCourse,
	UpdateCourse,
	User,
} from 'shared'
import { test, expect, beforeAll, describe } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { generateAuthInfo } from 'shared'
import lodash from 'lodash-es'

const courseUrl = '/course'
const progressUrl = '/progress'
const app = createApp({ port: 3002 })
const client = request.agent(app)
const { username, password } = generateAuthInfo()

let user: User
let newCourse: NewCourse
let retrievedCourse: Course
const updateCourse: UpdateCourse = {
	name: 'updatedCool',
	status: 0,
	archived: true,
}
let updatedCourse: Course

let newProgress: NewProgress
let retrievedProgress: Progress
const updateProgress: UpdateProgress = {
	name: 'pool',
	stage: 1,
	lastDate: new Date(23123123).toISOString(),
}
let updatedProgress: Progress

beforeAll(async () => {
	const registerRes = await client.post('/auth' + '/register').send({
		username,
		password,
	})
	expect(registerRes.status).toBe(200)
	user = registerRes.body
	newCourse = {
		name: 'cool',
		owner: user._id,
		order: 0.2,
	}
})

function expectToBeTypeOfCourse(
	course: Course,
	options = {
		withDueProgresses: false,
		withProgresses: false,
	}
) {
	expect(course).toHaveProperty('_id')
	expect(course).toHaveProperty('name')
	expect(course).toHaveProperty('owner')
	expect(course).toHaveProperty('status')
	expect(course).toHaveProperty('archived')
	expect(course).toHaveProperty('intervals')
	expect(course).toHaveProperty('createdAt')
	expect(course).toHaveProperty('updatedAt')
	expect(course).toHaveProperty('order')
	expect(course).toHaveProperty('dueCount')
	expect(course).toHaveProperty('isDue')
	expect(course).toHaveProperty('progressCount')
	let length = 12
	if (options.withDueProgresses) {
		expect(course).toHaveProperty('dueProgresses')
		length++
	} else if (options.withProgresses) {
		expect(course).toHaveProperty('progresses')
		length++
	} else {
		expect(lodash.keys(course)).toHaveLength(length)
	}
}

function expectToBeTypeOfProgress(progress: Progress) {
	expect(progress).toHaveProperty('_id')
	expect(progress).toHaveProperty('course')
	expect(progress).toHaveProperty('owner')
	expect(progress).toHaveProperty('stage')
	expect(progress).toHaveProperty('lastDate')
	expect(progress).toHaveProperty('createdAt')
	expect(progress).toHaveProperty('updatedAt')
	expect(progress).toHaveProperty('order')
	expect(progress).toHaveProperty('nextDate')
	expect(progress).toHaveProperty('isDue')
	expect(lodash.keys(progress)).toHaveLength(11)
}

describe('course', () => {
	test('create course', async () => {
		const res = await client.post(courseUrl).send(newCourse)

		retrievedCourse = res.body
		newProgress = {
			name: 'dool',
			owner: user._id,
			course: retrievedCourse._id,
			order: 0.3,
		}
		console.log(res.body)
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
	})

	test('get course', async () => {
		const res = await client.get(courseUrl + '/' + retrievedCourse._id)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		expect(res.body).toEqual(retrievedCourse)
	})

	test('get all course', async () => {
		const res = await client.get(courseUrl)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body[0])
		expect(res.body[0]).toEqual(retrievedCourse)
	})

	test('mark course archived', async () => {
		const res = await client
			.put(`${courseUrl}/${retrievedCourse._id}`)
			.send(updateCourse)

		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		updatedCourse = Object.assign({}, retrievedCourse, updateCourse)
		updatedCourse.updatedAt = res.body.updatedAt
		updatedCourse.isDue = false
		expect(res.body).toEqual(updatedCourse)
	})

	test('create progress', async () => {
		const res = await client.post(progressUrl).send(newProgress)

		retrievedProgress = res.body
		console.log({ body: res.body })
		updatedCourse.progressCount++
		expect(res.status).toBe(200)
		expectToBeTypeOfProgress(res.body)
	})

	test('get progress', async () => {
		const res = await client.get(progressUrl + '/' + retrievedProgress._id)

		console.log(res.body)
		expect(res.status).toBe(200)
		expectToBeTypeOfProgress(res.body)
		expect(res.body).toEqual(retrievedProgress)
	})

	test('get course when the course has a progress', async () => {
		const res = await client.get(courseUrl + '/' + retrievedCourse._id)

		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		expect(res.body).toEqual(updatedCourse)
	})

	test('update progress', async () => {
		const res = await client
			.put(`${progressUrl}/${retrievedProgress._id}`)
			.send(updateProgress)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		updatedProgress = Object.assign({}, retrievedProgress, res.body)
		updatedCourse.isDue = true
		updatedCourse.dueCount++
		expectToBeTypeOfProgress(res.body)
		expect(res.body).toEqual(updatedProgress)
	})

	test('mark course unarchived', async () => {
		updateCourse.archived = false
		const res = await client
			.put(`${courseUrl}/${retrievedCourse._id}`)
			.send(updateCourse)

		console.log({ body: res.body })
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		updatedCourse = Object.assign({}, updatedCourse, updateCourse)
		updatedCourse.updatedAt = res.body.updatedAt
		updatedCourse.isDue = true
		expect(res.body).toEqual(updatedCourse)
	})

	test('get course again', async () => {
		const res = await client.get(courseUrl + '/' + retrievedCourse._id)

		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		expect(res.body).toEqual(updatedCourse)
	})

	test('get a course with progresses field ', async () => {
		const res = await client.get(courseUrl + '/' + retrievedCourse._id).query({
			withProgresses: true,
		})

		console.log({ body: res.body, progresses: res.body.progresses })
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body, {
			withProgresses: true,
			withDueProgresses: false,
		})
	})

	test('get dued course', async () => {
		const res = await client.get(courseUrl + '/due')

		console.log({
			body: res.body,
			dueProgresses: res.body[0].dueProgresses,
			updatedCourse,
		})
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body[0], {
			withDueProgresses: true,
			withProgresses: false,
		})
		updatedCourse.updatedAt = res.body[0].updatedAt
	})

	test('delete progress', async () => {
		const res = await client.delete(`${progressUrl}/${updatedProgress._id}`)

		expect(res.status).toBe(200)
	})

	test('delete course', async () => {
		const res = await client.delete(`${courseUrl}/${updatedCourse._id}`)

		expect(res.status).toBe(200)
	})

	test('delete non-exist course', async () => {
		const res = await client.delete(`${courseUrl}/${Math.random()}`)

		expect(res.status).toBe(404)
	})

	test('delete non-exist progress', async () => {
		const res = await client.delete(`${progressUrl}/${Math.random()}`)

		expect(res.status).toBe(404)
	})
})
