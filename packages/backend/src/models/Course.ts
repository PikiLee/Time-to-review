import { courseStatusIndices, NewCourse, UpdateCourse } from 'shared'
import mongoose, { Schema, Query } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'
import type { Course as CourseType } from 'shared'
import lodash from 'lodash-es'
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
		autopopulate: true
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
	order: {
		type: Number,
		required: true
	}
}, {
	id: false
})

courseSchema.virtual('progresses', {
	ref: 'Progress',
	localField: '_id',
	foreignField: 'course',
	autopopulate: true
})

courseSchema.set('toJSON', {versionKey: false, virtuals: true})
courseSchema.plugin(autopopulate)

export const Course = mongoose.model<CourseType>('Course', courseSchema)

export function	popu<T, P>(query: Query<T, P>) {
	return query.populate({path: 'owner', select: '_id username'}).populate('progresses')
}
export async function fetch(_id: string) {
	const course = await Course.findById(_id)
	if (course) {
		return course
	} else {
		throw Error('Course Not Found')
	}
	
}

export async function create(newCourse: NewCourse) {
	const user = await User.findById(newCourse.owner)
	if (user) {
		const course = new Course(newCourse)
		await course.save()
		return course
	} else {
		throw Error('User not found.')
	}
}
		
export async function del(_id: string) {
	return !!(await Course.findByIdAndDelete(_id))
}

export async function update(_id: string, updateCourse: UpdateCourse) {
	const course = await fetch(_id)
	for (const [key, value] of lodash.entries(updateCourse)) {
		(course as any)[key] = value
	}
	await course.save()
	return course
}