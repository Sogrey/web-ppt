import { onMounted, onUnmounted, ref } from 'vue'
import { useSlideStore } from '@/stores/slideStore'

const MOBILE_BREAKPOINT = 768
const WHEEL_THRESHOLD = 50
const WHEEL_DEBOUNCE_MS = 60
const TOUCH_THRESHOLD = 60
const TRANSITION_LOCK_MS = 800

export function useSlideNav() {
  const store = useSlideStore()

  // 防止切换动画未完成时再次触发
  const locked = ref(false)
  function tryGo(index: number) {
    if (locked.value) return
    locked.value = true
    store.goTo(index)
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

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    if (wheelTimer) clearTimeout(wheelTimer)
  })

  return { tryGo }
}
