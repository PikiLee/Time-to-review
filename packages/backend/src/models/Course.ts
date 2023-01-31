import { courseStatusIndices, NewCourse, UpdateCourse } from 'shared'
import mongoose, { Schema, Query } from 'mongoose'
import type { Course as CourseType } from 'shared'
import User from './User.js'

const courseSchema = new Schema<CourseType>({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 20,
	},
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User',
		required: true,
		immutable: true,
	},
	status: {
		type: Number,
		enum: courseStatusIndices,
		default: 0
	},
	archived: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: String,
		default: () => (new Date()).toISOString(),
		immutable: true
	},
	progresses: [{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Progress' 
	}]
})

courseSchema.set('toJSON', {versionKey: false})

export const Course = mongoose.model<CourseType>('Course', courseSchema)

export function	popu<T, P>(query: Query<T, P>) {
	return query.populate({path: 'owner', select: '_id username'}).populate('progresses')
}
export async function fetch(_id: string) {
	const query = Course.findById(_id)
	if (query) {
		return await popu(query)
	} else {
		throw Error('Not Found')
	}
	
}

export async function create(newCourse: NewCourse) {
	const user = await User.findById(newCourse.owner)
	if (user) {
		const course = new Course(newCourse)
		await course.save()
		user.courses.push(course)
		await user.save()
		return await fetch(String(course._id))
	} else {
		throw Error('User not found.')
	}
}
		
export async function del(_id: string) {
	return !!(await Course.findByIdAndDelete(_id))
}

export async function update(_id: string, updateCourse: UpdateCourse) {
	return await popu(Course.findByIdAndUpdate(_id, updateCourse, {new: true}))
}