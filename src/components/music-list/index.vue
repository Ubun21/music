<template>
    <div class="music-list" v-if="songs">
      <div class="head-wrapper" :style="HeadWrapperStyle">
        <div ref="bgImageRef" class="head-bgImage" :style="bgImageStyle">
        </div>
      </div>
      <div class="back">
        <i class="icon-back" @click="goBack"></i>
      </div>
      <div ref="titleRef" class="title">
        {{title}}
      </div>
      <div class="list-wrapper"
        @touchstart="start"
        @touchmove="move"
        @touchend="end"
        ref="listWrapperRef"
        :style="transformStyle"
        :class="active"
      >
        <song-list
          :songs="songs"
          @selectItem="selectHandle"
        ></song-list>
      </div>
    </div>
</template>

<script>
import { computed, defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Animation, TimeLine } from '@/lib/animation'
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
    const store = useStore()
    const router = useRouter()

    const instance = getCurrentInstance()
    const bgImageRef = ref(null)
    const titleRef = ref(null)
    const listWrapperRef = ref(null)
    const translateY = ref(0)
    const scale = ref(1) // 控制头部内容缩放大小
    const blur = ref(0) // 控制头部内容模糊大小
    const isActive = ref(false) // 控制list-wrapper是否可以滑动
    let maxTranslateX = 0
    let startY = 0
    let lastBlur = 0
    let lastTranslateY = 0
    const timeLine = new TimeLine()
    const transformStyle = computed({
      get () {
        const style = `translateY(${translateY.value}px)`
        return {
          transform: style
        }
      },
      set (val) {
        if (!val) return
        translateY.value = val
      }
    })
    const bgImageStyle = computed(() => {
      return {
        backgroundImage: `url(${props.pic})`,
        filter: `blur(${blur.value}px)`
      }
    })
    const HeadWrapperStyle = computed({
      get () {
        return {
          transform: `scale(${scale.value})`
        }
      },
      set (val) {
        if (!val) return
        scale.value = val
      }
    })
    const active = computed(() => {
      if (isActive.value) {
        return 'active'
      }
      return ''
    })
    onMounted(() => {
      const bgImageEl = bgImageRef.value
      const titleEl = titleRef.value
      maxTranslateX = bgImageEl.clientHeight - titleEl.clientHeight
    })
    const start = (e) => {
      startY = e.changedTouches[0].clientY
    }
    const move = (e) => {
      if (!maxTranslateX) {
        return
      }
      const moveY = e.changedTouches[0].clientY
      const dx = moveY - startY
      const percentage = dx / maxTranslateX
      const move = maxTranslateX * percentage + lastTranslateY
      const blueValue = lastBlur - 10 * percentage
      if (dx < 0 && Math.abs(move) >= maxTranslateX) {
        isActive.value = true
        return
      }
      if (listWrapperRef.value.scrollTop !== 0) {
        return
      }
      if (dx > 0 && listWrapperRef.value.scrollTop === 0) {
        isActive.value = false
      }
      if (dx > 0 && move > 0) {
        // 选择一个比maxTranslate小的多的底数,从而使得scale比translateY快避免出现空隙
        const baseNumber = 100
        const percentage = move / baseNumber
        blur.value = 0
        lastBlur = 0
        if (Number(move) < 60) { // 限制下拉的最长距离
          scale.value = 1 + percentage
          translateY.value = move
        }
        return
      }
      blur.value = blueValue
      translateY.value = move
      console.info('move', move)
    }
    const end = (e) => {
      const dx = e.changedTouches[0].clientY - startY
      if (dx > 0 && translateY.value > 0) {
        const transAnimation = new Animation(instance.setupState, 'transformStyle', (v) => v, translateY.value,
          0, 0, 0.3
        )
        const scaleAnimation = new Animation(instance.setupState, 'HeadWrapperStyle', (v) => v, scale.value,
          1, 0, 0.3
        )
        timeLine.add(transAnimation)
        timeLine.add(scaleAnimation)
        timeLine.start()
        lastTranslateY = 0
        return
      }
      lastTranslateY = translateY.value
      lastBlur = blur.value
    }
    const goBack = () => {
      router.go(-1)
    }
    const selectHandle = (list, index) => {
      store.dispatch('selectPlay', { list, index })
    }
    return {
      bgImageRef,
      titleRef,
      listWrapperRef,
      active,
      transformStyle,
      bgImageStyle,
      HeadWrapperStyle,
      start,
      move,
      end,
      selectHandle,
      goBack
    }
  }
})
</script>
<style lang="scss" scoped>
.music-list {
  height: 100vh;
  overflow: hidden;
  .head-wrapper {
    overflow: hidden;
    .head-bgImage {
      padding-top: 70%;
      background-size: cover;
    }
  }
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: 22px;
      color: #ffcd32
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    text-align: center;
    line-height: 40px;
    height: 40px;
    font-size: 18px;
    color: #fff;
  }
  .list-wrapper {
    background: #222222;
  }
  .list-wrapper.active {
    height: calc(100vh - 40px);
    overflow: auto;
  }
}
</style>
