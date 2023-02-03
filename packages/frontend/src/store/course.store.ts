import { defineStore } from "pinia";
import { type Course, CourseStatus, type Progress } from "shared";
import { ref } from "vue";
import { useArrayFilter } from "@vueuse/shared";

export const useCourseStore = defineStore("course", () => {
	const courses = ref<Course[]>([]);

	const dueCourses = ref<Course[]>([]);

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

	function find(_id: string) {
		return courses.value.find((course) => course._id === _id);
	}

	function del(_id: string) {
		const idx = courses.value.findIndex((course) => course._id === _id);
		courses.value.splice(idx, 1);
	}

	function replaceCourse(replace: Course) {
		const course = find(replace._id);
		if (course) {
			courses.value = courses.value.map((course) => {
				if (course._id === replace._id) {
					return replace;
				} else {
					return course;
				}
			});
			return true;
		} else {
			return false;
		}
	}

	function findProgress(course: Course, _id: string) {
		return course.progresses.find((progress) => progress._id === _id);
	}

	function replaceProgress(replace: Progress) {
		const course = find(replace.course);
		if (course) {
			course.progresses = course.progresses.map((progress) => {
				if (progress._id === replace._id) {
					return replace;
				} else {
					return progress;
				}
			});
			return true;
		} else {
			return false;
		}
	}

	function delProgress(courseId: string, progressId: String) {
		const course = find(courseId);
		if (!course) return;
		const idx = course.progresses.findIndex(
			(progress) => progress._id === progressId
		);
		course.progresses.splice(idx, 1);
	}

	return {
		courses,
		dueCourses,
		coursesInProgress,
		coursesDone,
		coursesArchived,
		find,
		replaceCourse,
		del,
		findProgress,
		replaceProgress,
		delProgress,
	};
});
