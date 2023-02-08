import { generateAuthInfo } from 'shared'
import { generateName } from '../utils/generateName'

const { username, password } = generateAuthInfo()
before(() => {
	cy.register(username, password)
})

describe('course', () => {
	it('create course', () => {
		cy.login(username, password)
		const courseName = generateName()

		cy.createCourse(courseName)
	})

	context('Manipulate course', () => {
		it('toggle archive', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			cy.visit('/courses')
			cy.get('[data-testid="course-card-toggle-archive"]').last().click()
			cy.get('[data-testid="courses-view-in-progress-courses"]').should(
				'not.contain',
				courseName
			)
			cy.get('[data-testid="courses-view-archived-courses"]').contains(
				courseName
			)

			//reverse
			cy.get('[data-testid="course-card-toggle-archive"]').last().click()
			cy.get('[data-testid="courses-view-archived-courses"]').should(
				'not.contain',
				courseName
			)
			cy.get('[data-testid="courses-view-in-progress-courses"]').contains(
				courseName
			)
		})

		it('toggle status', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			cy.visit('/courses')
			cy.get('[data-testid="course-card-toggle-status"]').last().click()
			cy.get('[data-testid="courses-view-in-progress-courses"]').should(
				'not.contain',
				courseName
			)
			cy.get('[data-testid="courses-view-done-courses"]').contains(
				courseName
			)

			// reverse
			cy.get('[data-testid="course-card-toggle-status"]').last().click()
			cy.get('[data-testid="courses-view-done-courses"]').should(
				'not.contain',
				courseName
			)
			cy.get('[data-testid="courses-view-in-progress-courses"]').contains(
				courseName
			)
		})

		it('delete course', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			cy.visit('/courses')
			cy.get('[data-testid="course-card-toggle-archive"]').last().click()
			cy.get('[data-testid="course-card-delete"]').last().click()
			cy.get('[data-testid="courses-view"]').should(
				'not.contain',
				courseName
			)
		})
	})
})

describe('progress', () => {
	it('create progress', () => {
		const courseName = generateName()
		cy.login(username, password)
		cy.createCourse(courseName)
		const progressName = generateName()
		cy.createProgress(progressName)
	})

	context.only('Manipulate progresses', () => {
		it('update progress', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			const progressName = generateName()
			cy.createProgress(progressName)
			// update progress
			const newProgressName = generateName()
			cy.get('[data-testid="progress-list-item"]').last().click()
			cy.get('[data-testid="progress-list-item-name-input"]').type(
				`{selectAll}{del}${newProgressName}`
			)
			cy.get('[data-testid="progress-list-item-confirm"]').click()
			cy.get('[data-testid="progress-list-item-name"]')
				.last()
				.should('have.text', newProgressName)
		})
		it('delete progress', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			const progressName = generateName()
			cy.createProgress(progressName)
			cy.get('[data-testid="progress-list-item"]').last().click()
			cy.get('[data-testid="progress-list-item-delete"]').click()
			cy.get('[data-testid="course-view"]').should(
				'not.contain',
				progressName
			)
		})
	})
})
