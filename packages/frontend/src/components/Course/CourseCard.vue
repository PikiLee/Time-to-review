<script setup lang="ts">
import { type Course, CourseStatus } from 'shared'
import dayjs from 'dayjs/esm'
import relativeTime from 'dayjs/esm/plugin/relativeTime'
import { computed } from 'vue'
import {
	toggleArchive as rawToggleArchive,
	toggleStatus as rawToggleStatus,
	del
} from '@/database/course'
import { errorMsg, successMsg } from '@/utils/useMessage'

dayjs.extend(relativeTime)

const props = defineProps<{
	course: Course
}>()

const isInProgress = computed(
	() => props.course.status === CourseStatus['In Progress']
)

const isArchived = computed(() => props.course.archived)

const createdTime = computed(() => {
	const now = dayjs()
	const created = dayjs(props.course.createdAt)

	const difference = now.diff(created, 'day')

	if (difference < 7) return created.fromNow()
	return created.format('YYYY-MM-DD')
})

async function toggleArchive(courseId: string) {
	try {
		await rawToggleArchive(courseId)
		successMsg('Action succeeded.')
	} catch (err) {
		errorMsg(`Action Failed. ${err}`)
	}
}

async function toggleStatus(courseId: string) {
	try {
		await rawToggleStatus(courseId)
		successMsg('Action succeeded.')
	} catch (err) {
		errorMsg(`Action Failed. ${err}`)
	}
}
</script>

<template>
	<div data-testid="course-card">
		<li grid grid-rows-2 grid-cols-5 gap-2 items-center>
			<el-tooltip
				class="box-item"
				:content="isArchived ? $t('components.course.courseCard.markUnarchived') : $t('components.course.courseCard.markArchived')"
				placement="top"
			>
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					:aria-label="isArchived ? $t('components.course.courseCard.markUnarchived') : $t('components.course.courseCard.markArchived')"
					data-testid="course-card-toggle-archive"
				>
					<div
						v-if="!isArchived"
						i-mdi-archive
						@click="toggleArchive(course._id)"
					></div>
					<div
						v-else
						i-mdi-archive-cancel
						@click="toggleArchive(course._id)"
					></div>
				</button>
			</el-tooltip>
			<el-tooltip
				v-if="!isArchived"
				class="box-item"
				:content="isInProgress ? $t('components.course.courseCard.markDone') : $t('components.course.courseCard.markInProgress')"
				placement="top"
			>
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					:aria-label="isInProgress ? $t('components.course.courseCard.markDone') : $t('components.course.courseCard.markInProgress')"
					data-testid="course-card-toggle-status"
				>
					<div
						v-if="isInProgress"
						i-ic-round-done
						@click="toggleStatus(course._id)"
					></div>
					<div v-else i-mdi-undo @click="toggleStatus(course._id)"></div>
				</button>
			</el-tooltip>
			<el-tooltip v-else class="box-item" :content="$t('components.course.courseCard.delete')" placement="top">
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					i-ic-round-delete-forever
					@click="del(course._id)"
					:aria-label="$t('components.course.courseCard.delete')"
					data-testid="course-card-delete"
				></button>
			</el-tooltip>
			<RouterLink
				link-decoration-none
				:to="{ name: 'course', params: { id: course._id } }"
				col-span-3
			>
				<h3
					m-0
					data-test="course-name"
					cursor-pointer
					hover:text-lime-500
					data-testid="course-card-name"
				>
					{{ course.name }}
				</h3>
			</RouterLink>
			<time col-span-3 :datetime="dayjs(course.createdAt).toISOString()">{{
				createdTime
			}}</time>
		</li>
	</div>
</template>
