/**
 * Load markdown content from URL query param ?md=<path>
 * Falls back to demo.md in public folder (relative to base URL)
 * Supports drag & drop local .md files
 */
import { ref } from 'vue'
import { parseMarkdown } from '@/composables/useSlideParser'
import type { SlideData, PresentationMeta } from '@/types/slide'

const DEFAULT_MD_PATH = 'demo.md'

function resolveMdUrl(mdParam: string): string {
  // 绝对 URL，直接使用
  if (mdParam.startsWith('http')) {
    return mdParam
  }
  // 以 / 开头的路径，直接使用
  if (mdParam.startsWith('/')) {
    return mdParam
  }
  // 相对路径，基于当前页面路径解析
  const basePath = window.location.pathname.replace(/\/$/, '')
  return `${basePath}/${mdParam}`
}

function isMarkdownFile(file: File): boolean {
  return (
    file.type === 'text/markdown' ||
    file.name.toLowerCase().endsWith('.md') ||
    file.name.toLowerCase().endsWith('.markdown')
  )
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

export function useMdLoader() {
  const loading = ref(false)
  const error = ref('')
  const slides = ref<SlideData[]>([])
  const meta = ref<PresentationMeta>({})

  async function loadFromUrl(): Promise<boolean> {
    const params = new URLSearchParams(window.location.search)
    const mdParam = params.get('md') ?? DEFAULT_MD_PATH

    loading.value = true
    error.value = ''
    try {
      const url = resolveMdUrl(mdParam)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.text()
      const parsed = parseMarkdown(raw)
      slides.value = parsed.slides
      meta.value = parsed.meta
      return true
    } catch (e: unknown) {
      error.value = `加载失败: ${e instanceof Error ? e.message : String(e)}`
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadFromFile(file: File): Promise<boolean> {
    if (!isMarkdownFile(file)) {
      error.value = '仅支持 .md 或 .markdown 文件'
      return false
    }

    loading.value = true
    error.value = ''
    try {
      const raw = await readFileAsText(file)
      const parsed = parseMarkdown(raw)
      slides.value = parsed.slides
      meta.value = parsed.meta
      return true
    } catch (e: unknown) {
      error.value = `文件读取失败: ${e instanceof Error ? e.message : String(e)}`
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, error, slides, meta, loadFromUrl, loadFromFile, isMarkdownFile }
}
