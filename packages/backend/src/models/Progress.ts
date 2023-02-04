import { NewProgress, UpdateProgress, getNextDate, getIsDue } from 'shared'
import mongoose from 'mongoose'
import { ProgressSchema, progressStageIndices } from 'shared'
import { Course } from './Course.js'
import lodash from 'lodash-es'
import User from './User.js'

const { Schema } = mongoose

const progressSchema = new Schema<ProgressSchema>({
	name: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 20,
	},
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'User',
		required: true
	},
	course: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Course',
		required: true
	},
	stage: {
		type: Number,
		enum: progressStageIndices,
		default: 0
	},
	lastDate: {
		type: String,
		default: () => (new Date()).toISOString(),
		set(lastDate: string) {
			const self = this as any
			self.nextDate = getNextDate(lastDate, self.stage)
			self.isDue = getIsDue(self.nextDate)
			return lastDate
		}
	},
	nextDate: {
		type: String,
	},
	isDue: {
		type: Boolean,
	},
	order: {
		type: Number,
		required: true
	}
}, {
	id: false,
	timestamps: true,
})

progressSchema.set('toJSON', {versionKey: false, virtuals: true})

export const Progress = mongoose.model<ProgressSchema>('Progress', progressSchema)

export async function fetch(_id: string) {
	const doc = await Progress.findById(_id)
	if (doc) {
		return doc
	} else {
		throw Error('Not Found')
	}
	
}

export async function create(newProgress: NewProgress) {
	const user = await User.findById(newProgress.owner)
	if (!user) throw Error('User not found.')

	const course = await Course.findById(newProgress.course)
	if (!course) throw Error('Course not found.')

	const progress = new Progress(newProgress)
	await progress.save()
	return progress
}
		
export async function del(_id: string) {
	return !!(await Progress.findByIdAndDelete(_id))
}

export async function update(_id: string, updateProgress: UpdateProgress) {
	const progress = await fetch(_id)
	for (const [key, value] of lodash.entries(updateProgress)) {
		(progress as any)[key] = value
	}
	await progress.save()
	return progress
}

export async function fetchProgressesByCourseId(courseId: string, userId: string) {
	const progresses = await Progress.find({course: courseId, owner: userId})
	return progresses
}