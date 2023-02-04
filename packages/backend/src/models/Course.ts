import { courseStatusIndices, NewCourse, UpdateCourse } from 'shared'
import mongoose, { Schema } from 'mongoose'
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
		// autopopulate: true
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
	order: {
		type: Number,
		required: true
	},
}, {
	id: false,
	timestamps: true,
})

export const Course = mongoose.model<CourseType>('Course', courseSchema)

const lookupStage = {
	$lookup: {
		from: 'progresses',
		localField: '_id',
		foreignField: 'course',
		as: 'progresses',
	},
}

const projectStage = 
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
	}
}

function toObjectId(id: string | mongoose.Types.ObjectId) {
	if (typeof id === 'string') return new mongoose.Types.ObjectId(id)
	return id
}

function createCourseProjection(rawCourseId: string | mongoose.Types.ObjectId) {
	const courseId = toObjectId(rawCourseId)
	return [{ $match: { _id: courseId } }, lookupStage, projectStage]
}


function createDueCourseProjection(rawUserId: string | mongoose.Types.ObjectId) {
	const userId = toObjectId(rawUserId)
	return [{ $match: { owner: userId } }, {$lookup: {
		from: 'progresses',
		localField: '_id',
		foreignField: 'course',
		as: 'progresses',
	}}, 
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
			dueProgresses: {$filter: {
				input: '$progresses',
				as: 'item',
				cond: { $eq: ['$$item.isDue', true] },
			}},
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
		}
	}, {$match: {isDue: true}}]
}

/**
 * fetch a course by id
 */
export async function fetch(rawCourseId: string, options = {
	withProgresses: false
}) {
	let result
	if (!options.withProgresses) {
		result = await Course.aggregate(createCourseProjection(rawCourseId))
	} else {
		const courseId = toObjectId(rawCourseId)
		result = await Course.aggregate( [{ $match: { _id: courseId } }, lookupStage, {
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
				progresses: '$progresses'
			}
		}])
	}

	if (result.length > 0) {
		return result[0]
	} else {
		throw Error('Course Not Found')
	}
}

/**
 * fetch due course for a user
 */
export async function fetchDue(userId: string) {
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
		
export async function del(_id: string) {
	return !!(await Course.findByIdAndDelete(_id))
}

export async function update(_id: string, updateCourse: UpdateCourse) {
	const course = await Course.findById(_id)
	if (!course) throw new Error('Course not found.')
	for (const [key, value] of lodash.entries(updateCourse)) {
		(course as any)[key] = value
	}
	await course.save()
	return fetch(_id)
}