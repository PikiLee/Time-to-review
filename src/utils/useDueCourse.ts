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
    for (const progress of course.progresses) {
      const nextDate = getNextDate(progress.lastDate, progress.stage);
      const isDue = getIsDue(nextDate);
      if (isDue) {
        haveDueProgress = true;
        break;
      }
    }

    if (haveDueProgress) {
      dueCourses.push(course);
    }
  });

  return dueCourses;
}

export const useDueCourses = reactify(getDueCourses);
