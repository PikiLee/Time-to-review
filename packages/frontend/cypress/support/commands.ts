/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
import '@testing-library/cypress/add-commands'

declare global {
	namespace Cypress {
		interface Chainable {
			getBySelector(selector: string, ...args: any[]): Chainable<void>
			register(username: string, password: string): Chainable<void>
			login(username: string, password: string): Chainable<void>
			createCourse(name: string): Chainable<void>
			createProgress(name: string): Chainable<void>
			//   login(email: string, password: string): Chainable<void>
			//   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			//   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
			//   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
		}
	}
}

Cypress.Commands.addAll({
	getBySelector(selector: string, ...args: any[]) {
		return cy.get(`[data-testid="${selector}"]`, ...args)
	},
	register(username: string, password: string) {
		Cypress.log({
			name: 'registerByForm',
			message: `${username} | ${password}`
		})

		cy.visit('/auth/register')

		cy.get('[data-testid="register-form-username"]').type(username)
		cy.get('[data-testid="register-form-password"]').type(password)
		cy.get('[data-testid="register-form-submit"]').click()

		cy.url().should('contain', '/home')
	},
	login(username: string, password: string) {
		Cypress.log({
			name: 'loginByForm',
			message: `${username} | ${password}`
		})

		cy.visit('/auth/login')

		cy.get('[data-testid="register-form-username"]').type(username)
		cy.get('[data-testid="register-form-password"]').type(password)
		cy.get('[data-testid="register-form-submit"]').click()

		cy.get('[data-testid="app-header-username"]')
			.should('exist')
			.should('have.text', username)

		cy.url().should('contain', '/home')
	},
	createCourse(name: string) {
		cy.visit('/courses')
		cy.get('[data-testid="add-button"]').click()
		cy.get('[data-testid="creator-dialog"]').should('exist')

		cy.get('[data-testid="creator-dialog"]').find('input').type(name)
		cy.get('[data-testid="creator-dialog"]').find('button').click()

		cy.get('[data-testid="course-card-name"]')
			.last()
			.should('have.text', name)
	},
	createProgress(name: string) {
		cy.visit('/courses')
		cy.get('[data-testid="course-card"]')
			.last()
			.find('[data-testid="course-card-name"]')
			.last()
			.click()

		cy.url().should('contain', '/course')

		cy.get('[data-testid="add-button"]').click()
		cy.get('[data-testid="creator-dialog"]').should('exist')

		cy.get('[data-testid="creator-dialog"]').find('input').type(name)
		cy.get('[data-testid="creator-dialog"]').find('button').click()

		cy.get('[data-testid="progress-list-item-name"]')
			.last()
			.should('have.text', name)
	}
})

export {}
