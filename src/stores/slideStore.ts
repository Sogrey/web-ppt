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

  /**
   * Read initial slide index from URL hash on page load.
   * Supports formats: /#/3  →  index 2 (1-based to 0-based)
   * No hash or invalid hash → index 0
   */
  function initFromHash() {
    const hash = window.location.hash ?? ''
    const match = hash.match(/^#\/(\d+)$/)
    if (match && match[1] !== undefined) {
      const target = parseInt(match[1], 10) - 1
      if (target >= 0 && target < total.value) {
        currentIndex.value = target
      }
    }
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
    initFromHash,
    next,
    prev,
  }
})
