import { UserSchema } from 'shared'
import mongoose, { Types } from 'mongoose'
const Schema = mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose'

const schema = new Schema<UserSchema>(
	{},
	{
		id: false,
		timestamps: true
	}
)

schema.plugin(passportLocalMongoose)

export const User = mongoose.model('User', schema)
;(async function () {
	await User.createCollection()
})()

export async function fetch(userId: Types.ObjectId) {
	const res = await User.aggregate([
		{ $match: { _id: userId } },
		{
			$project: {
				username: 1
			}
		}
	])

	if (res.length === 0) throw Error('4')

	return res
}
