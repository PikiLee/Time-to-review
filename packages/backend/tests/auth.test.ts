import { userZodSchema } from './../../shared/types/user.type'
import { test, expect, describe, afterEach, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { generateAuthInfo } from 'shared'
import { AUTH_URL } from 'shared'
import mongoose from 'mongoose'
import { User } from '../src/models/User'

const app = await createApp({ port: 3001 })
const client = request.agent(app)

afterEach(async () => {
	await mongoose.connection.dropCollection('users')
})

test('check a username has been used', async () => {
	const { username } = generateAuthInfo()
	const res = await client.get(`${AUTH_URL}/${username}`)
	console.log({ body: res.body })
	expect(res.body.exist).toBe(false)
})

test('register', async () => {
	const { username, password } = generateAuthInfo()
	const res = await client.post(AUTH_URL).send({
		username,
		password
	})
	console.log({ body: res.body })
	userZodSchema.parse(res.body)
	expect(res.status).toBe(200)

	// check if username exist
	const registerRes = await client.get(`${AUTH_URL}/${username}`)
	expect(registerRes.body.exist).toBe(true)

	// register with the same username
	const reregisterRes = await client.post(AUTH_URL).send({
		username,
		password
	})
	console.log({ body: reregisterRes.body })
	expect(reregisterRes.status).toBe(400)

	// login
	const loginRes = await client.put(AUTH_URL).send({
		username,
		password
	})

	expect(loginRes.status).toBe(200)
	userZodSchema.parse(loginRes.body)

	//log out
	const logoutRes = await client.delete(AUTH_URL)

	expect(logoutRes.status).toBe(200)
	expect(logoutRes.body.loggedout).toBe(true)
})

describe('fail', () => {
	beforeEach(async () => {
		await User.createCollection()
	})
	test.each(['', '1'.repeat(13)])(
		'login with invalid username',
		async (username) => {
			const { password } = generateAuthInfo()

			const res = await request(app).put(AUTH_URL).send({
				username: username,
				password
			})

			console.log({ body: res.body })
			expect(res.status).toBe(400)
		}
	)

	test.each(['12', 'ab213', 'sdfsdffffffffsdf'])(
		'login with invalid password %s',
		async (password) => {
			const { username } = generateAuthInfo()

			const res = await request(app).put(AUTH_URL).send({
				username,
				password
			})

			console.log({ body: res.body })
			expect(res.status).toBe(400)
		}
	)

	test.each(['', '1'.repeat(13)])(
		'register with invalid username',
		async (username) => {
			const { password } = generateAuthInfo()

			const res = await request(app).put(AUTH_URL).send({
				username: username,
				password
			})

			console.log({ body: res.body })
			expect(res.status).toBe(400)
		}
	)

	test.each(['12', 'ab213', 'sdfsdffffffffsdf'])(
		'register with invalid password %s',
		async (password) => {
			const { username } = generateAuthInfo()

			const res = await request(app).post(AUTH_URL).send({
				username,
				password
			})

			console.log({ body: res.body })
			expect(res.status).toBe(400)
		}
	)
})
