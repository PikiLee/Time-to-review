describe("Test add course.", () => {
  it("Click add button", () => {
    cy.visit("/courses");

    const course = "new";
    cy.get('[data-test="add-course-input"]').type(course);
    cy.get('[data-test="add-course"]').click();
    cy.contains('[data-test="course-name"]', course);
  });
});
