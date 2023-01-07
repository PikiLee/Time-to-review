import { useCourses } from "./../database/course";
import { useRoute } from "vue-router";
import { useArrayFind } from "@vueuse/core";

export function useCourse() {
  const route = useRoute();
  const courseIdString =
    typeof route.params.id === "string" ? route.params.id : route.params.id[1];
  const courseId = Number(courseIdString);
  const courses = useCourses();
  return useArrayFind(courses, (course) => course.id === courseId);
}
