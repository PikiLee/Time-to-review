import { test, expect, describe } from 'vitest'
import request from 'supertest'
import {app} from '../src/app.js'
import { generateAuthInfo } from './utils.js'

export const authUrl = '/auth'
app.listen(3001)
describe('register', () => {
	const {username, password} = generateAuthInfo()
	const client = request.agent(app)

	test('register', async () => {
		const registerRes = await client
			.post(authUrl + '/register')
			.send({
				username,
				password
			})
		expect(registerRes.status).toBe(200)
		expect(registerRes.body).toHaveProperty('_id')
		expect(registerRes.body).toHaveProperty('username')
	})

	test('register with the same username', async () => {
		const registerRes = await client
			.post(authUrl + '/register')
			.send({
				username,
				password
			})
		expect(registerRes.status).toBe(400)
	})

	test('register the same user', async () => {
		const registerRes = await client
			.post(authUrl + '/register')
			.send({
				username,
				password
			})
		expect(registerRes.status).toBe(400)
	})
	
	test('login', async () => {
		const loginRes = await client
			.post(authUrl + '/login')
			.send({
				username,
				password
			})
    
		expect(loginRes.status).toBe(200)
	})

	test('logout', async () => {        
		const logoutRes = await client
			.post(authUrl + '/logout')

		expect(logoutRes.status).toBe(200)
	})

	client
})

test('login fail', async () => {
	const {username, password} = generateAuthInfo()

	const loginRes = await request(app)
		.post(authUrl + '/login')
		.send({
			username,
			password
		})
    
	expect(loginRes.status).toBe(401)
})

test('logout fail', async () => {
	const logoutRes = await request(app)
		.post(authUrl + '/logout')

	expect(logoutRes.status).toBe(401)
})

test('register with less than 12-character password', async () => {
	const registerRes = await request(app)
		.post(authUrl + '/register')
		.send({
			username: '223',
			password: '123'
		})
	expect(registerRes.status).toBe(400)
})

