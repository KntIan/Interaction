import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import { createPinia } from 'pinia' // 导入 Pinia
import { Dialog } from 'vant'

// 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css' // 样式文件

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
})

// 创建 Pinia 实例并挂载
const pinia = createPinia()
app.use(pinia)

// 使用 Element Plus
app.use(ElementPlus)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia' // 导入 Pinia

// 导入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css' // 样式文件

export function createApp() {
  const app = createSSRApp(App)

  // 创建 Pinia 实例并注入
  const pinia = createPinia()
  app.use(pinia)

  // 使用 Element Plus
  app.use(ElementPlus)

  return {
    app,
  }
}
// #endif
