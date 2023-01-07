import { reactify } from "@vueuse/core";
import type { Course } from "./../types/course.type";
import type { Progress } from "@/types/progress.type";
import { useCourses } from "./../database/course";
import { getNextDate } from "./useNextDate";
import { getIsDue } from "./useDue";
export function getDueCourses() {
  const courses = useCourses();
  const dueCourses: Course[] = [];
  courses.value.forEach((course) => {
    let haveDueProgress = false;
    const dueCourse = { ...course };
    const dueProgresses: Progress[] = [];
    course.progresses.forEach((progress) => {
      const nextDate = getNextDate(progress.lastDate, progress.stage);
      const isDue = getIsDue(nextDate);
      if (isDue) {
        haveDueProgress = true;
        dueProgresses.push(progress);
      }
    });

    if (haveDueProgress) {
      dueCourse.progresses = dueProgresses;
      dueCourses.push(dueCourse);
    }
  });

  return dueCourses;
}

export const useDueCourses = reactify(getDueCourses);
