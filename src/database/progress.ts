import { ProgressStageObject } from "./../types/progress.type";
import { useCourses } from "./course";
export function create(courseId: number, name: string) {
  const courses = useCourses();
  courses.value.forEach((course) => {
    if (course.id === courseId) {
      const progress = {
        id: Math.random(),
        name,
        stage: ProgressStageObject["Just Learned"],
        lastDate: Date.now(),
      };
      course.progresses.push(progress);
    }
  });
}

export function del(courseId: number, progressId: number) {
  const courses = useCourses();
  courses.value = courses.value.map((course) => {
    if (course.id === courseId) {
      course.progresses = course.progresses.filter(
        (progress) => progress.id !== progressId
      );
      return course;
    } else {
      return course;
    }
  });
}
