<script setup lang="ts">
import { useSlideStore } from '@/stores/slideStore'

const store = useSlideStore()
</script>

<template>
  <div class="progress-bar" :style="{ width: store.progress + '%' }" />
</template>

<style scoped>
.progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--accent, #58e1c1);
  transition: width 0.75s cubic-bezier(0.77, 0, 0.175, 1);
  z-index: 100;
}
</style>
