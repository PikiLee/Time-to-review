import { CourseStatus, type Course } from "./../types/course.type";
// store.js
import { createGlobalState, useStorage } from "@vueuse/core";

export const useCourses = createGlobalState(() =>
  useStorage<Course[]>("courses", [])
);

export function create(name: string) {
  if (!name) throw "Must not empty!";
  const courses = useCourses();
  const newCourse: Course = {
    id: Date.now(),
    name,
    status: CourseStatus["In Progress"],
    archived: false,
    createdAt: Date.now(),
  };
  courses.value.push(newCourse);
}
