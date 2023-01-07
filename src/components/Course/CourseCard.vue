<script setup lang="ts">
import { type Course, CourseStatus } from "@/types/course.type";
import dayjs from "dayjs/esm";
import relativeTime from "dayjs/esm/plugin/relativeTime";
import { computed } from "vue";
import { toggleArchive, toggleStatus, del } from "@/database/course";

dayjs.extend(relativeTime);

const props = defineProps<{
  course: Course;
}>();

const isInProgress = computed(
  () => props.course.status === CourseStatus["In Progress"]
);

const isArchived = computed(() => props.course.archived);

const createdTime = computed(() => {
  const now = dayjs();
  const created = dayjs(props.course.createdAt);

  const difference = now.diff(created, "day");

  if (difference < 7) return created.fromNow();
  return created.format("YYYY-MM-DD");
});
</script>

<template>
  <div>
    <li grid grid-rows-2 grid-cols-5 gap-2 items-center>
      <el-tooltip
        class="box-item"
        :content="isArchived ? 'Unarchive' : 'Archive'"
        placement="top"
      >
        <button
          row-span-2
          text-size-3xl
          justify-self-center
          cursor-pointer
          hover:text-lime-500
          :aria-label="isArchived ? 'Unarchive' : 'Archive'"
        >
          <div
            v-if="!isArchived"
            i-mdi-archive
            @click="toggleArchive(course.id)"
          ></div>
          <div
            v-else
            i-mdi-archive-cancel
            @click="toggleArchive(course.id)"
          ></div>
        </button>
      </el-tooltip>
      <el-tooltip
        v-if="!isArchived"
        class="box-item"
        :content="isInProgress ? 'Mark as done' : 'Mark as in progress'"
        placement="top"
      >
        <button
          row-span-2
          text-size-3xl
          justify-self-center
          cursor-pointer
          hover:text-lime-500
          :aria-label="isInProgress ? 'Mark as done' : 'Mark as in progress'"
        >
          <div
            v-if="isInProgress"
            i-ic-round-done
            @click="toggleStatus(course.id)"
          ></div>
          <div v-else i-mdi-undo @click="toggleStatus(course.id)"></div>
        </button>
      </el-tooltip>
      <el-tooltip v-else class="box-item" content="Delete" placement="top">
        <button
          row-span-2
          text-size-3xl
          justify-self-center
          cursor-pointer
          hover:text-lime-500
          i-ic-round-delete-forever
          @click="del(course.id)"
          aria-label="delete"
        ></button>
      </el-tooltip>
      <RouterLink
        link-decoration-none
        :to="{ name: 'course', params: { id: course.id } }"
        col-span-3
      >
        <h3 m-0 data-test="course-name" cursor-pointer hover:text-lime-500>
          {{ course.name }}
        </h3>
      </RouterLink>
      <time col-span-3 :datetime="dayjs(course.createdAt).toISOString()">{{
        createdTime
      }}</time>
    </li>
  </div>
</template>
