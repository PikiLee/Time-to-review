import type { DefaultBodyType, rest } from 'msw'
import { cy } from 'local-cypress'

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

export const mockEndpoint: MockEndPoint = (
	endpoint: string,
	{ body, httpVerb = `get`, status = 200, header }: mockEndpointOptions
) => {
	cy.interceptRequest(httpVerb, endpoint, (req, res, ctx) => {
		if (header) {
			return res(ctx.status(status), ctx.json(body), ctx.set(...header))
		} else {
			return res(ctx.status(status), ctx.json(body))
		}
	})
}
