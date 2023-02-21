import { generateAuthInfo } from 'shared'
import { beforeEach, it } from 'local-cypress'
import {
	assertUserIsLogin,
	mockEndpoint,
	goToRegisterPage,
	register,
	assertInHomePage,
	assertDisplay,
	assertNotDisplay,
	goToCoursesPage,
	createCourse,
	markAsDone,
	goToDoneTab,
	goToInProgressTab,
	markAsInProgress,
	markAsArchived,
	goToArchivedTab,
	unarchive,
	deleteCourse
} from '../utils'
import * as authPreconditions from '../../src/__test__/preconditions/auth'
import * as coursePreconditions from '../../src/__test__/preconditions/course'

beforeEach(() => {
	const { username, password } = generateAuthInfo()
	authPreconditions.registerSucceed({ mockEndpoint, username })
	authPreconditions.usernameNotExist({ mockEndpoint })
	goToRegisterPage()
	register(username, password)
	assertUserIsLogin(username)
	assertInHomePage()
})

describe('create a course', () => {
	it('should display course if create a new course', () => {
		const courseName = 'new course'
		coursePreconditions.createCourseSucceed({ mockEndpoint, courseName })
		coursePreconditions.hasCourses({ mockEndpoint })
		goToCoursesPage()
		createCourse(courseName)
		assertDisplay(courseName)
	})

	it(`should error if course name'length is less than 1`, () => {
		const courseName = 'new course'
		coursePreconditions.createCourseSucceed({ mockEndpoint, courseName })
		coursePreconditions.hasCourses({ mockEndpoint })
		goToCoursesPage()
		createCourse('a{backspace}')
		assertDisplay('Length should be 1 to 60.')
	})

	it(`should error if course name'length is longer than 60`, () => {
		const courseName = 'new course'
		coursePreconditions.createCourseSucceed({ mockEndpoint, courseName })
		coursePreconditions.hasCourses({ mockEndpoint })
		goToCoursesPage()
		createCourse('a'.repeat(61))
		assertDisplay('Length should be 1 to 60.')
	})

	it(`should error if course name'length is longer than 0 and shoter than 61`, () => {
		const courseName = 'new course'
		coursePreconditions.createCourseSucceed({ mockEndpoint, courseName })
		coursePreconditions.hasCourses({ mockEndpoint })
		goToCoursesPage()
		createCourse('a'.repeat(60))
		assertNotDisplay('Length should be 1 to 60.')
	})

	it(`should error if course name'length is longer than 0 and shoter than 61`, () => {
		const courseName = 'a'
		coursePreconditions.createCourseSucceed({ mockEndpoint, courseName })
		coursePreconditions.hasCourses({ mockEndpoint })
		goToCoursesPage()
		createCourse(courseName)
		assertNotDisplay('Length should be 1 to 60.')
	})

	it('should show error if 400', () => {
		const courseName = 'new course'
		coursePreconditions.createCourseFail({ mockEndpoint })
		coursePreconditions.hasCourses({ mockEndpoint })
		goToCoursesPage()
		createCourse(courseName)
		assertDisplay('Failed to create course.')
	})
})

describe('toggle status, archived', () => {
	it(`should have progress go to Done tab if click mark as done`, () => {
		const courseName = 'Introduction to Python'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate: { name: courseName, status: 1 }
		})
		goToCoursesPage()
		markAsDone(courseName)
		goToDoneTab()
		assertDisplay(courseName)
	})

	it(`should have progress go to Archived tab if click mark as archived`, () => {
		const courseName = 'Introduction to Python'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate: { name: courseName, archived: true }
		})
		goToCoursesPage()
		markAsArchived(courseName)
		goToArchivedTab()
		assertDisplay(courseName)
	})

	it(`should have progress go to In Progress tab if click mark as in progress in Done tab`, () => {
		const courseName = 'Machine Learning Fundamentals'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate: { name: courseName, status: 0 }
		})
		goToCoursesPage()
		goToDoneTab()
		markAsInProgress(courseName)
		goToInProgressTab()
		assertDisplay(courseName)
	})

	it(`should have progress go to Archivied tab if click mark as archived in Done tab`, () => {
		const courseName = 'Machine Learning Fundamentals'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate: { name: courseName, status: 0 }
		})
		goToCoursesPage()
		goToDoneTab()
		markAsArchived(courseName)
		goToArchivedTab()
		assertDisplay(courseName)
	})

	it(`should have progress go to In Progress tab if click mark as in progress in Archived tab`, () => {
		const courseName = 'Introduction to SQL'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate: { name: courseName, status: 0 }
		})
		goToCoursesPage()
		goToArchivedTab()
		unarchive(courseName)
		goToInProgressTab()
		assertDisplay(courseName)
	})

	it(`should have progress go to In Done tab if click mark as in progress in Archived tab`, () => {
		const courseName = 'Computer Networking'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.updateCourseSucceed({
			mockEndpoint,
			courseName,
			courseToUpdate: { name: courseName, archived: false }
		})
		goToCoursesPage()
		goToArchivedTab()
		unarchive(courseName)
		goToDoneTab()
		assertDisplay(courseName)
	})

	it(`should delete progress if click delete button in Archived tab`, () => {
		const courseName = 'Computer Networking'
		coursePreconditions.hasCourses({ mockEndpoint })
		coursePreconditions.deleteCourseSucceed({
			mockEndpoint
		})
		goToCoursesPage()
		goToArchivedTab()
		deleteCourse(courseName)
		assertNotDisplay(courseName)
	})

	describe('handle errors', () => {
		describe('handle 400', () => {
			const updateError = 'Failed to update course.'
			it(`should show error if mark as done failed`, () => {
				const courseName = 'Introduction to Python'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 400
				})
				goToCoursesPage()
				markAsDone(courseName)
				assertDisplay(updateError)
				assertDisplay(courseName)
			})

			it(`should show error if mark as archived failed`, () => {
				const courseName = 'Introduction to Python'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 400
				})
				goToCoursesPage()
				markAsArchived(courseName)
				assertDisplay(updateError)
				assertDisplay(courseName)
			})

			it(`should show error if mark as in progress failed in Done Tab`, () => {
				const courseName = 'Machine Learning Fundamentals'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 400
				})
				goToCoursesPage()
				goToDoneTab()
				markAsInProgress(courseName)
				assertDisplay(updateError)
				assertDisplay(courseName)
			})

			it(`should show error if mark as archived failed in Done Tab`, () => {
				const courseName = 'Machine Learning Fundamentals'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 400
				})
				goToCoursesPage()
				goToDoneTab()
				markAsArchived(courseName)
				assertDisplay(updateError)
				assertDisplay(courseName)
			})

			it(`should show error if unarchive failed in Archived Tab`, () => {
				const courseName = 'Introduction to SQL'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 400
				})
				goToCoursesPage()
				goToArchivedTab()
				unarchive(courseName)
				assertDisplay(updateError)
				assertDisplay(courseName)
			})
		})

		describe('handle 404', () => {
			const notFoundEror = 'Course does not exist.'
			it(`should show error if mark as done failed`, () => {
				const courseName = 'Introduction to Python'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 404
				})
				goToCoursesPage()
				markAsDone(courseName)
				assertDisplay(notFoundEror)
				assertDisplay(courseName)
			})

			it(`should show error if mark as archived failed`, () => {
				const courseName = 'Introduction to Python'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 404
				})
				goToCoursesPage()
				markAsArchived(courseName)
				assertDisplay(notFoundEror)
				assertDisplay(courseName)
			})

			it(`should show error if mark as in progress failed in Done Tab`, () => {
				const courseName = 'Machine Learning Fundamentals'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 404
				})
				goToCoursesPage()
				goToDoneTab()
				markAsInProgress(courseName)
				assertDisplay(notFoundEror)
				assertDisplay(courseName)
			})

			it(`should show error if mark as archived failed in Done Tab`, () => {
				const courseName = 'Machine Learning Fundamentals'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 404
				})
				goToCoursesPage()
				goToDoneTab()
				markAsArchived(courseName)
				assertDisplay(notFoundEror)
				assertDisplay(courseName)
			})

			it(`should show error if mark as in progress failed in Archived Tab`, () => {
				const courseName = 'Introduction to SQL'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.updateCourseFail({
					mockEndpoint,
					status: 404
				})
				goToCoursesPage()
				goToArchivedTab()
				unarchive(courseName)
				assertDisplay(notFoundEror)
				assertDisplay(courseName)
			})

			it(`should show error if delete failed in Archived Tab`, () => {
				const courseName = 'Introduction to SQL'
				coursePreconditions.hasCourses({ mockEndpoint })
				coursePreconditions.deleteCourseFail({
					mockEndpoint
				})
				goToCoursesPage()
				goToArchivedTab()
				deleteCourse(courseName)
				assertDisplay(notFoundEror)
				assertDisplay(courseName)
			})
		})
	})
})
