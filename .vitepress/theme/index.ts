import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import Quiz from './components/Quiz.vue'
import ArchExplorer from './components/ArchExplorer.vue'
import DecisionCard from './components/DecisionCard.vue'
import Comments from './components/Comments.vue'

export default {
  extends: DefaultTheme,
  // 在每篇文档正文下方注入评论区(home / page 布局不含 doc-after 插槽,首页不受影响)
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Comments),
    })
  },
  enhanceApp({ app }) {
    app.component('Quiz', Quiz)
    app.component('ArchExplorer', ArchExplorer)
    app.component('DecisionCard', DecisionCard)
    app.component('Comments', Comments)
  },
}
