<template>
  <div class="tab">
    <div class="tab-item"
      v-for="(val, index) in data.items" :index="index" :key="index"
      @click="clickHandle"
      :class="{ active: data.index === index }"
      >
      <span>{{ val }}</span>
     </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'
export default defineComponent({
  name: 'Tab',
  emits: ['active'],
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  setup (props, contenxt) {
    const data = reactive({
      items: ['推荐', '歌手', '排行榜', '搜索'],
      index: 0
    })
    const clickHandle = (e) => {
      let idx = e.target.getAttribute('index')
      if (!idx) {
        const parent = e.target.parentNode
        idx = parent.getAttribute('index')
      }
      data.index = parseInt(idx)
      contenxt.emit('active', data.index)
    }
    watch(
      () => props.index,
      (val) => {
        data.index = val
      }
    )
    return {
      data,
      clickHandle
    }
  }
})
</script>

<style lang="scss">
.tab {
  display: flex;
  line-height: 44px;
  height: 44px;
  font-size: 14px;
  .tab-item {
    flex: 1;
    text-align: center;
  }
  .active {
    color: #ffcd32;
    border-bottom: 2px solid #ffcd32;
  }
}
</style>
