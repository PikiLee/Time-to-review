import {  NewProgress, Progress, UpdateProgress } from '../../shared/types/progress.type'
import { Course, NewCourse, UpdateCourse } from '../../shared/types/course.type'
import { test, expect,  beforeAll, describe, expectTypeOf } from 'vitest'
import request from 'supertest'
import {app} from '../src/app.js'
import { generateAuthInfo } from './utils.js'

const courseUrl = '/course'
const progressUrl = '/progress'
app.listen(3002)
const client = request.agent(app)
let userId = ''
const newCourse: NewCourse = {
	'name': 'cool',
	'owner': userId,
}
const updateCourse: UpdateCourse = {
	'name': 'updatedCool',
	'status': 1,
	'archived': true,
}
let retrievedCourse: Course
let newProgress: NewProgress
let retrievedProgress: Progress
const updatedProgress: UpdateProgress = {
	'name': 'pool',
	'stage': 1,
	'lastDate': (new Date()).toISOString(),
}

beforeAll(async () => {
	const {username, password} = generateAuthInfo()

	const registerRes = await client
		.post('/auth' + '/register')
		.send({
			username,
			password
		})
	userId = newCourse.owner = registerRes.body._id
})

describe('course', () => {
	test('create course', async () => {
		const res = await client
			.post(courseUrl)
			.send(newCourse)

		retrievedCourse = res.body
		newProgress = {
			name: 'dool',
			owner: userId,
			course: retrievedCourse._id
		}
		expect(res.status).toBe(200)
		expectTypeOf(res.body).toMatchTypeOf<Course>()
	})

    
	test('get course', async () => {
		const res = await client
			.get(courseUrl + '/' + retrievedCourse._id)

		expect(res.status).toBe(200)
		expect(res.body).toEqual(retrievedCourse)
	})

	test('update course', async () => {
		const res = await client
			.put(`${courseUrl}/${retrievedCourse._id}`)
			.send(updateCourse)

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(updateCourse)
	})

	test('create progress', async () => {
		const res = await client
			.post(progressUrl)
			.send(newProgress)

		retrievedProgress = res.body
		expect(res.status).toBe(200)
		expectTypeOf(res.body).toEqualTypeOf<Progress>(0 as never)
	})

	test('get progress', async () => {
		const res = await client
			.get(progressUrl + '/' + retrievedProgress._id)

		expect(res.status).toBe(200)
		expect(res.body).toEqual(retrievedProgress)
	})

	test('get course when the course has a progress', async () => {
		const res = await client
			.get(courseUrl + '/' + retrievedCourse._id)

		expect(res.status).toBe(200)
		expectTypeOf(res.body).toEqualTypeOf<Progress>(0 as never)
	})

	test('update progress', async () => {
		const res = await client
			.put(`${progressUrl}/${retrievedProgress._id}`)
			.send(updatedProgress)

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(updatedProgress)
	})

	test('delete course', async () => {
		const res = await client
			.delete(`${courseUrl}/${retrievedCourse._id}`)

		expect(res.status).toBe(200)
	})

	test('delete non-exist course', async () => {
		const res = await client
			.delete(`${courseUrl}/${Math.random()}`)

		expect(res.status).toBe(404)
	})

	test('delete progress', async () => {
		const res = await client
			.delete(`${progressUrl}/${retrievedProgress._id}`)

		expect(res.status).toBe(200)
	})

	test('delete non-exist progress', async () => {
		const res = await client
			.delete(`${progressUrl}/${Math.random()}`)

		expect(res.status).toBe(404)
	})
})
