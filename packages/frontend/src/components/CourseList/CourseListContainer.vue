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
import CreateForm from '../CreateForm.vue'
import BaseDialog from '../Others/BaseDialog.vue'

const route = useRoute()
const formVisible = ref(false)

onMounted(() => {
	if (route.query.openAddButton) {
		formVisible.value = true
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

async function handleCreate(name: string) {
	await create(name)
	formVisible.value = false
}
</script>
<template>
	<AddButton
		type="primary"
		tool-tip="Create Course"
		@click="formVisible = true"
	/>
	<BaseDialog v-model="formVisible" title="Create Course">
		<CreateForm label="Course Name" @ok="handleCreate" />
	</BaseDialog>
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
						(evt) => handleSort(coursesCategoried.value.items, evt)
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
</template>

<style scoped></style>
