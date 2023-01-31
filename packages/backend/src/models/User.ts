import mongoose from 'mongoose'
const Schema = mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose'

const User = new Schema({})

User.plugin(passportLocalMongoose, {
	passwordValidator(password: string, cb: any) {
		const validationRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,24}$/
		if (!validationRegex.test(password)) cb({
			name: 'PasswordInvalidError',
			message: 'Password must be valid.'
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