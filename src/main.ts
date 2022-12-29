import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import router from './router'
import App from './App.vue'
import { createPinia } from 'pinia'
import VueKonva from 'vue-konva'
import plugins from './plugins'
import './assets/styles/tailwind.css'
import './assets/styles/index.css'
import 'element-plus/theme-chalk/src/index.scss'

const app = createApp(App)

app.use(VueKonva)

app.use(createPinia())
app.use(router)
app.use(plugins)
app.use(createHead())

app.mount('#app')
