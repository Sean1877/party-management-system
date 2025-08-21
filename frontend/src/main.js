import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'nprogress/nprogress.css'

import App from './App.vue'
import router from './router'
import '@/styles/index.scss'

const app = createApp(App)

// 注册Element Plus图标
console.log('[DEBUG] main.js: ElementPlusIconsVue 类型:', typeof ElementPlusIconsVue)
console.log('[DEBUG] main.js: ElementPlusIconsVue 内容:', ElementPlusIconsVue)

if (ElementPlusIconsVue && typeof ElementPlusIconsVue === 'object') {
  const entries = Object.entries(ElementPlusIconsVue)
  console.log('[DEBUG] main.js: Object.entries 结果类型:', typeof entries, '是否为数组:', Array.isArray(entries))
  console.log('[DEBUG] main.js: entries 长度:', entries.length)
  
  for (const [key, component] of entries) {
    app.component(key, component)
  }
  console.log('[DEBUG] main.js: 成功注册', entries.length, '个图标组件')
} else {
  console.error('[ERROR] main.js: ElementPlusIconsVue 不是有效对象:', ElementPlusIconsVue)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})

app.mount('#app')