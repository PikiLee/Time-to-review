<script setup lang="ts">
import { type Course, CourseStatus } from "@/types/course.type";
import dayjs from "dayjs/esm";
import relativeTime from "dayjs/esm/plugin/relativeTime";
import { computed } from "vue";
import { toggleArchive, toggleStatus } from "@/database/course";
import { useDark } from "@vueuse/core";

dayjs.extend(relativeTime);

const props = defineProps<{
  course: Course;
}>();

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
        :content="course.archived ? 'Unarchive' : 'Archive'"
        placement="top"
      >
        <div
          row-span-2
          text-size-3xl
          justify-self-center
          cursor-pointer
          hover:text-lime-500
        >
          <div
            v-if="!course.archived"
            i-mdi-archive
            @click="toggleArchive(course.id)"
          ></div>
          <div
            v-else
            i-mdi-archive-cancel
            @click="toggleArchive(course.id)"
          ></div>
        </div>
      </el-tooltip>
      <el-tooltip
        class="box-item"
        :content="
          course.status === CourseStatus['In Progress']
            ? 'Mark as done'
            : 'Mark as in progress'
        "
        placement="top"
      >
        <div
          row-span-2
          text-size-3xl
          justify-self-center
          cursor-pointer
          hover:text-lime-500
        >
          <div
            v-if="course.status === CourseStatus['In Progress']"
            i-ic-round-done
            @click="toggleStatus(course.id)"
          ></div>
          <div v-else i-mdi-undo @click="toggleStatus(course.id)"></div>
        </div>
      </el-tooltip>
      <h3
        col-span-3
        m-0
        data-test="course-name"
        cursor-pointer
        hover:text-lime-500
      >
        {{ course.name }}
      </h3>
      <time col-span-3 :datetime="dayjs(course.createdAt).toISOString()">{{
        createdTime
      }}</time>
    </li>
  </div>
</template>
