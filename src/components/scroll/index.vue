<template>
  <div class="scroll-container" ref="container">
    <div class="content">
      <slot></slot>
    </div>
    <div class="reference" ref="renference">
      <loading v-show="loadingNeedShow"></loading>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted, ref } from 'vue'
import isIntersection from './useInter'
import Loading from '../loading/index'
export default defineComponent({
  name: 'Scroll',
  components: {
    Loading
  },
  emits: ['intersection'],
  setup (props, { emit }) {
    const container = ref(null)
    const renference = ref(null)
    const loadingNeedShow = ref(false)
    onMounted(() => {
      nextTick(() => {
        const containerEl = container.value
        const renferenceEl = renference.value
        const containScrollHeight = containerEl.scrollHeight
        const containOffetHeight = containerEl.offsetHeight
        if (containScrollHeight > containOffetHeight) {
          loadingNeedShow.value = true
        }
        const callback = () => {
          console.info('istersection')
          emit('intersection')
        }
        isIntersection(containerEl, renferenceEl, callback)
      })
    })
    return {
      container,
      renference,
      loadingNeedShow
    }
  }
})
</script>

<style lang="scss">
.scroll-container {
  height: 100%;
  overflow: auto;
  .reference {
    height: 10px;
    position: relative;
  }
}
</style>
