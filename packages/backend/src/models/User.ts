import mongoose from 'mongoose'
const Schema = mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose'
import { getPasswordValidationRegex } from 'shared'

const User = new Schema({})

User.plugin(passportLocalMongoose, {
	passwordValidator(password: string, cb: any) {
		const { regex, errorMsg } = getPasswordValidationRegex()
		if (!regex.test(password)) cb({
			name: 'PasswordInvalidError',
			message: errorMsg
		})
		return cb()
	}
})

User.virtual('courses', {
	ref: 'Course',
	localField: '_id',
	foreignField: 'owner'
})

User.virtual('progresses', {
	ref: 'Progress',
	localField: '_id',
	foreignField: 'owner'
})

export default mongoose.model('User', User)