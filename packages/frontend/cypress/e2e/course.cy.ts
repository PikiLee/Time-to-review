import { generateAuthInfo } from "shared";

before(() => {
	const { username, password } = generateAuthInfo();
	cy.register(username, password);
});

describe("course", () => {
	it("create course", () => {
		// create course
		cy.visit("/courses");
		cy.get('[data-testid="add-button"]').click();
		cy.get('[data-testid="course-creator"]').should("exist");

		cy.get('[data-testid="course-creator"]')
			.find("input")
			.type(Math.random().toString());
		cy.get('[data-testid="course-creator"]').find("button").click();

		cy.get('[data-testid="course-card"]').should("have.length", 1);

		//create progress
		cy.get('[data-testid="course-card"]:first-of-type')
			.find('[data-testid="course-card-title"]')
			.click();

		cy.url().should("contain", "/course");

		cy.get('[data-testid="add-button"]').click();
		cy.get('[data-testid="course-creator"]').should("exist");

		cy.get('[data-testid="course-creator"]')
			.find("input")
			.type(Math.random().toString());
		cy.get('[data-testid="course-creator"]').find("button").click();

		cy.get('[data-testid="progress-list-item"]').should("have.length", 1);
	});
});
