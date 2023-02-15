import { mount } from '@vue/test-utils'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import CreateForm from '../components/CreateForm.vue'
import { createGetter } from './utils'

const NAME_SPACE = 'create-form'
const { get } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => 'i18n' })
	}
})

describe.each([
	['create course', 'Name'],
	['ceate progress', 'Name']
])('%s', (title, label) => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	test(`Show label`, async () => {
		const $t = () => ''

		const wrapper = mount(CreateForm, {
			props: {
				title,
				label
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		expect(await wrapper.get(`label`).text()).contains(label)
	})

	test(`emit ok event when click confirm`, async () => {
		const $t = () => 'i18n'
		const typed = 'good'

		const wrapper = mount(CreateForm, {
			props: {
				label
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await wrapper.get(`input`).setValue(typed)
		await wrapper.get(`button`).trigger('click')
		expect(wrapper.emitted()).toHaveProperty(`ok`)
	})

	test.each([[''], ['1'.repeat(61)]])(
		`Emit nothing, show error when type '' `,
		async (typed) => {
			const $t = () => 'i18n'

			const wrapper = mount(CreateForm, {
				props: {
					label
				},
				global: {
					mocks: {
						$t
					}
				}
			})

			await wrapper.get(`input`).setValue(typed)
			await wrapper.get(`button`).trigger('click')

			expect(wrapper.emitted()).not.toHaveProperty(`ok`)
			await get(wrapper, 'error')
		}
	)
})
