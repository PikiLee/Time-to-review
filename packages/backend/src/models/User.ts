import mongoose from 'mongoose'
const Schema = mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose'
import { getPasswordValidationRegex } from 'shared'

const schema = new Schema(
	{},
	{
		id: false,
		timestamps: true
	}
)

schema.plugin(passportLocalMongoose, {
	passwordValidator(password: string, cb: any) {
		const { regex, errorMsg } = getPasswordValidationRegex()
		if (!regex.test(password))
			cb({
				name: 'PasswordInvalidError',
				message: errorMsg
			})
		return cb()
	}
})

schema.set('toJSON', {
	versionKey: false,
	transform: (_, ret) => {
		return {
			_id: ret._id,
			username: ret.username
		}
	}
})

export const User = mongoose.model('User', schema)
;(async function () {
	await User.createCollection()
})()
