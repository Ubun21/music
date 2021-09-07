<template>
  <div class="music-list" ref="list">
    <div class="title" ref="head">
      <div class="back">
        <button @click="clickHandle">back</button>
      </div>
      <h1 class="text">{{title}}</h1>
    </div>
    <div class="bg-image-wrapper">
      <div class="bg-image" :style="bgImageStyle">
      </div>
    </div>
    <div class="list-wrapper"
      @touchstart="start"
      @touchmove="move"
      @touchend="end"
      :style="styleHeight"
      ref="listWrapper"
    >
      <song-list
        :songs="songs"
        @selectItem="selectHandle"
      ></song-list>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SongList from '../song-list/index'
export default defineComponent({
  name: 'Music-List',
  components: {
    SongList
  },
  props: {
    songs: Array,
    title: String,
    pic: String
  },
  setup (props) {
    const state = reactive({
      paddingTop: 0, // 用来设置bgImage的高度
      maxTranslate: 0,
      titleHeight: 0,
      filteValue: 0,
      overflow: 'hidden',
      scale: 1
    })
    const router = useRouter() // 用来返回上级
    const list = ref(null) // 用来计算父容器的宽度
    const head = ref(null) // 用来计算title的高度
    const store = useStore()
    const listWrapper = ref(null) // 用来得到scrollTop
    const styleHeight = computed(() => {
      const { height } = window.visualViewport
      const result = height - state.paddingTop
      return {
        height: `${result}px`,
        overflow: state.overflow
      }
    })
    onMounted(() => {
      if (list.value) {
        const { width } = list.value.getBoundingClientRect()
        const titleHeight = head.value.clientHeight
        state.maxTranslate = width * 0.7
        state.titleHeight = titleHeight
        state.paddingTop = state.maxTranslate
      }
    })
    let startY = 0
    const start = (e) => {
      startY = e.changedTouches[0].clientY
    }
    // 用来扣除上一次移动已经移动的距离
    let lastDx = 0
    const disableTrans = false
    const move = (e) => {
      const dx = e.changedTouches[0].clientY - startY
      const paddingTop = state.paddingTop
      const temp = paddingTop + dx - lastDx
      // if ((dx < 0 && temp <= state.titleHeight) || (dx > 0 && temp >= state.maxTranslate)) {
      //   if (te)
      //   return
      // }
      // 往上拉到bgImage最小值之后，不再移动，同时设置overflow为auto
      if (dx < 0 && temp <= state.titleHeight) {
        state.overflow = 'auto'
        return
      }
      if (listWrapper.value.scrollTop !== 0) {
        return
      }
      // 往上拉到最小值后, overflow为auto，使得song-list的子内容可以滚动
      // 在song-list scrollTop为0时,往下移动的时候overflow为hide
      // scrollTop 不为0的时候 往下拉时禁止移动bgImage
      // 往下拉到bgImage最大值后，不在移动
      if (dx > 0 && temp >= state.maxTranslate) {
        state.overflow = 'hidden'
        return
      }
      e.preventDefault()
      if (!disableTrans) {
        state.paddingTop = temp
      }
      upFilterVal(dx)
      lastDx = dx
    }
    let index = 0
    let lastIndex = 0
    const upFilterVal = (dx) => {
      // 用来映射每一段dx距离对于filter的值
      // const arr = [0, 1, 3, 5, 7, 8, 9, 11, 13, 15]
      index += Number((dx / state.maxTranslate).toFixed(1) * 10) - lastIndex
      lastIndex = index
      state.filteValue = -index
    }
    const end = (e) => {
      startY = 0
      lastDx = 0
    }
    const paddingTop = computed(() => {
      return `${state.paddingTop}px`
    })
    const filte = computed(() => {
      return `blur(${state.filteValue}px)`
    })
    const bgImageStyle = computed(() => {
      return {
        backgroundImage: `url(${props.pic})`,
        paddingTop: paddingTop.value,
        filter: filte.value,
        transform: `scale(${state.scale})`
      }
    })
    const height = computed(() => {
      const { height } = window.visualViewport
      const bgHeight = state.paddingTop
      return height - bgHeight
    })
    const clickHandle = () => {
      router.go(-1)
    }
    const selectHandle = (list, index) => {
      store.dispatch('selectPlay', { list, index })
    }
    return {
      state,
      bgImageStyle,
      height,
      list,
      head,
      listWrapper,
      start,
      move,
      end,
      clickHandle,
      styleHeight,
      selectHandle
    }
  }
})
</script>

<style lang="scss">
.music-list {
  .title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    text-align: center;
    z-index: 20;
    .back {
      position: absolute;
    }
    .text {
      flex: 1;
      font-size: 18px;
      color: aquamarine;
    }
  }
  .bg-image-wrapper {
    overflow: hidden; // 用来解决边界被blur的问题
    .bg-image {
      background-size: cover;
      filter: blur(0px);
    }
  }
  .list-wrapper {
    overflow: hidden;
  }
}
</style>
