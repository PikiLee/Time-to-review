import lodash from 'lodash-es'

export interface Options {
	withProgresses?: boolean
	withDueProgresses?: boolean
}

export function buildOptions(options: Options | undefined) {
	const { withProgresses, withDueProgresses } = lodash.assign(
		{},
		{
			withProgresses: false,
			withDueProgresses: false
		},
		options
	)

	return {
		withProgresses,
		withDueProgresses
	}
}
