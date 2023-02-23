import { rest, setupWorker, type DefaultBodyType } from 'msw'

export const mockWorker = setupWorker()
mockWorker.start({
	onUnhandledRequest: `bypass`
})

const ENDPOINT_MOCKS_KEY = `__ENDPOINT_MOCKS__`

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
	mockWorker.use(
		rest[httpVerb](endpoint, (req, res, ctx) => {
			if (header) {
				return res(
					ctx.status(status),
					ctx.json(body),
					ctx.set(...header)
				)
			} else {
				return res(ctx.status(status), ctx.json(body))
			}
		})
	)
}

export const activateStoredMocks = () => {
	const mocksRaw = localStorage.getItem(ENDPOINT_MOCKS_KEY)
	const mocks = mocksRaw ? JSON.parse(mocksRaw) : []
	mocks.forEach((mock: { endpoint: string; options: mockEndpointOptions }) =>
		mockEndpoint(mock.endpoint, mock.options)
	)
}
