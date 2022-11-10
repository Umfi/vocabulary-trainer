import { mount } from '@vue/test-utils'
import VocablesPage from '@/views/VocablesPage.vue'

describe('VocablesPage.vue', () => {
  it('renders tab 1 VocablesPage', () => {
    const wrapper = mount(VocablesPage)
    expect(wrapper.text()).toMatch('Vocables')
  })
})
