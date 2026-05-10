<script setup lang="ts">
import { computed } from 'vue'
import { useSlideStore } from '@/stores/slideStore'
import { useSlideNav } from '@/composables/useSlideNav'
import SlideItem from './SlideItem.vue'
import NavDots from './NavDots.vue'
import ProgressBar from './ProgressBar.vue'

const store = useSlideStore()
const { tryGo } = useSlideNav()

const trackStyle = computed(() => ({
  transform: `translateX(-${store.currentIndex * 100}vw)`,
}))
</script>

<template>
  <div class="presentation">
    <!-- 横向轨道 -->
    <div class="track" :style="trackStyle">
      <SlideItem
        v-for="slide in store.slides"
        :key="slide.index"
        :slide="slide"
      />
    </div>

    <!-- 右侧导航圆点 -->
    <NavDots />

    <!-- 底部进度条 -->
    <ProgressBar />

    <!-- 右下角翻页提示（非最后一页） -->
    <button
      v-if="store.currentIndex < store.total - 1"
      class="arrow-hint"
      @click="tryGo(store.currentIndex + 1)"
    >
      下一屏 →
    </button>
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
  color: var(--dim, #4a525c);
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 0.3s;
  background: none;
  border: none;
  z-index: 100;
}

.arrow-hint:hover {
  color: var(--accent, #58e1c1);
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
}
</style>
