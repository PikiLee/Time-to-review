import AddButton from '@/components/Buttons/AddButton.vue'
import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'

test('Emit click event when clicked', async () => {
	const toolTip = 'tp'
	const wrapper = mount(AddButton, {
		props: {
			type: 'primary',
			toolTip
		}
	})

	await wrapper.get(`button`).trigger('click')
	expect(wrapper.emitted()).toHaveProperty(`click`)
})
