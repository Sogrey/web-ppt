import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SlideData, PresentationMeta } from '@/types/slide'

export const useSlideStore = defineStore('slide', () => {
  const slides = ref<SlideData[]>([])
  const currentIndex = ref(0)
  const meta = ref<PresentationMeta>({})

  const total = computed(() => slides.value.length)
  const currentSlide = computed(() => slides.value[currentIndex.value])
  const progress = computed(() =>
    total.value <= 1 ? 0 : (currentIndex.value / (total.value - 1)) * 100,
  )

  function setSlides(data: SlideData[], presentationMeta: PresentationMeta = {}) {
    slides.value = data
    meta.value = presentationMeta
    currentIndex.value = 0
  }

  function goTo(index: number) {
    if (index < 0 || index >= total.value) return
    currentIndex.value = index
  }

  function next() {
    goTo(currentIndex.value + 1)
  }

  function prev() {
    goTo(currentIndex.value - 1)
  }

  return {
    slides,
    currentIndex,
    meta,
    total,
    currentSlide,
    progress,
    setSlides,
    goTo,
    next,
    prev,
  }
})
