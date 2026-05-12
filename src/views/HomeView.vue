<script setup lang="ts">
import { onMounted } from 'vue'
import { useSlideStore } from '@/stores/slideStore'
import { useMdLoader } from '@/composables/useMdLoader'
import PresentationView from '@/components/PresentationView.vue'

const store = useSlideStore()
const { loading, error, slides, meta, loadFromUrl } = useMdLoader()

onMounted(async () => {
  await loadFromUrl()
  store.setSlides(slides.value, meta.value)
  store.initFromHash()
})
</script>

<template>
  <PresentationView v-if="store.total > 0 && !loading" />
  <div v-else-if="loading" class="loading">加载中…</div>
  <div v-else class="loading">暂无内容</div>

  <div v-if="error" class="error-toast">{{ error }}</div>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: var(--muted, #a9b0ba);
  font-size: 16px;
}
.error-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6b6b;
  color: #fff;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  z-index: 999;
}
</style>
