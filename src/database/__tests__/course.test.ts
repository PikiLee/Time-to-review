import { del, useCourses } from "./../course";
import { describe, expect, test, beforeEach } from "vitest";
import { create } from "../course";
import { CourseStatus } from "@/types/course.type";

beforeEach(() => {
  const courses = useCourses();
  courses.value = [
    {
      id: 1,
      name: "course1",
      status: CourseStatus["In Progress"],
      archived: false,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: "course2",
      status: CourseStatus["In Progress"],
      archived: false,
      createdAt: Date.now(),
    },
  ];
});

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

/**
 * Partition:
 *  course exists
 *  course not exists
 */
describe("Test delete course", () => {
  test("Cover course exists", () => {
    const courses = useCourses();
    del(1);
    expect(courses.value.findIndex((course) => course.id === 1)).toBe(-1);
  });

  test("Cover course doesn't exist.", () => {
    const courses = useCourses();
    del(0);
    expect(courses.value.length).toBe(2);
  });
});
