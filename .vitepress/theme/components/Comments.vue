<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { onMounted, watch, nextTick, ref } from 'vue'

// Giscus 配置(由仓库 study8677/awesome-architecture 的 GitHub Discussions 提供)
const REPO = 'study8677/awesome-architecture'
const REPO_ID = 'R_kgDOSlbKGA'
const CATEGORY = 'Announcements'
const CATEGORY_ID = 'DIC_kwDOSlbKGM4C9yTw'
const GISCUS_ORIGIN = 'https://giscus.app'

const { isDark, lang } = useData()
const route = useRoute()
const container = ref<HTMLElement | null>(null)

const giscusTheme = () => (isDark.value ? 'dark' : 'light')
const giscusLang = () => (lang.value?.startsWith('en') ? 'en' : 'zh-CN')

// 每次进入新页面都重新挂载脚本,这样每篇文档对应自己的 Discussion(按 pathname 映射)
function load() {
  const el = container.value
  if (!el) return
  el.innerHTML = ''
  const s = document.createElement('script')
  s.src = `${GISCUS_ORIGIN}/client.js`
  const attrs: Record<string, string> = {
    'data-repo': REPO,
    'data-repo-id': REPO_ID,
    'data-category': CATEGORY,
    'data-category-id': CATEGORY_ID,
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': giscusTheme(),
    'data-lang': giscusLang(),
    'data-loading': 'lazy',
  }
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  s.crossOrigin = 'anonymous'
  s.async = true
  el.appendChild(s)
}

// 切换深/浅色时,不重载整个 iframe,直接通过 postMessage 通知 giscus 换主题
function syncTheme() {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: giscusTheme() } } },
    GISCUS_ORIGIN,
  )
}

onMounted(load)
watch(() => route.path, () => nextTick(load))
watch(isDark, syncTheme)
</script>

<template>
  <div class="comments">
    <h2 class="comments__title">{{ giscusLang() === 'en' ? '💬 Comments' : '💬 评论' }}</h2>
    <div ref="container" class="giscus" />
  </div>
</template>

<style scoped>
.comments {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
.comments__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}
</style>
