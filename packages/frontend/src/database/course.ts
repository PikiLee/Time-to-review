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
    id: Number(Math.random().toString().substring(2)),
    name,
    status: CourseStatus["In Progress"],
    archived: false,
    createdAt: Date.now(),
    progresses: [],
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

export function del(id: number) {
  const courses = useCourses();
  courses.value = courses.value.filter((course) => course.id !== id);
}