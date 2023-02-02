import { useCourseStore } from "@/store/course.store";
import { useUserStore } from "@/store/user.store";
import { PROGRESS_URL, type NewProgress, type UpdateProgress } from "shared";
import { api } from "./api";

export async function create(courseId: string, name: string) {
	if (!name) throw Error("Please input name.");
	const userStore = useUserStore();
	if (!userStore.user) throw Error("Please login first.");

	const courseStore = useCourseStore();
	const course = courseStore.find(courseId);
	if (!course) throw Error("Can not find course");

	const newProgress: NewProgress = {
		owner: userStore.user._id,
		course: courseId,
		name,
		order: 0,
	};

	const res = await api.post(PROGRESS_URL, {
		data: newProgress,
	});

	course.progresses.push(res.data);
}

export async function update(
	progressId: string,
	updateProgress: UpdateProgress
) {
	const res = await api.put(`${PROGRESS_URL}/${progressId}`, {
		data: updateProgress,
	});

	const courseStore = useCourseStore();
	if (!courseStore.replaceProgress(res.data))
		throw new Error("Something went wrong!");

	return res.data;
}

export async function del(courseId: string, progressId: string) {
	const courseStore = useCourseStore();

	await api.delete(`${PROGRESS_URL}/${progressId}`);

	courseStore.delProgress(courseId, progressId);
}
