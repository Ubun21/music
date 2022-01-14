<template>
  <div class="index-wrapper" ref="container">
    <ul ref="indexList">
      <li class="index-list" :ground-name="item.title"
        v-for="(item, index) in data.singers" :key="index"
      >
        <div class="list-title" :ground-name="item.title" ref="titles">{{item.title}}</div>
        <ul>
          <li class="list-item" v-for="(child, index) in item.list" :key="index"
            @click="onClick(child)"
          >
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
          @touchstart.passive="onStart"
          @touchmove.passive="onMove"
          @touchend.passive="onEnd"
        >
          {{item.title}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import useFixed from './useFixed'
import useShortcut from './useShortcut'
export default defineComponent({
  name: 'IndexList',
  props: ['data', 'activeIndex'],
  emits: ['select'],
  setup (props, { emit }) {
    const container = ref(null)
    const indexList = ref(null)
    const titles = ref(null)
    const state = reactive({
      active: false,
      heights: null,
      indexs: null,
      activeIdx: 0
    })
    onMounted(() => {
      if (indexList.value) {
        const { heights, indexs } = useFixed(indexList)
        useShortcut(container, state)
        state.heights = heights
        state.indexs = indexs
      }
    })
    let startY = 0
    let pos = 0
    const onStart = (e) => {
      startY = e.changedTouches[0].clientY
      const groundName = e.target.getAttribute('ground-name')
      pos = state.indexs.indexOf(groundName)
      const scrollTop = state.heights.get(groundName)
      state.activeIdx = pos
      container.value.scrollTop = scrollTop
    }
    const onMove = (e) => {
      const dx = e.changedTouches[0].clientY - startY
      const step = pos + Math.floor(dx / 16)
      state.activeIdx = step
      scrollByIdx(step)
    }
    const onEnd = (e) => {
      console.info('end')
      pos = 0
    }
    const onClick = (item) => {
      emit('select', item)
    }
    const scrollByIdx = (idx) => {
      const groundName = state.indexs[idx]
      const scrollTop = state.heights.get(groundName)
      container.value.scrollTop = scrollTop
    }
    return {
      container,
      indexList,
      titles,
      state,
      onStart,
      onMove,
      onEnd,
      onClick
    }
  }
})
</script>

<style lang="scss">
.index-wrapper {
  position: relative;
  height: 100%;
  overflow: scroll;
  .index-list {
    .list-title {
      height: 27px;
      font-size: 16px;
      position: sticky;
      line-height: 27px;
      top: 0px;
      padding-left: 10px;
      color: rgba(255, 255, 255, 0.5);
      background: #333;
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
    font-size: 12px;
    background: rgba(0, 0, 0, 0.3);
    right: 4px;
    top: 20%;
    padding: 20px 0;
    width: 20px;
    border-radius: 10px;
    text-align: center;
    .item {
      padding-bottom: 3px;
    }
    .active {
      color: yellow;
    }
  }
}
</style>>
