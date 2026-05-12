import { onMounted, onUnmounted, ref } from 'vue'
import { useSlideStore } from '@/stores/slideStore'

const MOBILE_BREAKPOINT = 768
const WHEEL_THRESHOLD = 50
const WHEEL_DEBOUNCE_MS = 60
const TOUCH_THRESHOLD = 60
const TRANSITION_LOCK_MS = 800

/**
 * 检查当前显示的幻灯片是否可以滚动，以及滚动位置
 */
function getCurrentSlideScrollInfo(currentIndex: number): {
  canScrollUp: boolean
  canScrollDown: boolean
} {
  // 获取所有幻灯片，找到当前显示的那个
  const slides = document.querySelectorAll('.slide-item')
  const currentSlide = slides[currentIndex] as HTMLElement | undefined

  if (!currentSlide) {
    return { canScrollUp: false, canScrollDown: false }
  }

  // 检查当前幻灯片是否可滚动（内容高度 > 视口高度）
  const { scrollTop, scrollHeight, clientHeight } = currentSlide
  const isScrollable = scrollHeight > clientHeight

  if (!isScrollable) {
    return { canScrollUp: false, canScrollDown: false }
  }

  const canScrollUp = scrollTop > 0
  const canScrollDown = scrollTop + clientHeight < scrollHeight - 1 // -1 for floating point tolerance

  return { canScrollUp, canScrollDown }
}

export function useSlideNav() {
  const store = useSlideStore()

  // 防止切换动画未完成时再次触发
  const locked = ref(false)

  // 更新 URL hash：/#3 表示第3页（1-based）
  function updateHash(index: number) {
    const target = index + 1
    const expected = `#/${target}`
    if (window.location.hash !== expected) {
      window.history.replaceState(null, '', expected)
    }
  }

  function tryGo(index: number) {
    if (locked.value) return
    locked.value = true
    store.goTo(index)
    updateHash(index)
    setTimeout(() => {
      locked.value = false
    }, TRANSITION_LOCK_MS)
  }

  // ── 键盘 ──
  function onKeydown(e: KeyboardEvent) {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') tryGo(store.currentIndex + 1)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') tryGo(store.currentIndex - 1)
  }

  // ── 滚轮 ──
  let wheelAccum = 0
  let wheelTimer: ReturnType<typeof setTimeout> | null = null
  function onWheel(e: WheelEvent) {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return

    const { canScrollUp, canScrollDown } = getCurrentSlideScrollInfo(store.currentIndex)

    // 如果内容可以滚动，优先让内容滚动
    if (e.deltaY > 0 && canScrollDown) {
      // 向下滚动，但内容还没到底，不翻页，让默认滚动行为执行
      return
    }
    if (e.deltaY < 0 && canScrollUp) {
      // 向上滚动，但内容还没到顶，不翻页，让默认滚动行为执行
      return
    }

    // 内容已滚动到边界，或无需滚动，执行翻页
    e.preventDefault()
    wheelAccum += e.deltaY || e.deltaX
    if (wheelTimer) clearTimeout(wheelTimer)
    wheelTimer = setTimeout(() => {
      if (wheelAccum > WHEEL_THRESHOLD) tryGo(store.currentIndex + 1)
      if (wheelAccum < -WHEEL_THRESHOLD) tryGo(store.currentIndex - 1)
      wheelAccum = 0
    }, WHEEL_DEBOUNCE_MS)
  }

  // ── 触摸 ──
  let touchStartX = 0
  function onTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    if (touch) touchStartX = touch.clientX
  }
  function onTouchEnd(e: TouchEvent) {
    if (window.innerWidth <= MOBILE_BREAKPOINT) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - touchStartX
    if (dx < -TOUCH_THRESHOLD) tryGo(store.currentIndex + 1)
    if (dx > TOUCH_THRESHOLD) tryGo(store.currentIndex - 1)
  }

  // ── URL hash 变化（浏览器前进/后退） ──
  function onHashChange() {
    const hash = window.location.hash ?? ''
    const match = hash.match(/^#\/(\d+)$/)
    if (match && match[1] !== undefined) {
      const target = parseInt(match[1], 10) - 1
      // 直接用 goTo 而非 tryGo，避免 transition lock 干扰
      if (target >= 0 && target < store.total && target !== store.currentIndex) {
        store.goTo(target)
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('hashchange', onHashChange)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('hashchange', onHashChange)
    if (wheelTimer) clearTimeout(wheelTimer)
  })

  return { tryGo }
}
