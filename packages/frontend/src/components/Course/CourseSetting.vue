<script setup lang="ts">
import { update } from '@/database/course'
import { useCourseStore } from '@/store/course.store'
import { errorMsg, successMsg } from '@/utils/useMessage'
import { useVModel } from '@vueuse/core'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: boolean;
}>()

const emit = defineEmits(['update:modelValue'])

// dialog
const visible = useVModel(props, 'modelValue', emit)
function handleClose() {
	visible.value = false
}

//form
const courseStore = useCourseStore()
const {t} = useI18n()
const ruleFormRef = ref<FormInstance>()

function getPropertyName(index: number) {
	return `Interval ${index + 1}`
}

const rules = reactive<FormRules>({
	name: [
		{ required: true, message: t('components.course.courseSetting.required', [t('components.course.courseSetting.name')]) , trigger: 'blur' },
	],
	intervals: [
		{ required: true, message: t('components.course.courseSetting.required', [t('components.course.courseSetting.name')]) , trigger: 'blur' },
		{ validator(_, value: number[]) {
			return value.length >= 1 && value.every(v => v >= 1)
		}}
	],
})


const ruleForm = reactive({
	name: courseStore.currentCourse!.name,
	intervals: courseStore.currentCourse!.intervals
})


const submitForm = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid) => {
		if (valid) {
			update(courseStore.currentCourse!._id, ruleForm, {withProgresses: true})
				.then(() => {
					visible.value = false
					successMsg('Setting Succeeded.')
				})
				.catch(() => {
					visible.value = true
					errorMsg('Setting Failed.')
				})
		}
	})
}

function addInterval() {
	ruleForm.intervals.push(1)
}

function removeInterval() {
	ruleForm.intervals.splice(-1, 1)
}
</script>

<template>
    <div>
        <el-dialog
        v-model="visible"
        title="Course Settings"
        width="30%"
        :before-close="handleClose"
      >
      <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    status-icon
  >
    <el-form-item label="Course Name" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <div flex gap-6 my-6 items-center justify-between>
      <h3 m-none>Intervals</h3>
      <div>

        <el-tooltip
        effect="dark"
        content="Add Interval"
      placement="top"
    >
    <el-button @click="addInterval"><div i-mdi-add></div></el-button>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      content="Remove Interval"
      placement="top"
    >
    <el-button @click="removeInterval
    "><div i-mdi-minus></div></el-button>
    </el-tooltip>
      
  </div>
    </div>
    <el-form-item :label="getPropertyName(index)" prop="intervals" v-for="interval, index in ruleForm.intervals" :key="index">
      <el-input-number v-model="ruleForm.intervals[index]" :min="1" />
    </el-form-item>
      </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="visible = false">Cancel</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Confirm
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>



<style scoped>

</style>