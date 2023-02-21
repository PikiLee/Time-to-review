import { assign } from 'lodash-es'
import {
	getCourseEndpoints,
	type Progress,
	type UpdateCourse,
	type UpdateProgress
} from 'shared'
import type { MockEndPoint } from '../mock-endpoint'
import * as courseData from './courseData'

export function createCourseSucceed({
	mockEndpoint,
	courseName
}: {
	mockEndpoint: MockEndPoint
	courseName: string
}) {
	const endpoint = getCourseEndpoints.createCourse()
	mockEndpoint(endpoint.path, {
		body: assign({}, courseData.newCourse, { name: courseName }),
		httpVerb: endpoint.method
	})
}

export function createCourseFail({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getCourseEndpoints.createCourse()
	mockEndpoint(endpoint.path, {
		status: 400,
		body: {},
		httpVerb: endpoint.method
	})
}

export function updateCourseSucceed({
	mockEndpoint,
	courseName,
	courseToUpdate
}: {
	mockEndpoint: MockEndPoint
	courseName: string
	courseToUpdate: UpdateCourse
}) {
	const endpoint = getCourseEndpoints.updateCourse()
	mockEndpoint(endpoint.path, {
		body: assign(
			{},
			courseData.courses.filter((c) => c.name === courseName)[0],
			courseToUpdate
		),
		httpVerb: endpoint.method
	})
}

export function updateCourseFail({
	mockEndpoint,
	status
}: {
	mockEndpoint: MockEndPoint
	status: number
}) {
	const endpoint = getCourseEndpoints.updateCourse()
	mockEndpoint(endpoint.path, {
		status: status,
		body: {},
		httpVerb: endpoint.method
	})
}

export function deleteCourseSucceed({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getCourseEndpoints.deleteCourse()
	mockEndpoint(endpoint.path, {
		body: {
			deleted: true
		},
		httpVerb: endpoint.method
	})
}

export function deleteCourseFail({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getCourseEndpoints.deleteCourse()
	mockEndpoint(endpoint.path, {
		status: 404,
		body: {},
		httpVerb: endpoint.method
	})
}

export function hasCourses({
	mockEndpoint,
	amount = 6
}: {
	mockEndpoint: MockEndPoint
	amount?: number
}) {
	const courses = courseData.courses.slice(0, amount)
	const endpoint = getCourseEndpoints.getAllCourses()
	mockEndpoint(endpoint.path, {
		body: courses
	})
	const endpoint2 = getCourseEndpoints.getCourse()
	for (const course of courses) {
		mockEndpoint(endpoint2.path, {
			body: course,
			httpVerb: endpoint2.method
		})
	}
}

export function createProgressSucceed({
	mockEndpoint,
	progressName
}: {
	mockEndpoint: MockEndPoint
	progressName: string
}) {
	const endpoint = getCourseEndpoints.createProgress()
	mockEndpoint(endpoint.path, {
		body: assign({}, courseData.newProgress, { name: progressName }),
		httpVerb: endpoint.method
	})
}

export function createProgressFail({
	mockEndpoint,
	status
}: {
	mockEndpoint: MockEndPoint
	status: number
}) {
	const endpoint = getCourseEndpoints.createProgress()
	mockEndpoint(endpoint.path, {
		status: status,
		body: {},
		httpVerb: endpoint.method
	})
}

export function updateProgressSucceed({
	mockEndpoint,
	progressName,
	progressToUpdate
}: {
	mockEndpoint: MockEndPoint
	progressName: string
	progressToUpdate: Partial<Progress>
}) {
	const endpoint = getCourseEndpoints.updateProgress()
	mockEndpoint(endpoint.path, {
		body: assign(
			{},
			courseData.progresses.filter((p) => p.name === progressName)[0],
			progressToUpdate
		),
		httpVerb: endpoint.method
	})
}

export function updateProgressFail({
	mockEndpoint,
	status
}: {
	mockEndpoint: MockEndPoint
	status: number
}) {
	const endpoint = getCourseEndpoints.updateProgress()
	mockEndpoint(endpoint.path, {
		status: status,
		body: {},
		httpVerb: endpoint.method
	})
}

export function deleteProgressSucceed({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getCourseEndpoints.deleteProgress()
	mockEndpoint(endpoint.path, {
		body: {
			deleted: true
		},
		httpVerb: endpoint.method
	})
}

export function deleteProgressFail({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getCourseEndpoints.deleteProgress()
	mockEndpoint(endpoint.path, {
		status: 404,
		body: {},
		httpVerb: endpoint.method
	})
}

export function hasProgresses({
	mockEndpoint
}: {
	mockEndpoint: MockEndPoint
}) {
	const endpoint = getCourseEndpoints.getAllProgress()
	mockEndpoint(endpoint.path, {
		body: courseData.progresses
	})

	const endpoint2 = getCourseEndpoints.getProgress()
	for (const progress of courseData.progresses) {
		mockEndpoint(endpoint2.path, {
			body: progress,
			httpVerb: endpoint2.method
		})
	}
}
