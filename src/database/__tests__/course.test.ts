import { useCourses } from "./../course";
import { describe, expect, test } from "vitest";
import { create } from "../course";

/**
 * Partition:
 *  name is empty
 *  name is not empty
 */
describe("Test add course", () => {
  test("Cover name is empty", () => {
    expect(() => create("")).toThrowError();
  });

  test("Cover name is not empty.", () => {
    const courseName = "hello";
    create(courseName);
    const courses = useCourses();
    const doesContain = courses.value.some(
      (course) => course.name === courseName
    );
    expect(doesContain).toBe(true);
  });
});
