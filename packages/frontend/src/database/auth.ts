import type { NewUser } from 'shared'
import { api } from './api'

export async function register(newUser: NewUser) {
	return await api.register(newUser)
}

export async function checkUsername(username: string) {
	return await api.checkUsername({
		params: {
			username
		}
	})
}

export async function login(newUser: NewUser) {
	return await api.login(newUser)
}

export async function logout() {
	return await api.logout(undefined)
}
