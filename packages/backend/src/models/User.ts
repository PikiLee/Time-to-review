import mongoose from 'mongoose'
const Schema = mongoose.Schema
import passportLocalMongoose from 'passport-local-mongoose'

const User = new Schema({
	courses: [{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Course'
	}],
	progresses: [{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Progress'
	}]
})

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

export default mongoose.model('User', User)