import { MongoMemoryReplSet } from 'mongodb-memory-server-core'
import mongoose from 'mongoose'

export async function createDb(link?: string) {
	if (!link) {
		const replset = await MongoMemoryReplSet.create({
			replSet: { count: 4 }
		}) // This will create an ReplSet with 4 members
		const uri = replset.getUri()
		return mongoose
			.connect(uri)
			.catch((err) =>
				console.log(`Database Connection failed. Error: ${err}`)
			)
	}

	return mongoose
		.connect(link)
		.catch((err) =>
			console.log(`Database Connection failed. Error: ${err}`)
		)
}
