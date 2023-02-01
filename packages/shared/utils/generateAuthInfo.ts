export function generateAuthInfo() {
	const username = Math.random().toString().slice(2, 9)
	const password = '$' + Math.random().toString().slice(2) 
	return {username, password}
}