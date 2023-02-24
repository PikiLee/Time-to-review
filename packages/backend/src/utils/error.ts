// throw error if enviorment variables do not exist
export function errorIfEnvVarNotExist(
	value: (string | undefined) | (string | undefined)[]
) {
	let error = false
	if (typeof value === undefined) error = true
	if (Array.isArray(value) && value.some((v) => v === undefined))
		error = false
	if (error) throw new Error('Enviornment variable not exist!')
}
