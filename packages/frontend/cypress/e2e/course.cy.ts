import { generateAuthInfo } from "shared";

beforeEach(() => {
	const { username, password } = generateAuthInfo();
	cy.register(username, password);
});

describe("course", () => {
	it("create course", () => {
		const courseName = Math.random().toString();

		cy.createCourse(courseName);
	});

	it("create progress", () => {
		const courseName = Math.random().toString();
		const progressName = Math.random().toString();

		cy.createCourse(courseName);
		cy.createProgress(progressName);
	});

	it("update progress", () => {
		const courseName = Math.random().toString();
		const progressName = Math.random().toString();

		cy.createCourse(courseName);
		cy.createProgress(progressName);

		// update progress
		const newProgressName = Math.random().toString();

		cy.get('[data-testid="progress-list-item"]').last().click();
		cy.get('[data-testid="progress-list-item-name-input"]').type(
			`{selectAll}{del}${newProgressName}`
		);
		cy.get('[data-testid="progress-list-item-confirm"]').click();

		cy.get('[data-testid="progress-list-item-name"]')
			.last()
			.should("have.text", newProgressName);
	});

	it("delete progress", () => {
		const courseName = Math.random().toString();
		const progressName = Math.random().toString();

		cy.createCourse(courseName);
		cy.createProgress(progressName);
		// delete progress
		cy.get(`[data-testid="progress-list-item"]`).click();
		cy.get(`[data-testid="progress-list-item-delete"]`).click();
		cy.get(`[data-testid="progress-list-item"]`).should("not.exist");
	});

	it("toggle archive", () => {
		const courseName = Math.random().toString();

		cy.createCourse(courseName);

		cy.get(`[data-testid="course-card-toggle-archive"]`).click();
		cy.get(`[data-testid="courses-view-in-progress-courses"]`).should(
			"not.contain",
			courseName
		);
		cy.get(`[data-testid="courses-view-archived-courses"]`).contains(
			courseName
		);

		//reverse
		cy.get(`[data-testid="course-card-toggle-archive"]`).click();
		cy.get(`[data-testid="courses-view-archived-courses"]`).should(
			"not.contain",
			courseName
		);
		cy.get(`[data-testid="courses-view-in-progress-courses"]`).contains(
			courseName
		);
	});

	it("toggle status", () => {
		const courseName = Math.random().toString();

		cy.createCourse(courseName);

		cy.get(`[data-testid="course-card-toggle-status"]`).click();
		cy.get(`[data-testid="courses-view-in-progress-courses"]`).should(
			"not.contain",
			courseName
		);
		cy.get(`[data-testid="courses-view-done-courses"]`).contains(courseName);

		// reverse
		cy.get(`[data-testid="course-card-toggle-status"]`).click();
		cy.get(`[data-testid="courses-view-done-courses"]`).should(
			"not.contain",
			courseName
		);
		cy.get(`[data-testid="courses-view-in-progress-courses"]`).contains(
			courseName
		);
	});

	it("delete course", () => {
		const courseName = Math.random().toString();

		cy.createCourse(courseName);

		cy.get(`[data-testid="course-card-toggle-archive"]`).click();
		cy.get(`[data-testid="courses-view-in-progress-courses"]`).should(
			"not.contain",
			courseName
		);
		cy.get(`[data-testid="courses-view-archived-courses"]`).contains(
			courseName
		);

		cy.get(`[data-testid="course-card-delete"]`).click();
		cy.get(`[data-testid="courses-view"]`).should("not.contain", courseName);
	});
});
