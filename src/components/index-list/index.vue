<template>
  <div class="index-wrapper" ref="container">
    <ul ref="list">
      <li class="list" :ground-name="item.title"
        v-for="(item, index) in data.singers" :key="index"
      >
        <div class="list-title">{{item.title}}</div>
        <ul>
          <li class="list-item" v-for="(child, index) in item.list" :key="index">
            <div class="avator">
              <img :src="child.pic" />
            </div>
            <div class="name">
              {{child.name}}
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut" v-show="activeIndex === 1">
      <ul>
        <li class="item" :ground-name="item.title" v-for="(item, index) in data.singers" :key="index"
          :class="{ active: index === state.activeIdx}"
          @touchstart="onClick"
          @touchmove="onMove"
          @touchend="onEnd"
        >
          {{item.title}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import useFixed from './useFixed'
export default defineComponent({
  name: 'IndexList',
  props: ['data', 'activeIndex'],
  setup (props) {
    const container = ref(null)
    const list = ref(null)
    const state = reactive({
      active: false,
      heights: null,
      indexs: null,
      activeIdx: 0
    })
    onMounted(() => {
      if (list.value) {
        const { heights, indexs } = useFixed(list)
        state.heights = heights
        state.indexs = indexs
      }
    })
    let startX = 0
    let pos = 0
    const onClick = (e) => {
      startX = e.changedTouches[0].clientY
      const groundName = e.target.getAttribute('ground-name')
      pos = state.indexs.indexOf(groundName)
      const scrollTop = state.heights.get(groundName)
      state.activeIdx = pos
      container.value.scrollTop = scrollTop
    }
    const onMove = (e) => {
      const dx = e.changedTouches[0].clientY - startX
      const step = pos + Math.floor(dx / 16)
      state.activeIdx = step
      scrollByIdx(step)
    }
    const onEnd = (e) => {
      pos = 0
    }
    const scrollByIdx = (idx) => {
      const groundName = state.indexs[idx]
      const scrollTop = state.heights.get(groundName)
      container.value.scrollTop = scrollTop
    }
    return {
      container,
      list,
      state,
      onClick,
      onMove,
      onEnd,
    }
  }
})
</script>

<style lang="scss">
.index-wrapper {
  position: relative;
  height: 100%;
  overflow: scroll;
  .list {
    .list-title {
      // position: sticky;
      // top: 0px;
      padding-left: 10px;
      background: red;
    }
    .list-item {
      display: flex;
      padding-top: 20px;
      padding-left: 30px;
      height: 50px;
      .avator {
        img {
          border-radius: 50%;
          height: 50px;
          width: 50px;
        }
      }
      .name {
        margin-left: 20px;
        line-height: 50px;
      }
    }
  }
  .shortcut {
    position: fixed;
    background: green;
    right: 4px;
    top: 20%;
    padding: 20px 0;
    width: 20px;
    border-radius: 10px;
    text-align: center;
    .active {
      background: yellow;
    }
  }
}
</style>>
