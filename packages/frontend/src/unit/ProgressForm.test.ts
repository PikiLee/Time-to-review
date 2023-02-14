import { flushPromises, mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach } from 'vitest'
import ProgressForm from '@/components/Progress/ProgressForm.vue'
import { createGetter } from './utils'
import { progress1 as progress } from './dummyData'

const NAME_SPACE = 'progress-form'
const { get, find } = createGetter(NAME_SPACE)

vi.mock('vue-i18n', () => {
	return {
		useI18n: () => ({ t: () => '' })
	}
})

const $t = () => {}

const intervals = [1, 7, 14, 28]

beforeEach(() => {
	vi.restoreAllMocks()
})

test('Rendered', async () => {
	const wrapper = mount(ProgressForm, {
		props: {
			progress,
			intervals
		},
		global: {
			mocks: {
				$t
			}
		}
	})

	await find(wrapper, 'wrapper')
})

test.each([
	['update', 'confirm'],
	['cancel', 'cancel']
])('emit %s if %s', async (event, selector) => {
	const wrapper = mount(ProgressForm, {
		props: {
			progress,
			intervals
		},
		global: {
			mocks: {
				$t
			}
		}
	})

	await get(wrapper, 'input').setValue('good')
	await get(wrapper, selector).trigger('click')

	await flushPromises()
	expect(wrapper.emitted()).toHaveProperty(event)
})
