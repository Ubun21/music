import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Install from './directive/index'
import './assets/css/index.scss'

const app = createApp(App).use(store).use(router)
Install(app)
app.mount('#app')
