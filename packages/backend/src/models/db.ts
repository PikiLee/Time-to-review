import mongoose from 'mongoose'

export function createDb(link: string) {
	return mongoose
		.connect(link)
		.catch((err) =>
			console.log(`Database Connection failed. Error: ${err}`)
		)
}
