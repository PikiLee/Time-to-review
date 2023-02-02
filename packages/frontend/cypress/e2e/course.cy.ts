import { generateAuthInfo } from "shared";

before(() => {
	const { username, password } = generateAuthInfo();
	cy.register(username, password);
});

describe("course", () => {
	it("create course", () => {
		cy.get('[data-testid="add-button"]').click();
		cy.get('[data-testid="course-creator"]').should("exist");

		cy.get('[data-testid="course-creator"]').find("input").type("new course");
		cy.get('[data-testid="course-creator"]').find("button").click();

		cy.get('[data-testid="course-card"]').should("have.length", 1);
	});
});
