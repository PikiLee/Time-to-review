import {  NewProgress, Progress, UpdateProgress, Course, NewCourse, UpdateCourse, User, progressStageIndices} from 'shared'
import { test, expect,  beforeAll, describe } from 'vitest'
import request from 'supertest'
import {app} from '../src/app.js'
import { generateAuthInfo } from 'shared'

const courseUrl = '/course'
const progressUrl = '/progress'
app.listen(3002)

function expectToBeTypeOfCourse(course: Course) {
	expect(course).toHaveProperty('_id')
	expect(course.owner).toHaveProperty('_id')
	expect(course.owner).toHaveProperty('username')
	expect(course).toHaveProperty('name')
	expect(course).toHaveProperty('status')
	expect(course).toHaveProperty('archived')
	expect(course).toHaveProperty('createdAt')
	expect(course).toHaveProperty('order')
	expect(course).toHaveProperty('_id')
	expect(Array.isArray(course.progresses)).toBe(true)
}

function expectToBeTypeOfProgress(progress: Progress) {
	expect(progress).toHaveProperty('_id')
	expect(progress).toHaveProperty('course')
	expect(progress).toHaveProperty('owner')
	expect(progress.stage in progressStageIndices).toBe(true)
	expect(progress).toHaveProperty('lastDate')
	expect(progress).toHaveProperty('createdAt')
	expect(progress).toHaveProperty('order')
	expect(progress).toHaveProperty('nextDate')
	expect(progress).toHaveProperty('isDue')
}


const client = request.agent(app)
let  user: User
let newCourse: NewCourse
let retrievedCourse: Course
const updateCourse: UpdateCourse = {
	'name': 'updatedCool',
	'status': 1,
	'archived': true,
}
let updatedCourse: Course

let newProgress: NewProgress
let retrievedProgress: Progress
const updateProgress: UpdateProgress = {
	'name': 'pool',
	'stage': 1,
	'lastDate': (new Date()).toISOString(),
}
let updatedProgress: Progress

beforeAll(async () => {
	const {username, password} = generateAuthInfo()

	const registerRes = await client
		.post('/auth' + '/register')
		.send({
			username,
			password
		})
	user = registerRes.body
	newCourse = {
		'name': 'cool',
		'owner': user._id,
		order: 0.2,
	}
})

describe('course', () => {
	test('create course', async () => {
		const res = await client
			.post(courseUrl)
			.send(newCourse)

		retrievedCourse = res.body
		newProgress = {
			name: 'dool',
			owner: user._id,
			course: retrievedCourse._id,
			order: 0.3,
		}
		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
	})

    
	test('get course', async () => {
		const res = await client
			.get(courseUrl + '/' + retrievedCourse._id)

		expect(res.status).toBe(200)
		console.log(res.body)
		expectToBeTypeOfCourse(res.body)
		expect(res.body).toEqual(retrievedCourse)
	})

	test('update course', async () => {
		const res = await client
			.put(`${courseUrl}/${retrievedCourse._id}`)
			.send(updateCourse)

		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		updatedCourse = Object.assign({}, retrievedCourse, updateCourse)
		expect(res.body).toEqual(updatedCourse)
	})

	test('create progress', async () => {
		const res = await client
			.post(progressUrl)
			.send(newProgress)

		retrievedProgress = res.body
		updatedCourse.progresses.push(retrievedProgress)
		expect(res.status).toBe(200)
		expectToBeTypeOfProgress(res.body)
	})

	test('get progress', async () => {
		const res = await client
			.get(progressUrl + '/' + retrievedProgress._id)

		expect(res.status).toBe(200)
		expectToBeTypeOfProgress(res.body)
		expect(res.body).toEqual(retrievedProgress)
	})

	test('get course when the course has a progress', async () => {
		const res = await client
			.get(courseUrl + '/' + retrievedCourse._id)

		expect(res.status).toBe(200)
		expectToBeTypeOfCourse(res.body)
		expect(res.body).toEqual(updatedCourse)
	})

	test('update progress', async () => {
		const res = await client
			.put(`${progressUrl}/${retrievedProgress._id}`)
			.send(updateProgress)

		expect(res.status).toBe(200)
		updatedProgress = Object.assign({}, retrievedProgress, res.body)
		updatedCourse.progresses = [updatedProgress]
		expectToBeTypeOfProgress(res.body)
		expect(res.body).toEqual(updatedProgress)
	})

	test('delete progress', async () => {
		const res = await client
			.delete(`${progressUrl}/${updatedProgress._id}`)

		expect(res.status).toBe(200)
	})

	test('delete course', async () => {
		const res = await client
			.delete(`${courseUrl}/${updatedCourse._id}`)

		expect(res.status).toBe(200)
	})

	test('delete non-exist course', async () => {
		const res = await client
			.delete(`${courseUrl}/${Math.random()}`)

		expect(res.status).toBe(404)
	})

	test('delete non-exist progress', async () => {
		const res = await client
			.delete(`${progressUrl}/${Math.random()}`)

		expect(res.status).toBe(404)
	})
})
