import { ProgressStage } from "./../types/progress.type";
import { useCourses } from "./course";
export function create(courseId: number, name: string) {
  const courses = useCourses();
  courses.value.forEach((course) => {
    if (course.id === courseId) {
      const progress = {
        id: Math.random(),
        name,
        stage: ProgressStage["Just Learned"],
        lastDate: Date.now(),
      };
      course.progresses.push(progress);
    }
  });
}
