export function getPasswordValidationRegex() {
	return { 
		regex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,24}$/,
		errorMsg: 'Should be 12 to 24 long and contain at least one of !@#$%^&*, one number'
	}
}

export const AUTH_URL = '/auth'

