import mongoose from 'mongoose'
import { Progress as ProgressType, progressStageIndices } from '../types/progress.type.js'

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
		required: true,
		enum: progressStageIndices
	},
	lastDate: {
		type: String,
		required: true
	},
	createdAt: {
		type: String,
		required: true
	}
})

progressSchema.set('toJSON', {versionKey: false})

export const Progress = mongoose.model<ProgressType>('Progress', progressSchema)