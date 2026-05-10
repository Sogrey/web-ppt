/**
 * Load markdown content from URL query param ?md=<path>
 * Falls back to the bundled demo.md
 */
import { ref } from 'vue'
import demoMd from '@/assets/slides/demo.md?raw'
import { parseMarkdown } from '@/composables/useSlideParser'
import type { SlideData, PresentationMeta } from '@/types/slide'

export function useMdLoader() {
  const loading = ref(false)
  const error = ref('')
  const slides = ref<SlideData[]>([])
  const meta = ref<PresentationMeta>({})

  async function loadFromUrl(): Promise<boolean> {
    const params = new URLSearchParams(window.location.search)
    const mdParam = params.get('md')
    if (!mdParam) return false

    loading.value = true
    error.value = ''
    try {
      const url = mdParam.startsWith('http')
        ? mdParam
        : '/' + mdParam.replace(/^\/+/, '')
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.text()
      const parsed = parseMarkdown(raw)
      slides.value = parsed.slides
      meta.value = parsed.meta
      return true
    } catch (e: any) {
      error.value = `加载失败: ${e.message}`
      return false
    } finally {
      loading.value = false
    }
  }

  function loadDemo() {
    const parsed = parseMarkdown(demoMd)
    slides.value = parsed.slides
    meta.value = parsed.meta
  }

  return { loading, error, slides, meta, loadFromUrl, loadDemo }
}
