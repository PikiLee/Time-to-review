<script setup lang="ts">
import { type Course, CourseStatus } from 'shared'
import dayjs from 'dayjs/esm'
import relativeTime from 'dayjs/esm/plugin/relativeTime'
import { computed } from 'vue'
import { useCreatedTime } from '@/utils/useDayjs'
import { createUnitTestIdGetter } from '@/unit/utils'
import { useI18n } from 'vue-i18n'
import { messages } from 'shared'

dayjs.extend(relativeTime)

const props = defineProps<{
	course: Course
}>()
const emit = defineEmits(['delete', 'toggle:archive', 'toggle:status'])

const NAME_SPACE = 'course-card'
const getUnitTestId = createUnitTestIdGetter(NAME_SPACE)

const { t } = useI18n({
	messages: {
		en: {
			markDone: 'Mark As Done',
			markInProgress: 'Mark As In Progress',
			markArchived: 'Mark As Archived',
			markUnarchived: 'Unarchive'
		},
		'zh-Hans': {
			markDone: '标记为完成',
			markInProgress: '标记为进行中',
			markArchived: '归档',
			markUnarchived: '撤销归档'
		}
	},
	sharedMessages: messages
})

const isInProgress = computed(
	() => props.course.status === CourseStatus['In Progress']
)

const isArchived = computed(() => props.course.archived)

const { createdTime } = useCreatedTime(props.course.createdAt)
</script>

<template>
	<el-card
		data-testid="course-card"
		:data-test-unit="getUnitTestId('wrapper')"
		select-none
		role="course"
		:aria-label="course.name"
	>
		<li grid grid-rows-2 grid-cols-5 gap-2 items-center>
			<el-tooltip
				:content="isArchived ? t('markUnarchived') : t('markArchived')"
				placement="top"
			>
				<!-- Archive Button -->
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					:aria-label="
						isArchived ? t('markUnarchived') : t('markArchived')
					"
					data-testid="course-card-toggle-archive"
				>
					<div
						v-if="!isArchived"
						i-mdi-archive
						@click="emit('toggle:archive', course._id)"
						:data-test-unit="getUnitTestId('archive')"
					></div>
					<div
						v-else
						i-mdi-archive-cancel
						class="translate-y-0.25"
						@click="emit('toggle:archive', course._id)"
						:data-test-unit="getUnitTestId('unarchive')"
					></div>
				</button>
			</el-tooltip>
			<el-tooltip
				v-if="!isArchived"
				class="box-item"
				:content="isInProgress ? t('markDone') : t('markInProgress')"
				placement="top"
			>
				<!-- Toggle Status Button -->
				<button
					row-span-2
					text-size-3xl
					justify-self-center
					cursor-pointer
					hover:text-lime-500
					:aria-label="
						isInProgress ? t('markDone') : t('markInProgress')
					"
					data-testid="course-card-toggle-status"
				>
					<div
						v-if="isInProgress"
						i-ic-round-done
						@click="emit('toggle:status', course._id)"
						:data-test-unit="getUnitTestId('done')"
					></div>
					<div
						v-else
						i-mdi-undo
						@click="emit('toggle:status', course._id)"
						:data-test-unit="getUnitTestId('undone')"
					></div>
				</button>
			</el-tooltip>
			<el-tooltip
				v-else
				class="box-item"
				:content="$t('actions.delete')"
				placement="top"
			>
				<!-- Delete Button -->
				<button
					row-span-2
					text-3xl
					justify-self-center
					cursor-pointer
					align-middle
					hover:text-lime-500
					@click="emit('delete', course._id)"
					:aria-label="$t('actions.delete')"
					data-testid="course-card-delete"
					:data-test-unit="getUnitTestId('delete')"
				>
					<div i-ic-round-delete-forever></div>
				</button>
			</el-tooltip>

			<!-- Name -->
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
						:data-test-unit="getUnitTestId('badge')"
					>
						<div w-full>
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
	</el-card>
</template>
