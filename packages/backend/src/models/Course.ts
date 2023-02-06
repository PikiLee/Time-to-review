import { createProgressProjectStage, createSortStage } from './Progress.js'
import {
	courseStatusIndices,
	NewCourse,
	UpdateCourse,
	CourseSchema as CourseSchemaType,
	CourseStatus,
} from 'shared'
import mongoose, { Schema, Types } from 'mongoose'
import lodash from 'lodash-es'
import User from './User.js'
import { toObjectId } from '../utils/id.js'

const courseSchema = new Schema<CourseSchemaType>(
	{
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
			default: 0,
		},
		archived: {
			type: Boolean,
			default: false,
		},
		intervals: {
			type: [Number],
			default: () => [1, 7, 14, 28],
		},
		order: {
			type: Number,
			required: true,
		},
	},
	{
		id: false,
		timestamps: true,
	}
)

export const Course = mongoose.model<CourseSchemaType>('Course', courseSchema)

const lookupStage = {
	$lookup: {
		from: 'progresses',
		localField: '_id',
		foreignField: 'course',
		let: { c: '$$CURRENT' },
		pipeline: [
			createProgressProjectStage('$$CURRENT', '$$c'),
			createSortStage(),
		],
		as: 'progresses',
	},
}

const progressIsDueFilter = {
	$filter: {
		input: '$progresses',
		as: 'item',
		cond: { $eq: ['$$item.isDue', true] },
	},
}

const dueCountField = {
	$size: progressIsDueFilter,
}

const isDueField = {
	$and: [
		{
			$gt: [
				{
					$size: progressIsDueFilter,
				},
				0,
			],
		},
		{ $ne: ['$archived', true] },
		{ $ne: ['$status', CourseStatus.Done] },
	],
}

const projectFields = {
	name: 1,
	owner: 1,
	status: 1,
	archived: 1,
	intervals: 1,
	order: 1,
	createdAt: 1,
	updatedAt: 1,
	dueCount: dueCountField,
	isDue: isDueField,
	progressCount: { $size: '$progresses' },
}

function createProjectField(options?: {
	withProgresses?: boolean
	withDueProgresses?: boolean
}) {
	const project: any = { ...projectFields }
	if (options?.withProgresses) project.progresses = '$progresses'
	if (options?.withDueProgresses) project.dueProgresses = progressIsDueFilter
	return project
}

function createProjectStage(options?: {
	withProgresses?: boolean
	withDueProgresses?: boolean
}) {
	return {
		$project: createProjectField(options),
	}
}

/**
 * fetch a course by id
 */
export async function fetch(
	courseId: Types.ObjectId,
	options?: {
		withProgresses?: boolean
		userId?: Types.ObjectId
	}
) {
	const { withProgresses, userId } = lodash.assign(
		{},
		{ withProgresses: false, userId: null },
		options
	)
	let result
	if (!withProgresses) {
		const filter = { _id: courseId } as CourseSchemaType
		if (userId) filter.owner = userId
		result = await Course.aggregate([
			{ $match: filter },
			lookupStage,
			createProjectStage(),
		])
	} else {
		const filter = { _id: courseId } as CourseSchemaType
		if (userId) filter.owner = userId
		result = await Course.aggregate([
			{ $match: filter },
			lookupStage,
			createProjectStage({ withProgresses: true }),
		])
	}

	if (result.length > 0) {
		return result[0]
	} else {
		throw Error('Course Not Found')
	}
}

export async function fetchAll(rawUserId: string) {
	const result = await Course.aggregate([
		{ $match: { owner: toObjectId(rawUserId) } },
		lookupStage,
		createProjectStage(),
	])
	return result
}

/**
 * fetch due course for a user
 */
export async function fetchDue(userId: Types.ObjectId) {
	return await Course.aggregate([
		{ $match: { owner: userId } },
		lookupStage,
		createProjectStage({ withDueProgresses: true }),
		{ $match: { isDue: true } },
	])
}

export async function create(newCourse: NewCourse) {
	const user = await User.findById(newCourse.owner)

	if (user) {
		const course = new Course(newCourse)
		await course.save()
		return await fetch(course._id)
	} else {
		throw Error('User not found.')
	}
}

export async function del(
	_id: Types.ObjectId,
	options?: {
		userId?: Types.ObjectId
	}
) {
	const filter: any = { _id }
	if (options?.userId) filter.owner = options.userId
	return !!(await Course.findOneAndDelete({ _id }))
}

export async function update(
	_id: Types.ObjectId,
	updateCourse: UpdateCourse,
	options?: {
		userId?: Types.ObjectId
	}
) {
	const course = await Course.findById(_id)
	if (!course) throw new Error('Course not found.')

	if (options?.userId && !course.owner.equals(options?.userId))
		throw new Error('Not authorized.')

	for (const [key, value] of lodash.entries(updateCourse)) {
		(course as any)[key] = value
	}
	await course.save()
	return await fetch(_id)
}
