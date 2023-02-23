import type { NewUser } from 'shared'
import { api } from './api'

export async function register(
	newUser: NewUser,
	{
		token
	}: {
		token: string
	}
) {
	return await api.register(newUser, {
		queries: {
			token
		}
	})
}

export async function checkUsername(username: string) {
	return await api.checkUsername({
		params: {
			username
		}
	})
}

export async function login(
	newUser: NewUser,
	{
		token
	}: {
		token: string
	}
) {
	return await api.login(newUser, {
		queries: {
			token
		}
	})
}

export async function logout() {
	return await api.logout(undefined)
}
