export const newCourse = {
	_id: '609e55ba-9a7d-4a63-9f98-8d3459281c60',
	status: 0,
	type: 'course',
	owner: 'John Doe',
	name: 'Course 1',
	archived: false,
	intervals: [2, 5, 7, 14],
	createdAt: '2022-01-01T10:30:00.000Z',
	updatedAt: '2022-01-05T15:20:00.000Z',
	dueCount: 3,
	isDue: true,
	order: 6,
	progressCount: 10
}

export const courses = [
	{
		status: 0,
		_id: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		type: 'course',
		owner: 'Jane Smith',
		name: 'Introduction to Python',
		archived: false,
		intervals: [2, 5, 7],
		createdAt: '2022-02-01T13:00:00.000Z',
		updatedAt: '2022-02-10T11:15:00.000Z',
		dueCount: 1,
		isDue: true,
		order: 0,
		progressCount: 8
	},
	{
		status: 0,
		_id: 'd3508d3e-1c3b-46aa-8f8c-901743413c37',
		type: 'course',
		owner: 'Mark Johnson',
		name: 'Statistics for Data Science',
		archived: false,
		intervals: [3, 6, 9],
		createdAt: '2021-12-10T08:45:00.000Z',
		updatedAt: '2022-01-05T16:30:00.000Z',
		dueCount: 0,
		isDue: false,
		order: 1,
		progressCount: 15
	},
	{
		status: 1,
		_id: '1b8d8d96-cfc2-4232-99e3-2348d96a59a3',
		type: 'course',
		owner: 'John Smith',
		name: 'Machine Learning Fundamentals',
		archived: false,
		intervals: [2, 4, 8],
		createdAt: '2021-11-15T09:00:00.000Z',
		updatedAt: '2021-12-01T10:30:00.000Z',
		dueCount: 2,
		isDue: true,
		order: 2,
		progressCount: 7
	},
	{
		status: 1,
		_id: '6a3b6d5e-30bb-4e5c-a54c-3f3c603f9df0',
		type: 'course',
		owner: 'Mary Lee',
		name: 'Data Visualization with Tableau',
		archived: false,
		intervals: [2, 3, 6],
		createdAt: '2022-01-25T11:00:00.000Z',
		updatedAt: '2022-02-10T14:45:00.000Z',
		dueCount: 0,
		isDue: false,
		order: 3,
		progressCount: 12
	},
	{
		status: 0,
		_id: '2c9f7b8e-90ba-4353-b3c3-026b59c8cda5',
		type: 'course',
		owner: 'Tom Smith',
		name: 'Introduction to SQL',
		archived: true,
		intervals: [2, 4, 6, 8],
		createdAt: '2022-02-10T10:15:00.000Z',
		updatedAt: '2022-02-15T13:30:00.000Z',
		dueCount: 1,
		isDue: true,
		order: 4,
		progressCount: 5
	},
	{
		status: 1,
		_id: 'a5b6c7d8-e9f0-1a2b-3c4d-5e6f7a8b9c0d',
		type: 'course',
		owner: 'John Doe',
		name: 'Computer Networking',
		archived: true,
		intervals: [2, 5, 7, 14],
		createdAt: '2022-01-01T10:30:00.000Z',
		updatedAt: '2022-01-05T15:20:00.000Z',
		dueCount: 3,
		isDue: true,
		order: 5,
		progressCount: 10
	}
]

export const newProgress = {
	course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
	_id: '608f0a6ff98b480015b4f4b7',
	type: 'progress',
	owner: '1',
	name: 'Homework 5',
	createdAt: '2021-05-14T12:00:00.000Z',
	updatedAt: '2021-05-16T17:45:00.000Z',
	isDue: true,
	order: 9,
	stage: 2,
	lastDate: '2021-05-16T17:45:00.000Z',
	nextDate: '2021-05-28T12:00:00.000Z'
}

export const progresses = [
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '607eaaffafcf7a0015d6d0a7',
		type: 'progress',
		owner: '1',
		name: 'Essay 1',
		createdAt: '2021-04-20T09:00:00.000Z',
		updatedAt: '2021-04-22T14:30:00.000Z',
		isDue: true,
		order: 0,
		stage: 0,
		lastDate: '2021-04-22T14:30:00.000Z',
		nextDate: '2021-05-06T09:00:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '607eab75afcf7a0015d6d0a8',
		type: 'progress',
		owner: '1',
		name: 'Homework 3',
		createdAt: '2021-04-21T11:00:00.000Z',
		updatedAt: '2021-04-23T08:15:00.000Z',
		isDue: false,
		order: 1,
		stage: 1,
		lastDate: '2021-04-22T10:30:00.000Z',
		nextDate: '2021-05-03T11:00:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '607eabc5afcf7a0015d6d0a9',
		type: 'progress',
		owner: '1',
		name: 'Quiz 2',
		createdAt: '2021-04-22T15:30:00.000Z',
		updatedAt: '2021-04-24T13:45:00.000Z',
		isDue: true,
		order: 2,
		stage: 3,
		lastDate: '2021-04-24T13:45:00.000Z',
		nextDate: new Date().toISOString()
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '608f05c1f98b480015b4f4b1',
		type: 'progress',
		owner: '1',
		name: 'Project Proposal',
		createdAt: '2023-05-02T09:00:00.000Z',
		updatedAt: '2021-05-04T11:00:00.000Z',
		isDue: true,
		order: 3,
		stage: 2,
		lastDate: '2023-05-04T11:00:00.000Z',
		nextDate: '2023-05-09T09:00:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '608f06b0f98b480015b4f4b2',
		type: 'progress',
		owner: '1',
		name: 'Lecture 4',
		createdAt: '2021-05-04T13:30:00.000Z',
		updatedAt: '2021-05-05T10:45:00.000Z',
		isDue: false,
		order: 4,
		stage: 1,
		lastDate: '2021-05-04T10:00:00.000Z',
		nextDate: '2021-05-11T13:30:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '608f07d2f98b480015b4f4b3',
		type: 'progress',
		owner: '1',
		name: 'Homework 4',
		createdAt: '2021-05-05T12:00:00.000Z',
		updatedAt: '2021-05-07T16:30:00.000Z',
		isDue: true,
		order: 5,
		stage: 2,
		lastDate: '2021-05-07T16:30:00.000Z',
		nextDate: '2021-05-14T12:00:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '608f088df98b480015b4f4b4',
		type: 'progress',
		owner: '1',
		name: 'Midterm Exam',
		createdAt: '2021-05-07T09:00:00.000Z',
		updatedAt: '2021-05-09T14:30:00.000Z',
		isDue: true,
		order: 6,
		stage: 4,
		lastDate: '2021-05-09T14:30:00.000Z',
		nextDate: '2021-05-21T09:00:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '608f0931f98b480015b4f4b5',
		type: 'progress',
		owner: '1',
		name: 'Lecture 5',
		createdAt: '2021-05-11T13:30:00.000Z',
		updatedAt: '2021-05-12T11:15:00.000Z',
		isDue: false,
		order: 7,
		stage: 1,
		lastDate: '2021-05-11T13:30:00.000Z',
		nextDate: '2021-05-18T13:30:00.000Z'
	},
	{
		course: 'f4e7a2df-4142-4c9e-ba44-bf6f5d6d5db6',
		_id: '608f09c8f98b480015b4f4b6',
		type: 'progress',
		owner: '1',
		name: 'Lab 3',
		createdAt: '2021-05-12T14:00:00.000Z',
		updatedAt: '2021-05-13T16:30:00.000Z',
		isDue: true,
		order: 8,
		stage: 3,
		lastDate: '2021-05-13T16:30:00.000Z',
		nextDate: '2021-05-20T14:00:00.000Z'
	}
]