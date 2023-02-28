import type { MockEndPoint } from '../mock-enpoints.type'

export function serverDown({ mockEndpoint }: { mockEndpoint: MockEndPoint }) {
	mockEndpoint('*', {
		status: 500,
		httpVerb: 'all',
		body: {}
	})
}
