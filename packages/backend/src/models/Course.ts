import { courseStatusIndices } from './../types/course.type.js'
import mongoose from 'mongoose'
import type { Course as CourseType } from '../types/course.type.js'

const { Schema } = mongoose

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
	},
	status: {
		type: Number,
		required: true,
		enum: courseStatusIndices
	},
	archived: {
		type: Boolean,
		required: true
	},
	createdAt: {
		type: String,
		required: true
	},
	progresses: [{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Progress' 
	}]
}, {
	versionKey: false
})

export const Course = mongoose.model<CourseType>('Blog', courseSchema)