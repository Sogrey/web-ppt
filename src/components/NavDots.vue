<script setup lang="ts">
import { useSlideStore } from '@/stores/slideStore'

const store = useSlideStore()
</script>

<template>
  <nav class="nav-dots">
    <button
      v-for="(slide, i) in store.slides"
      :key="i"
      class="dot"
      :class="{ active: i === store.currentIndex }"
      :aria-label="`跳转到第 ${i + 1} 页`"
      @click="store.goTo(i)"
    />
  </nav>
</template>

<style scoped>
.nav-dots {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: var(--dim, #4a525c);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
}

.dot.active {
  background: var(--accent, #58e1c1);
  transform: scale(1.5);
}

@media (max-width: 768px) {
  .nav-dots {
    display: none;
  }
}
</style>
