<script setup lang="ts">
import CourseCard from '@/components/Course/CourseCard.vue'
import FetchComponent from '@/components/Others/FetchComponent.vue'
import Items from '@/components/Others/ListItems.vue'
import { fetchAll } from '@/database/course'
import { useCourses } from '@/composables/useCourses'
import type { Course } from 'shared'
import AddButton from '../AddButton.vue'
import { onMounted, ref } from 'vue'
import { useFetchData } from '@/composables/useFetchData'
import { useRoute } from 'vue-router'

const route = useRoute()
const addButtonEl = ref()
const visible = ref(false)

onMounted(() => {
	if (route.query.openAddButton) {
		visible.value = true
	}
})

const courses = ref<Course[]>([])

const { loading, error } = useFetchData(fetchAll, courses)

const {
	itemsCategoried,
	create,
	del,
	toggleArchive,
	toggleStatus,
	handleSort
} = useCourses(courses)
</script>
<template>
	<div data-testid="courses-view">
		<AddButton
			v-model:visible="visible"
			ref="addButtonEl"
			type="course"
			@create:course="
				(v) => {
					create(v)
				}
			"
		/>
		<FetchComponent :loading="loading" :error="error">
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
