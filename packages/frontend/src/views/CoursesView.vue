<script setup lang="ts">
import { useCourses } from "@/database/course";
import { CourseStatus } from "@/types/course.type";
import CourseCard from "@/components/Course/CourseCard.vue";
import { useArrayFilter } from "@vueuse/shared";

const courses = useCourses();
const coursesInProgress = useArrayFilter(
  courses,
  (course) =>
    course.status === CourseStatus["In Progress"] && course.archived === false
);

const coursesDone = useArrayFilter(
  courses,
  (course) => course.status === CourseStatus.Done && course.archived === false
);

const coursesArchived = useArrayFilter(courses, (course) => course.archived);
</script>
<template>
  <div>
    <h2 text-center>All Courses</h2>
    <ul list-none>
      <li>
        <h3 text-center>In Progress</h3>
        <ul
          list-none
          grid
          grid-cols-2
          gap-6
          p-4
          v-if="coursesInProgress.length"
          data-test="in-progress-courses"
        >
          <CourseCard
            :course="course"
            v-for="course in coursesInProgress"
            :key="course.id"
          />
        </ul>
        <el-empty v-else description="No courses in progress yet." />
      </li>
      <li>
        <h2 text-center>Done</h2>
        <ul list-none grid grid-cols-2 gap-6 p-4 v-if="coursesDone.length">
          <CourseCard
            :course="course"
            v-for="course in coursesDone"
            :key="course.id"
          />
        </ul>
        <el-empty v-else description="No courses have been done yet." />
      </li>
      <li>
        <h2 text-center>Archived</h2>
        <ul list-none grid grid-cols-2 gap-6 p-4 v-if="coursesArchived.length">
          <CourseCard
            :course="course"
            v-for="course in coursesArchived"
            :key="course.id"
          />
        </ul>
        <el-empty v-else description="No courses have been archived yet." />
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
