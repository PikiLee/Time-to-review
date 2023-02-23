import { cy } from 'local-cypress'

/**
 * Actions
 */
export function inputUsername(username: string) {
	cy.findByLabelText('Username').type(username)
}

export function inputPassword(password: string) {
	cy.findByLabelText('Password').type(password)
}

export function assertUserIsLogin(username: string) {
	cy.findByRole('logginedUsername').should('have.text', username)
}

export function register(username: string, password: string) {
	inputUsername(username)
	inputPassword(password)
	cy.wait(2000)
	cy.findByRole('button', { name: 'Register' }).click()
}

export function login(username: string, password: string) {
	inputUsername(username)
	inputPassword(password)
	cy.wait(2000)
	cy.findByRole('button', { name: 'Login' }).click()
}

export function createCourse(courseName: string) {
	cy.findByRole('button', { name: 'Create Course' }).click()
	cy.findByLabelText('Course Name').type(courseName)
	cy.findByRole('button', { name: 'Create' }).click()
}

export function createProgress(progressName: string) {
	cy.findByRole('button', { name: 'Create Progress' }).click()
	cy.findByLabelText('Progress Name').type(progressName)
	cy.wait(1000)
	cy.findByRole('button', { name: 'Create' }).click({ force: true })
}

export function deleteCourse(courseName: string) {
	findCourse(courseName).findByRole('button', { name: 'Delete' }).click()
}

export function findCourse(courseName: string) {
	return cy.findByRole('course', { name: courseName })
}

export function markAsDone(courseName: string) {
	findCourse(courseName)
		.findByRole('button', { name: 'Mark As Done' })
		.click()
}

export function markAsInProgress(courseName: string) {
	findCourse(courseName)
		.findByRole('button', { name: 'Mark As In Progress' })
		.click()
}

export function markAsArchived(courseName: string) {
	findCourse(courseName)
		.findByRole('button', { name: 'Mark As Archived' })
		.click()
}

export function unarchive(courseName: string) {
	findCourse(courseName).findByRole('button', { name: 'Unarchive' }).click()
}

export function goToDoneTab() {
	cy.findByRole('tab', { name: 'Done' }).click()
}

export function goToArchivedTab() {
	cy.findByRole('tab', { name: 'Archived' }).click()
}

export function goToInProgressTab() {
	cy.findByRole('tab', { name: 'In Progress' }).click()
}

export function findProgress(progressName: string) {
	return cy.findByRole('progress', { name: progressName })
}

export function goToNextStage(progressName: string) {
	findProgress(progressName)
		.findByRole('button', { name: 'Next Stage', hidden: true })
		.click({ force: true })
}

export function editProgress(progressName: string) {
	findProgress(progressName)
		.findByRole('button', { name: 'Edit', hidden: true })
		.click({ force: true })
	cy.findByLabelText('Progress Name').clear().type('update progress')
	cy.findByRole('button', { name: 'Update' }).click()
}

export function editCourse() {
	cy.findByRole('button', { name: 'Edit Course' }).click()
	cy.findByLabelText('Course Name').clear().type('update course')
	cy.findByRole('button', { name: 'Update' }).click()
}

export function deleteProgress(progressName: string) {
	findProgress(progressName)
		.findByRole('button', { name: 'Edit', hidden: true })
		.click({ force: true })
	cy.findByRole('button', { name: 'Delete', hidden: true }).click()
	cy.findByRole('button', { name: 'Confirm' }).click()
}

export function deleteCourseInCoursePage() {
	cy.findByRole('button', { name: 'Edit Course' }).click()
	cy.findByRole('button', { name: 'Delete', hidden: true }).click()
	cy.findByRole('button', { name: 'Confirm' }).click()
}

/**
 * Navigations
 */
export function goToRegisterPage() {
	cy.visit('/auth/register')
}

export function goToLoginPage() {
	cy.visit('/auth/login')
}

export function goToHomePage() {
	cy.visit('/home')
}

export function goToCoursesPage() {
	cy.visit('/courses')
}

export function goToCoursePage(courseId: string) {
	cy.visit('/course/' + courseId)
}

/**
 * Assertions
 */
export function assertInHomePage() {
	cy.url().should('include', '/home')
}

export function assertInLoginPage() {
	cy.url().should('include', '/auth/login')
}

export function assertInCoursesPage() {
	cy.url().should('include', '/courses')
}

export function assertDisplay(text: string) {
	cy.findByText(text).should('be.visible')
}

export function assertNotDisplay(text: string) {
	cy.findByText(text).should('not.exist')
}

export function assertDisplayWithProgress(progressName: string, text: string) {
	cy.findByRole('progress', { name: progressName })
		.findByText(text)
		.should('be.visible')
}
