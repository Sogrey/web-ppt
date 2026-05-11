<script setup lang="ts">
import { computed } from 'vue'
import { useSlideStore } from '@/stores/slideStore'

const store = useSlideStore()

const currentNotes = computed(() => store.currentSlide?.notes ?? '')
</script>

<template>
  <div class="speaker-notes">
    <div class="notes-header">
      <span class="notes-label">备注</span>
    </div>
    <div class="notes-body">
      <p class="notes-text">{{ currentNotes }}</p>
    </div>
  </div>
</template>

<style scoped>
.speaker-notes {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(11, 13, 15, 0.95);
  border-top: 1px solid var(--border2, rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 300;
  max-height: 30vh;
  overflow-y: auto;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notes-header {
  padding: 12px 24px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notes-label {
  font-family: var(--font-mono, 'DM Mono', monospace);
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--accent, #58e1c1);
  text-transform: uppercase;
}

.notes-body {
  padding: 0 24px 20px;
}

.notes-text {
  font-family: var(--font-sans);
  font-size: clamp(13px, 1.4vw, 16px);
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>
