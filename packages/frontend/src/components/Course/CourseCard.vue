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
import { useCreatedTime } from '@/utils/useDayjs'

dayjs.extend(relativeTime)

const props = defineProps<{
	course: Course
}>()

const isInProgress = computed(
	() => props.course.status === CourseStatus['In Progress']
)

const isArchived = computed(() => props.course.archived)

const { createdTime } = useCreatedTime(props.course.createdAt)

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
				:content="
					isArchived
						? $t('components.course.courseCard.markUnarchived')
						: $t('components.course.courseCard.markArchived')
				"
				placement="top"
			>
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					:aria-label="
						isArchived
							? $t('components.course.courseCard.markUnarchived')
							: $t('components.course.courseCard.markArchived')
					"
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
						class="translate-y-0.25"
						@click="toggleArchive(course._id)"
					></div>
				</button>
			</el-tooltip>
			<el-tooltip
				v-if="!isArchived"
				class="box-item"
				:content="
					isInProgress
						? $t('components.course.courseCard.markDone')
						: $t('components.course.courseCard.markInProgress')
				"
				placement="top"
			>
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					:aria-label="
						isInProgress
							? $t('components.course.courseCard.markDone')
							: $t('components.course.courseCard.markInProgress')
					"
					data-testid="course-card-toggle-status"
				>
					<div
						v-if="isInProgress"
						i-ic-round-done
						@click="toggleStatus(course._id)"
					></div>
					<div
						v-else
						i-mdi-undo
						@click="toggleStatus(course._id)"
					></div>
				</button>
			</el-tooltip>
			<el-tooltip
				v-else
				class="box-item"
				:content="$t('actions.delete')"
				placement="top"
			>
				<button
					row-span-2
					text-3xl
					justify-self-center
					cursor-pointer
					align-middle
					hover:text-lime-500
					@click="del(course._id)"
					:aria-label="$t('actions.delete')"
					data-testid="course-card-delete"
				>
					<div i-ic-round-delete-forever></div>
				</button>
			</el-tooltip>
			<RouterLink
				link-decoration-none
				:to="{ name: 'course', params: { id: course._id } }"
				col-span-3
			>
				<h3
					m-0
					cursor-pointer
					hover:text-lime-500
					data-testid="course-card-name"
				>
					<el-badge
						:value="course.dueCount"
						v-if="course.dueCount > 0"
					>
						<div
							w-full
							text-ellipsis
							overflow-hidden
							whitespace-nowrap
						>
							{{ course.name }}
						</div>
					</el-badge>
					<div
						v-else
						w-full
						text-ellipsis
						overflow-hidden
						whitespace-nowrap
					>
						{{ course.name }}
					</div>
				</h3>
			</RouterLink>
			<time
				col-span-3
				:datetime="dayjs(course.createdAt).toISOString()"
				>{{ createdTime }}</time
			>
		</li>
	</div>
</template>
