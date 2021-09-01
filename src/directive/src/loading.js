import Loading from '../../components/loading/index.vue'
import { createApp } from 'vue'

const loading = {
  mounted (el, binding) {
    const app = createApp(Loading)
    const intance = app.mount(document.createElement('div'))
    const name = Loading.name
    if (!el[name]) {
      el[name] = {}
    }
    el[name] = intance
    if (binding.value) {
      append(el)
    }
  },
  updated (el, binding) {
    if (binding.value) {
      append(el)
    } else {
      remove(el)
    }
  }
}

// 标记是否由本指令添加position
let modifyStyle = false
const append = (el) => {
  const name = Loading.name
  const sytlePosition = getComputedStyle(el).position
  if (['relative', 'fixed', 'absolute'].indexOf(sytlePosition) === -1) {
    modifyStyle = true
    el.style.position = 'relative'
  }
  const child = el[name].$el
  el.appendChild(child)
}

const remove = (el) => {
  const name = Loading.name
  const child = el[name].$el
  if (modifyStyle) {
    el.style.position = 'relative'
    modifyStyle = false
  }
  el.removeChild(child)
}

export default loading
