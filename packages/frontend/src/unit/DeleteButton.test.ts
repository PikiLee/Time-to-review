import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import DeleteButton from '@/components/Buttons/DeleteButton.vue'
import { createGetter } from './utils'

const NAME_SPACE = 'delete-button'
const { get, find } = createGetter(NAME_SPACE)

const $t = () => ''

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

describe(NAME_SPACE, () => {
	// can not do test right since the dialog is teleport to body element
	test.todo(
		'Open, close dialog and emit delete event if click confirm button',
		async () => {
			const wrapper = mount(DeleteButton, {
				props: {
					name: 'course'
				},
				global: {
					mocks: {
						$t
					}
				}
			})

			await get(wrapper, 'button').trigger('click')
			await get(wrapper, 'dialog')
			await get(wrapper, 'confirm').trigger('click')
			expect(await find(wrapper, 'dislog').exists()).toBe(false)
			expect(wrapper.emitted()).toHaveProperty('delete')
		}
	)

	test.todo('close dialog if click cancel button', async () => {
		const wrapper = mount(DeleteButton, {
			props: {
				name: 'course'
			},
			global: {
				mocks: {
					$t
				}
			}
		})

		await get(wrapper, 'button').trigger('click')
		await get(wrapper, 'dialog')
		await get(wrapper, 'cancel').trigger('click')
		expect(await find(wrapper, 'dislog').exists()).toBe(false)
	})
})
