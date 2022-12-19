import { ref, nextTick } from 'vue'

export const useScroll = () => {
  const refScroll = ref<HTMLElement | string>()

  const handleScroll = async (elementSelector?: string): Promise<void> => {
    await nextTick()

    if (refScroll.value instanceof HTMLElement) {
      refScroll.value?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    } else {
      refScroll.value = elementSelector
      document
        .querySelector(`${refScroll.value}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }
  }

  return { refScroll, handleScroll }
}
