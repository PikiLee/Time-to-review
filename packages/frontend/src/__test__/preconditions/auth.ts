import { getAuthEndpoints } from 'shared'
import type { MockEndPoint } from '../mock-enpoints.type'

const cookie = 'asss'

export function registerSucceed({
	mockEndpoint,
	username
}: {
	mockEndpoint: MockEndPoint
	username: string
}) {
	const endpoint = getAuthEndpoints.register()
	mockEndpoint(endpoint.path, {
		body: { _id: '1', username },
		httpVerb: endpoint.method,
		header: ['set-cookie', cookie]
	})
}

export function loginSucceed({
	mockEndpoint,
	username
}: {
	mockEndpoint: MockEndPoint
	username: string
}) {
	const endpoint = getAuthEndpoints.login()
	mockEndpoint(endpoint.path, {
		body: { _id: '1', username },
		httpVerb: endpoint.method,
		header: ['set-cookie', cookie]
	})
}

export function registerServerDown({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getAuthEndpoints.register()
	mockEndpoint(endpoint.path, {
		status: 500,
		body: {},
		httpVerb: endpoint.method
	})
}

export function loginServerDown({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getAuthEndpoints.login()
	mockEndpoint(endpoint.path, {
		status: 500,
		body: {},
		httpVerb: endpoint.method
	})
}

export function usernameNotExist({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getAuthEndpoints.checkUsername()
	mockEndpoint(endpoint.path, {
		body: { exist: false },
		httpVerb: endpoint.method
	})
}

export function usernameExist({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getAuthEndpoints.checkUsername()
	mockEndpoint(endpoint.path, {
		body: { exist: true },
		httpVerb: endpoint.method
	})
}
