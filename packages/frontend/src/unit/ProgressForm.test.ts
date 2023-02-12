import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import ProgressForm from '@/components/Progress/ProgressForm.vue'
import { createGetter } from './utils'
import { progress1 as progress } from './dummyData'
import DeleteButton from '@/components/Others/DeleteButton.vue'

const NAME_SPACE = 'progress-form'
const { get, find } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

const $t = () => {}

const intervals = [1, 7, 14, 28]

// can not test since the dialog is appended to body
describe.skip('ProgressForm', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test('Rendered', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals,
				visible: true
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		expect(await find(wrapper, 'wrapper').exists()).toBe(true)
	})

	test('emit update if update', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals,
				visible: true
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'input').setValue('good')
		await get(wrapper, 'confirm').trigger('click')

		await flushPromises()
		expect(wrapper.emitted()).toHaveProperty('update')
	})

	test('emit delete when delete', async () => {
		const wrapper = mount(ProgressForm, {
			props: {
				progress,
				intervals,
				visible: true
			},
			global: {
				mocks: {
					$t
				}
			},
			components: {
				DeleteButton
			}
		})

		await wrapper.getComponent(DeleteButton).vm.$emit('delete')

		await flushPromises()
		expect(wrapper.emitted()).toHaveProperty('delete')
	})
})
