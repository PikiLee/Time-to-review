import { NewProgress, UpdateProgress, getNextDate, getIsDue } from 'shared'
import mongoose from 'mongoose'
import { Progress as ProgressType, progressStageIndices } from 'shared'
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
		default: () => (new Date()).toISOString(),
		immutable: true
	}
}, {
	virtuals: {
		nextDate() {
			const self = this as ProgressType
			return getNextDate(self.lastDate, self.stage)
		},
		isDue() {
			const self = this as ProgressType
			return getIsDue(self.nextDate)
		}
	}
})

progressSchema.set('toJSON', {versionKey: false, virtuals: true})

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