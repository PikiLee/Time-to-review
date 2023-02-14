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
			cy.contains('[data-testid="items"]', 'In Progress').should(
				'not.contain',
				courseName
			)
			cy.contains('[data-testid="items"]', 'Archived').should(
				'contain',
				courseName
			)

			//reverse
			cy.get('[data-testid="course-card-toggle-archive"]').last().click()
			cy.contains('[data-testid="items"]', 'In Progress').should(
				'contain',
				courseName
			)
			cy.contains('[data-testid="items"]', 'Archived').should(
				'not.contain',
				courseName
			)
		})

		it('toggle status', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			cy.visit('/courses')
			cy.get('[data-testid="course-card-toggle-status"]').last().click()
			cy.contains('[data-testid="items"]', 'In Progress').should(
				'not.contain',
				courseName
			)
			cy.contains('[data-testid="items"]', 'Done').should(
				'contain',
				courseName
			)

			// reverse
			cy.get('[data-testid="course-card-toggle-status"]').last().click()
			cy.contains('[data-testid="items"]', 'In Progress').should(
				'contain',
				courseName
			)
			cy.contains('[data-testid="items"]', 'Done').should(
				'not.contain',
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

	context('Manipulate progresses', () => {
		it('update progress', () => {
			const courseName = generateName()
			cy.login(username, password)
			cy.createCourse(courseName)
			const progressName = generateName()
			cy.createProgress(progressName)
			// update progress
			const newProgressName = generateName()
			cy.get('[data-testid="progress-list-item"]').last().click()
			cy.get('[data-testid="progress-list-item-edit"]').click({
				force: true
			})
			cy.get('[data-testid="progress-form"]')
				.find('input')
				.first()
				.type('{selectAll}{backspace}' + newProgressName)
			cy.get('[data-testid="progress-form-confirm"]').click()
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
			cy.get('[data-testid="progress-list-item-edit"]').click({
				force: true
			})
			cy.get('[data-testid="delete-button"]').click()
			cy.get('[data-testid="delete-button-confirm"]').click()

			cy.get('[data-testid="course-view"]').should(
				'not.contain',
				progressName
			)

			cy.get(`[data-testid="items-badge"]`).contains(0)
		})
	})
})
