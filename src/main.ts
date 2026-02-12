// main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus' // ← 新增
import 'element-plus/dist/index.css' // ← 新增（关键！）

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus) // ← 新增

app.mount('#app')
