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
    id: Math.random(),
    name,
    status: CourseStatus["In Progress"],
    archived: false,
    createdAt: Date.now(),
  };
  courses.value.push(newCourse);
}

export function toggleArchive(id: number) {
  const courses = useCourses();
  courses.value.forEach((course) => {
    if (course.id === id) course.archived = !course.archived;
  });
}

export function toggleStatus(id: number) {
  const courses = useCourses();
  courses.value.forEach((course) => {
    if (course.id === id)
      course.status =
        course.status === CourseStatus["In Progress"]
          ? CourseStatus.Done
          : CourseStatus["In Progress"];
  });
}
