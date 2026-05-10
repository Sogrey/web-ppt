<script setup lang="ts">
import type { SlideData } from '@/types/slide'

const props = defineProps<{ slide: SlideData }>()
</script>

<template>
  <section
    class="slide-item"
    :style="props.slide.frontmatter.background
      ? { background: props.slide.frontmatter.background }
      : {}"
  >
    <!-- 网格背景装饰 -->
    <div class="grid-bg" aria-hidden="true" />

    <!-- 左上角页签 -->
    <div v-if="props.slide.frontmatter.label" class="screen-label">
      {{ props.slide.frontmatter.label }}
    </div>

    <!-- 内容区 -->
    <div class="slide-content" v-html="props.slide.html" />
  </section>
</template>

<style scoped>
.slide-item {
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 72px;
  position: relative;
  overflow: hidden;
  background: var(--bg, #0b0d0f);
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(88, 225, 193, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(88, 225, 193, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.screen-label {
  position: absolute;
  top: 32px;
  left: 72px;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: var(--dim, #4a525c);
  text-transform: uppercase;
}

.slide-content {
  position: relative;
  max-width: 900px;
  width: 100%;
  z-index: 1;
  color: var(--text, #f7f8fa);
}

/* ── Markdown 内容样式 ── */
.slide-content :deep(h1) {
  font-size: clamp(36px, 5vw, 68px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--text, #f7f8fa);
  margin-bottom: 28px;
}

.slide-content :deep(h2) {
  font-size: clamp(22px, 3vw, 40px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text, #f7f8fa);
  margin-bottom: 20px;
}

.slide-content :deep(h3) {
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 700;
  color: var(--accent, #58e1c1);
  margin-bottom: 14px;
}

.slide-content :deep(p) {
  font-size: clamp(14px, 1.6vw, 20px);
  font-weight: 300;
  color: var(--muted, #a9b0ba);
  line-height: 1.75;
  margin-bottom: 16px;
}

.slide-content :deep(ul),
.slide-content :deep(ol) {
  font-size: clamp(13px, 1.5vw, 18px);
  color: var(--muted, #a9b0ba);
  line-height: 1.8;
  padding-left: 1.5em;
  margin-bottom: 16px;
}

.slide-content :deep(li) {
  margin-bottom: 6px;
}

.slide-content :deep(strong) {
  color: var(--text, #f7f8fa);
  font-weight: 700;
}

.slide-content :deep(em) {
  color: var(--accent, #58e1c1);
  font-style: normal;
}

.slide-content :deep(code) {
  font-family: 'DM Mono', monospace;
  font-size: 0.875em;
  background: var(--bg3, #1c2026);
  color: var(--accent, #58e1c1);
  padding: 2px 8px;
  border-radius: 3px;
}

.slide-content :deep(pre) {
  background: var(--bg2, #13161a);
  border: 1px solid var(--border, rgba(255, 255, 255, 0.07));
  border-radius: 6px;
  padding: 20px 24px;
  overflow-x: auto;
  margin-bottom: 16px;
  white-space: pre;
}

.slide-content :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 14px;
  color: var(--text, #f7f8fa);
  white-space: pre;
}

.slide-content :deep(blockquote) {
  border-left: 3px solid var(--accent, #58e1c1);
  background: rgba(88, 225, 193, 0.05);
  padding: 12px 20px;
  color: var(--muted, #a9b0ba);
  margin-bottom: 16px;
}

.slide-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  font-size: clamp(13px, 1.4vw, 16px);
}

.slide-content :deep(th) {
  background: var(--bg2, #13161a);
  color: var(--accent, #58e1c1);
  font-weight: 600;
  text-align: left;
  padding: 10px 16px;
  border-bottom: 2px solid var(--border, rgba(255, 255, 255, 0.07));
}

.slide-content :deep(td) {
  padding: 10px 16px;
  border-bottom: 1px solid var(--border, rgba(255, 255, 255, 0.07));
  color: var(--muted, #a9b0ba);
}

.slide-content :deep(img) {
  max-width: 100%;
  max-height: 50vh;
  border-radius: 6px;
  margin: 8px 0;
}

.slide-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border, rgba(255, 255, 255, 0.07));
  margin: 24px 0;
}

.slide-content :deep(a) {
  color: var(--accent, #58e1c1);
  text-decoration: none;
}

.slide-content :deep(a:hover) {
  text-decoration: underline;
}

/* ── KaTeX 公式样式 ── */
.slide-content :deep(.katex) {
  color: var(--text, #f7f8fa);
  font-size: 1.1em;
}

.slide-content :deep(.katex-block) {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.slide-content :deep(.katex-error) {
  color: var(--danger, #ff6b6b);
  font-family: 'DM Mono', monospace;
}

/* 移动端 */
@media (max-width: 768px) {
  .slide-item {
    padding: 64px 24px 48px;
    align-items: flex-start;
  }
  .screen-label {
    left: 24px;
  }
}
</style>
