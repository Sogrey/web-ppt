<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&family=DM+Mono:wght@400;500&display=swap');

:root {
  --bg:      #0b0d0f;
  --bg2:     #13161a;
  --bg3:     #1c2026;
  --text:    #f7f8fa;
  --muted:   #a9b0ba;
  --dim:     #4a525c;
  --accent:  #58e1c1;
  --accent2: #3bb89a;
  --border:  rgba(255, 255, 255, 0.07);
  --border2: rgba(255, 255, 255, 0.12);
}

body {
  font-family: 'Noto Sans SC', sans-serif;
  background: var(--bg);
  color: var(--text);
}
</style>
