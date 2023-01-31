import { NewProgress, UpdateProgress } from './../types/progress.type'
import mongoose from 'mongoose'
import { Progress as ProgressType, progressStageIndices } from '../types/progress.type.js'
import { Course } from './Course.js'
import User from './User.js'

const { Schema } = mongoose

const progressSchema = new Schema<ProgressType>({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 20,
	},
	stage: {
		type: Number,
		enum: progressStageIndices,
		default: 0
	},
	lastDate: {
		type: String,
		default: () => (new Date()).toISOString()
	},
	createdAt: {
		type: String,
		default: () => (new Date()).toISOString()
	}
})

progressSchema.set('toJSON', {versionKey: false})

export const Progress = mongoose.model<ProgressType>('Progress', progressSchema)

export async function fetch(_id: string) {
	const query = await Progress.findById(_id)
	if (query) {
		return query
	} else {
		throw Error('Not Found')
	}
	
}

export async function create(newProgress: NewProgress) {
	const user = await User.findById(newProgress.owner)
	const course = await Course.findById(newProgress.course)
	if (user && course) {
		const progress = new Progress(newProgress)
		await progress.save()
		course.progresses.push(progress)
		await course.save()
		return await fetch(String(progress._id))
	} else {
		throw Error('User not found.')
	}
}
		
export async function del(_id: string) {
	return !!(await Progress.findByIdAndDelete(_id))
}

export async function update(_id: string, updateCourse: UpdateProgress) {
	return await Progress.findByIdAndUpdate(_id, updateCourse, {new: true})
}