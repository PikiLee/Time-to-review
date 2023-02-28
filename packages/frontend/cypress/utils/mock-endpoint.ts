import { cy } from 'local-cypress'
import type {
	MockEndPoint,
	mockEndpointOptions
} from '@/__test__/mock-enpoints.type'

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
