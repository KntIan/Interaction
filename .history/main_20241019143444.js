import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import { createPinia } from 'pinia' // 导入 Pinia
import { Dialog } from 'vant' 

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
})

// 创建 Pinia 实例并挂载
const pinia = createPinia()
app.use(pinia)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia' // 导入 Pinia

export function createApp() {
  const app = createSSRApp(App)

  // 创建 Pinia 实例并注入
  const pinia = createPinia()
  app.use(pinia)

  return {
    app,
  }
}
// #endif
