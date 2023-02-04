import lodash from 'lodash-es'
import { test, expect, describe } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { generateAuthInfo, User } from 'shared'
import { AUTH_URL } from 'shared'

const app = createApp({port: 3001})

function expectTypeOfUser(user: User) {
	expect(user).toHaveProperty('username')
	expect(user).toHaveProperty('_id')
	expect(lodash.keys(user)).toHaveLength(2)
}

describe('register', () => {
	const {username, password} = generateAuthInfo()
	const client = request.agent(app)

	test('register', async () => {
		const res = await client
			.post(AUTH_URL + '/register')
			.send({
				username,
				password
			})
		expect(res.status).toBe(200)
		expectTypeOfUser(res.body)
	})

	test('check a username has been used', async () => {
		const registerRes = await client
			.get(`${AUTH_URL}/${username}`)
		expect(registerRes.status).toBe(400)
	})

	test('register with the same username', async () => {
		const registerRes = await client
			.post(AUTH_URL + '/register')
			.send({
				username,
				password
			})
		expect(registerRes.status).toBe(400)
	})
	
	test('login', async () => {
		const res = await client
			.post(AUTH_URL + '/login')
			.send({
				username,
				password
			})
    
		expect(res.status).toBe(200)
		expectTypeOfUser(res.body)
	})

	test('logout', async () => {        
		const logoutRes = await client
			.post(AUTH_URL + '/logout')

		expect(logoutRes.status).toBe(200)
	})

})

test('login fail', async () => {
	const {username, password} = generateAuthInfo()

	const loginRes = await request(app)
		.post(AUTH_URL + '/login')
		.send({
			username,
			password
		})
    
	expect(loginRes.status).toBe(401)
})

test('register with less than 12-character password', async () => {
	const registerRes = await request(app)
		.post(AUTH_URL + '/register')
		.send({
			username: '223',
			password: '123'
		})
	expect(registerRes.status).toBe(400)
})



