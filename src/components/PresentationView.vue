<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSlideStore } from '@/stores/slideStore'
import { useSlideNav } from '@/composables/useSlideNav'
import { useMdLoader } from '@/composables/useMdLoader'
import SlideItem from './SlideItem.vue'
import NavDots from './NavDots.vue'
import ProgressBar from './ProgressBar.vue'
import SpeakerNotes from './SpeakerNotes.vue'

const store = useSlideStore()
const { tryGo } = useSlideNav()
const { slides, meta, loadFromFile, isMarkdownFile } = useMdLoader()

const showNotes = ref(false)
const isFullscreen = ref(false)
const isDragging = ref(false)
const dragError = ref('')
const dragCounter = ref(0)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => { })
  } else {
    document.exitFullscreen().catch(() => { })
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function onKeydown(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

  if (e.key === 's' || e.key === 'S') {
    showNotes.value = !showNotes.value
  }
  if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen()
  }
}

// ── 拖拽文件 ──
function onDragEnter(e: DragEvent) {
  e.preventDefault()
  dragCounter.value++
  isDragging.value = true
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  dragCounter.value--
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

async function onDrop(e: DragEvent) {
  e.preventDefault()
  dragCounter.value = 0
  isDragging.value = false
  dragError.value = ''

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  const file = files[0]
  if (!file || !isMarkdownFile(file)) {
    dragError.value = '仅支持 .md 或 .markdown 文件'
    setTimeout(() => { dragError.value = '' }, 3000)
    return
  }

  const success = await loadFromFile(file)
  if (success) {
    store.setSlides(slides.value, meta.value)
    store.goTo(0)
  } else {
    dragError.value = '文件加载失败'
    setTimeout(() => { dragError.value = '' }, 3000)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('drop', onDrop)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('drop', onDrop)
})

const trackStyle = computed(() => ({
  transform: `translateX(-${store.currentIndex * 100}vw)`,
}))

function handlePrint() {
  const track = document.querySelector<HTMLElement>('.track')
  const slides = document.querySelectorAll<HTMLElement>('.slide-item')
  const isPrintingClass = 'is-printing'

  // 1. 标记 body，辅助 CSS 匹配
  document.body.classList.add(isPrintingClass)

  // 2. 强制 track 变为竖向堆叠（最高优先级：内联样式）
  if (track) {
    track.style.cssText += ';display:block!important;width:100%!important;height:auto!important;transform:none!important;flex-direction:unset!important;'
  }

  // 3. 强制每张 slide 分页
  slides.forEach((el, i) => {
    el.style.cssText += `;display:block!important;width:100%!important;height:100vh!important;overflow:hidden!important;page-break-after:always!important;break-after:always!important;`
    if (i === slides.length - 1) {
      el.style.pageBreakAfter = 'auto'
      el.style.breakAfter = 'auto'
    }
  })

  // 4. 监听打印结束，恢复样式
  const restore = () => {
    document.body.classList.remove(isPrintingClass)
    if (track) {
      track.style.cssText = track.style.cssText
        .replace(/display\s*:\s*block\s*!important/i, '')
        .replace(/width\s*:\s*100%\s*!important/i, '')
        .replace(/height\s*:\s*auto\s*!important/i, '')
        .replace(/transform\s*:\s*none\s*!important/i, '')
    }
    slides.forEach(el => {
      el.style.pageBreakAfter = ''
      el.style.breakAfter = ''
    })
    window.removeEventListener('afterprint', restore)
  }
  window.addEventListener('afterprint', restore)

  // 5. 触发打印
  window.print()
}
</script>

<template>
  <div class="presentation" :class="{ 'is-dragging': isDragging }">
    <!-- 拖拽提示遮罩 -->
    <div v-if="isDragging" class="drag-overlay">
      <div class="drag-hint">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>松开以加载 Markdown 文件</span>
      </div>
    </div>

    <!-- 拖拽错误提示 -->
    <div v-if="dragError" class="drag-error">{{ dragError }}</div>

    <!-- 横向轨道 -->
    <div class="track" :style="trackStyle">
      <SlideItem v-for="slide in store.slides" :key="slide.index" :slide="slide" />
    </div>

    <!-- 右侧导航圆点 -->
    <NavDots />

    <!-- 底部进度条 -->
    <ProgressBar />

    <!-- 右下角翻页提示（非最后一页） -->
    <button v-if="store.currentIndex < store.total - 1" class="arrow-hint" @click="tryGo(store.currentIndex + 1)">
      下一屏 →
    </button>

    <!-- 左上角全屏按钮 -->
    <button class="fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏 (F)' : '全屏演示 (F)'">
      <!-- 全屏图标 -->
      <svg v-if="!isFullscreen" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
      </svg>
      <!-- 退出全屏图标 -->
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
      </svg>
      {{ isFullscreen ? '退出' : '全屏' }}
    </button>

    <!-- 右上角导出 PDF 按钮 -->
    <button class="print-btn" @click="handlePrint" title="导出 PDF">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      导出 PDF
    </button>

    <!-- 演讲者备注面板 -->
    <Transition name="notes-fade">
      <SpeakerNotes v-if="showNotes" />
    </Transition>
  </div>
</template>

<style scoped>
.presentation {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.track {
  display: flex;
  flex-direction: row;
  width: max-content;
  height: 100vh;
  transition: transform 0.75s cubic-bezier(0.77, 0, 0.175, 1);
  will-change: transform;
}

.arrow-hint {
  position: fixed;
  bottom: 36px;
  right: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  color: var(--dim);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 0.3s;
  background: none;
  border: none;
  z-index: 100;
}

.arrow-hint:hover {
  color: var(--accent);
}

/* ── 全屏按钮 ── */
.fullscreen-btn {
  position: fixed;
  top: 24px;
  left: 28px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--dim);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border2);
  border-radius: 4px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.25s;
  z-index: 200;
}

.fullscreen-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(88, 225, 193, 0.06);
}

.fullscreen-btn svg {
  flex-shrink: 0;
}

/* ── 导出 PDF 按钮 ── */
.print-btn {
  position: fixed;
  top: 24px;
  right: 28px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--dim);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border2);
  border-radius: 4px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.25s;
  z-index: 200;
}

.print-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: rgba(88, 225, 193, 0.06);
}

.print-btn svg {
  flex-shrink: 0;
}

/* ── 拖拽文件提示 ── */
.drag-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 13, 15, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.drag-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 64px;
  border: 2px dashed var(--accent);
  border-radius: 12px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 16px;
  letter-spacing: 0.05em;
}

.drag-error {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6b6b;
  color: #fff;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 1001;
  animation: slideDown 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 移动端：竖向滚动降级 */
@media (max-width: 768px) {
  .track {
    flex-direction: column;
    width: 100%;
    height: auto;
    transform: none !important;
    transition: none;
  }

  .presentation {
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
  }

  .arrow-hint {
    display: none;
  }

  .print-btn {
    display: none;
  }

  .fullscreen-btn {
    display: none;
  }
}

/* 演讲者备注面板过渡动画 */
.notes-fade-enter-active,
.notes-fade-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.notes-fade-enter-from,
.notes-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
