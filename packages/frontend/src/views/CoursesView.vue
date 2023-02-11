<script setup lang="ts">
import CourseCard from '@/components/Course/CourseCard.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import Items from '@/components/Others/ListItems.vue'
import { fetchAll } from '@/database/course'
import { useCourses } from '@/composables/useCourses'
import type { Course } from 'shared'
import AddButton from '../components/AddButton.vue'
import { ref } from 'vue'

const courses = ref<Course[]>([])

const { itemsCategoried, del, toggleArchive, toggleStatus, handleSort } =
	useCourses(courses)
</script>
<template>
	<div data-testid="courses-view">
		<AddButton :resource="{ type: 'course', courses }" />
		<FetchComponent :fetch-func="fetchAll" v-model:data="courses">
			<template #data>
				<div grid gap-8>
					<Items
						v-for="coursesCategoried in itemsCategoried"
						:key="coursesCategoried.value.title"
						:items="coursesCategoried.value.items"
						item-key="_id"
						:title="coursesCategoried.value.title"
						sortable
						@dragend="
							(evt) =>
								handleSort(coursesCategoried.value.items, evt)
						"
					>
						<template #item="course">
							<CourseCard
								:course="course"
								@delete="del"
								@toggle:archive="toggleArchive"
								@toggle:status="toggleStatus"
							/>
						</template>
					</Items>
				</div>
			</template>
		</FetchComponent>
	</div>
</template>

<style scoped></style>
