import {
	courseStatusIndices,
	NewCourse,
	UpdateCourse,
	CourseSchema as CourseSchemaType,
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
		as: 'progresses',
	},
}

const projectStage = {
	$project: {
		name: 1,
		owner: 1,
		status: 1,
		archived: 1,
		order: 1,
		createdAt: 1,
		updatedAt: 1,
		dueCount: {
			$size: {
				$filter: {
					input: '$progresses',
					as: 'item',
					cond: { $eq: ['$$item.isDue', true] },
				},
			},
		},
		isDue: {
			$gt: [
				{
					$size: {
						$filter: {
							input: '$progresses',
							as: 'item',
							cond: { $eq: ['$$item.isDue', true] },
						},
					},
				},
				0,
			],
		},
		progressCount: { $size: '$progresses' },
	},
}

function createCourseProjection(rawCourseId: string | mongoose.Types.ObjectId) {
	const courseId = toObjectId(rawCourseId)
	return [{ $match: { _id: courseId } }, lookupStage, projectStage]
}

function createDueCourseProjection(
	rawUserId: string | mongoose.Types.ObjectId
) {
	const userId = toObjectId(rawUserId)
	return [
		{ $match: { owner: userId } },
		{
			$lookup: {
				from: 'progresses',
				localField: '_id',
				foreignField: 'course',
				as: 'progresses',
			},
		},
		{
			$project: {
				name: 1,
				owner: 1,
				status: 1,
				archived: 1,
				order: 1,
				createdAt: 1,
				updatedAt: 1,
				dueCount: {
					$size: {
						$filter: {
							input: '$progresses',
							as: 'item',
							cond: { $eq: ['$$item.isDue', true] },
						},
					},
				},
				dueProgresses: {
					$filter: {
						input: '$progresses',
						as: 'item',
						cond: { $eq: ['$$item.isDue', true] },
					},
				},
				isDue: {
					$gt: [
						{
							$size: {
								$filter: {
									input: '$progresses',
									as: 'item',
									cond: { $eq: ['$$item.isDue', true] },
								},
							},
						},
						0,
					],
				},
				progressCount: { $size: '$progresses' },
			},
		},
		{ $match: { isDue: true } },
	]
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
	const { withProgresses } = lodash.assign(
		{},
		{ withProgresses: false, userId: null },
		options
	)
	let result
	if (!withProgresses) {
		result = await Course.aggregate(createCourseProjection(courseId))
	} else {
		const filter = { _id: courseId } as CourseSchemaType
		if (options?.userId) filter.owner = options.userId
		result = await Course.aggregate([
			{ $match: filter },
			lookupStage,
			{
				$project: {
					name: 1,
					owner: 1,
					status: 1,
					archived: 1,
					order: 1,
					createdAt: 1,
					updatedAt: 1,
					dueCount: {
						$size: {
							$filter: {
								input: '$progresses',
								as: 'item',
								cond: { $eq: ['$$item.isDue', true] },
							},
						},
					},
					isDue: {
						$gt: [
							{
								$size: {
									$filter: {
										input: '$progresses',
										as: 'item',
										cond: { $eq: ['$$item.isDue', true] },
									},
								},
							},
							0,
						],
					},
					progressCount: { $size: '$progresses' },
					progresses: '$progresses',
				},
			},
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
		projectStage,
	])
	return result
}

/**
 * fetch due course for a user
 */
export async function fetchDue(userId: Types.ObjectId) {
	return await Course.aggregate(createDueCourseProjection(userId))
}

export async function create(newCourse: NewCourse) {
	const user = await User.findById(newCourse.owner)
	if (user) {
		const course = new Course(newCourse)
		await course.save()
		return (await Course.aggregate(createCourseProjection(course._id)))[0]
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
	return fetch(_id)
}
