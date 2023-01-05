<script setup lang="ts">
import { computed } from "vue";
import { useCourses } from "@/database/course";
import { CourseStatus } from "@/types/course.type";
import CourseCard from "@/components/Course/CourseCard.vue";

const courses = useCourses();
const coursesInProgress = computed(() =>
  courses.value.filter(
    (course) =>
      course.status === CourseStatus["In Progress"] && course.archived === false
  )
);

const coursesDone = computed(() =>
  courses.value.filter(
    (course) => course.status === CourseStatus.Done && course.archived === false
  )
);

const coursesArchived = computed(() =>
  courses.value.filter((course) => course.archived)
);
</script>
<template>
  <div>
    <h2>Course List</h2>
    <ul list-none>
      <li>
        <h3>In Progress</h3>
        <ul
          list-none
          grid
          grid-cols-2
          gap-6
          p-4
          data-test="in-progress-courses"
        >
          <CourseCard
            :course="course"
            v-for="course in coursesInProgress"
            :key="course.id"
          />
        </ul>
      </li>
      <li>
        <h2>Done</h2>
        <ul list-none grid grid-cols-2 gap-6 p-4>
          <CourseCard
            :course="course"
            v-for="course in coursesDone"
            :key="course.id"
          />
        </ul>
      </li>
      <li>
        <h2>Archived</h2>
        <ul list-none grid grid-cols-2 gap-6 p-4>
          <CourseCard
            :course="course"
            v-for="course in coursesArchived"
            :key="course.id"
          />
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
