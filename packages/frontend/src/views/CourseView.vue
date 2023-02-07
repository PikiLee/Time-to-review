<script setup lang="ts">
import AddButton from '../components/AddButton.vue'
import ProgressListItem from '@/components/Progress/ProgressListItem.vue'
import { useCourseStore } from '@/store/course.store'
import Sortable from 'sortablejs'
import { onMounted, ref } from 'vue'
import type { Progress } from 'shared'
import { update } from '@/database/progress'
import { errorMsg, successMsg } from '@/utils/useMessage'
import CourseSetting from '@/components/Course/CourseSetting.vue'

const courseStore = useCourseStore()
const settingVisible = ref(false)
const dragContainerEl = ref<HTMLDivElement>()

async function  calcOrder(fromIndex: number, toIndex: number, items: Progress[]) {
	if (fromIndex === toIndex) return
	
	if (fromIndex < toIndex) {
		if (toIndex === items.length - 1) {
			items[fromIndex].order = items[toIndex].order + 100
		} else {
			items[fromIndex].order = (items[toIndex].order + items[toIndex + 1].order) * 0.5
		}
	} else {
		if (toIndex === 0) {
			items[fromIndex].order = items[toIndex].order - 100
		} else {
			items[fromIndex].order = (items[toIndex].order + items[toIndex - 1].order) * 0.5
		}
	}
	
	await update(items[fromIndex]._id, {order:  items[fromIndex].order})
}

onMounted(() => {
	const sortable = Sortable.create(dragContainerEl.value!, {
		handle: '.progress-list-item-draggable-handle',
		draggable: '.progress-list-item-draggable',
		onEnd: async function (/**Event*/evt) {
			try {
				sortable.option('disabled', true)
				if (!courseStore.currentCourse) return
				await calcOrder(evt.oldDraggableIndex!, evt.newDraggableIndex!, courseStore.currentCourse?.progresses)
				successMsg('sort succeeded.')
			} catch(err) {
				errorMsg(String(err))
			} finally {
				sortable.option('disabled', false)
			}
		},
	})
})
</script>
<template>
	<AddButton />
	<CourseSetting v-model="settingVisible"/>
	<div data-testid="course-view">
		<div v-if="courseStore.currentCourse">
			<div relative>
				<h2 text-center>{{courseStore.currentCourse.name}}</h2>
				<el-button absolute right-10 bottom-0 @click="settingVisible = true">{{$t('actions.edit')}}</el-button>
			</div>
			<ul list-none p-none v-if="courseStore.currentCourse.progresses.length">
				<li
				grid
				grid-cols-12
				items-center
				border-b
				border-b-warmgray-300
				p-2
				gap-2
				>
				<span col-span-1 sm-col-span-1></span>
				<span col-span-2 sm-col-span-2>{{$t('course.name')}}</span>
				<span col-span-3 sm-col-span-2>{{$t('course.stage')}}</span>
				<span col-span-3 sm-col-span-2>{{$t('course.lastReviewDate')}}</span>
				<span col-span-3 sm-col-span-2>{{$t('course.nextReviewDate')}}</span>
				<span col-span-0 sm-col-span-3></span>
			</li>
			
		</ul>
		<el-empty v-else :description="$t('common.empty')" />
		<div ref="dragContainerEl">
			<ProgressListItem
			v-for="progress in courseStore.currentCourse?.progresses"
			:key="progress._id"
			:progress="progress"
			/>
		</div>
	</div>
	</div>
</template>

<style scoped></style>
