import { keys } from "lodash-es";
import { useCourseStore } from "./../store/course.store";
import { useUserStore } from "./../store/user.store";
import {
	CourseStatus,
	COURSE_URL,
	type NewCourse,
	type UpdateCourse,
} from "shared";
import { api } from "./api";

export async function create(name: string) {
	if (!name) throw "Must not empty!";
	const userStore = useUserStore();
	if (!userStore.user) throw "Must login first!";
	const newCourse: NewCourse = {
		owner: userStore.user._id,
		name,
		order: 0,
	};

	const res = await api.post(COURSE_URL, {
		data: newCourse,
	});

	const courseStore = useCourseStore();
	courseStore.courses.push(res.data);
}
export async function update(courseId: string, updateCourse: UpdateCourse) {
	if (keys(updateCourse).length === 0)
		throw new Error("Something went wrong! Please refresh!");

	const res = await api.put(`${COURSE_URL}/${courseId}`, updateCourse);
	const courseStore = useCourseStore();

	if (!courseStore.replaceCourse(res.data))
		throw new Error("Something went wrong! Please refresh!");

	return res.data;
}

export function toggleArchive(_id: string) {
	const courseStore = useCourseStore();
	const course = courseStore.find(_id);
	if (!course) throw new Error("Something went wrong! Please refresh!");

	return update(_id, {
		archived: !course.archived,
	});
}

export function toggleStatus(_id: string) {
	const courseStore = useCourseStore();
	const course = courseStore.find(_id);
	if (!course) throw new Error("Something went wrong! Please refresh!");

	return update(_id, {
		status:
			course.status === CourseStatus["In Progress"]
				? CourseStatus.Done
				: CourseStatus["In Progress"],
	});
}

export async function del(_id: string) {
	await api.delete(`${COURSE_URL}/${_id}`);

	const courseStore = useCourseStore();
	courseStore.del(_id);
}

export async function fetchDue() {
	const res = await api.get(`${COURSE_URL}/due`);

	const courseStore = useCourseStore();
	courseStore.dueCourses = res.data;
}
