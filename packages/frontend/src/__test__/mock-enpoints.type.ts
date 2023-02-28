import type { DefaultBodyType, rest } from 'msw'

export interface mockEndpointOptions {
	body: DefaultBodyType
	httpVerb?: keyof typeof rest
	status?: number
	header?: [string, string]
}

export type MockEndPoint = (
	endpoint: string,
	options: mockEndpointOptions
) => void
