<template>
  <div class="carousel-item"
    @touchstart.passive="start"
    @touchmove.passive="move"
    @touchend.passive="end"
    :style="itemStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  inject,
  onMounted,
  reactive,
  computed,
  watch
} from 'vue'
import { Animation, TimeLine } from '@/lib/animation.js'
export default defineComponent({
  name: 'CarouselItem',
  props: {
    key: {
      require: true
    },
    index: {
      require: true
    }
  },
  emits: ['active'],
  setup (props, context) {
    // position 代表每一个子组件的位置
    const data = reactive({
      translate: 0,
      position: null
    })

    const instance = getCurrentInstance()
    const scopeCarousel = inject('CarouselChildren')

    let called = false
    const itemStyle = computed(() => {
      const value = `translateX(${data.translate}px)`
      if (!called && data.translate === 0) {
        called = true
        return ''
      }
      return {
        transform: value
      }
    })
    const isFclick = computed(() => {
      if (!scopeCarousel) {
        return false
      }
      const result = scopeCarousel.isFclick.value
      console.info('fclick result', result)
      return result
    })
    const setTranslate = computed({
      get () {
        return data.translate
      },
      set (value) {
        data.translate = value
      }
    })

    // todo remove
    const translateItem = (index, activeIndex) => {
      // data.translate = calTranslate(index, activeIndex)
    }

    // const calTranslate = (index, activeIndex) => {
    //   const width = scopeCarousel.offsetWidth
    //   return width.value * (index - activeIndex)
    // }
    onMounted(() => {
      if (scopeCarousel.addItem) {
        scopeCarousel.addItem({
          id: instance.uid,
          instance: instance,
          translateItem,
          setTranslate
        })
      }
    })
    let startX = 0
    // 当发生y上的移动时
    let startY = 0
    let moved = false
    let offset = 0
    const start = (e) => {
      e.stopPropagation()
      startX = getClientX(e)
      startY = getClientY(e)
      scopeCarousel.data.pauser()
      // 计算动画产生的偏移
      const width = scopeCarousel.offsetWidth.value
      const itemTranslate = Math.floor(scopeCarousel.items.value[data.position].setTranslate)
      offset = data.position * width + itemTranslate
    }
    const move = (e) => {
      if (!scopeCarousel.data.childReady) {
        return
      }
      moved = true
      e.stopPropagation()
      const dx = getClientX(e) - startX
      const dy = getClientY(e) - startY
      if (dy < -10 || dy > 10) {
        return
      }
      const width = scopeCarousel.offsetWidth.value
      const { prePos, nextPos, currItem, preItem, nextItem } = getTriple()
      const preBase = -width * prePos - width + offset
      const base = -width * data.position + offset
      const nextBase = -width * nextPos + width + offset
      currItem.setTranslate = base + dx
      preItem.setTranslate = preBase + dx
      nextItem.setTranslate = nextBase + dx
    }
    const end = (e) => {
      if (!moved) {
        return
      }
      const dx = getClientX(e) - startX
      const width = scopeCarousel.offsetWidth.value
      const fclick = scopeCarousel.isFclick.value
      const speed = fclick ? 0.3 : 1
      let direction = 0
      if ((dx < -width / 2) || (fclick && dx < 0)) {
        direction = -1
      } else if ((dx > width / 2) || ((fclick && dx > 0))) {
        direction = 1
      }
      const timeLine = new TimeLine()
      const { length, prePos, nextPos, currItem, preItem, nextItem } = getTriple()
      const preOffset = Math.floor(preItem.setTranslate)
      const currOffset = Math.floor(currItem.setTranslate)
      const nextOffset = Math.floor(nextItem.setTranslate)
      const preAnimation = new Animation(preItem, 'setTranslate', (v) => v,
        preOffset,
        -width - width * prePos + width * direction,
        0,
        speed
      )
      const curAnimation = new Animation(currItem, 'setTranslate', (v) => v,
        currOffset,
        -width * data.position + width * direction,
        0,
        speed
      )
      const nextAnimation = new Animation(nextItem, 'setTranslate', (v) => v,
        nextOffset,
        width - width * nextPos + width * direction,
        0,
        speed
      )
      timeLine.add(preAnimation)
      timeLine.add(curAnimation)
      timeLine.add(nextAnimation)
      timeLine.start()
      scopeCarousel.data.activeIndex = (data.position - direction + length) % length
      context.emit('active', scopeCarousel.data.activeIndex)
      if (scopeCarousel.loop) {
        setTimeout(scopeCarousel.nextPic, 2000)
      }
    }
    const getTriple = () => {
      if (!scopeCarousel.data.childReady) {
        return null
      }
      const length = scopeCarousel.items.value.length
      const prePos = (data.position - 1 + length) % length
      const nextPos = (data.position + 1) % length
      const currItem = scopeCarousel.items.value[data.position]
      const preItem = scopeCarousel.items.value[prePos]
      const nextItem = scopeCarousel.items.value[nextPos]
      return { length, prePos, nextPos, currItem, preItem, nextItem }
    }
    const getClientX = (e) => e.changedTouches[0].clientX
    const getClientY = (e) => e.changedTouches[0].clientY
    watch(
      () => scopeCarousel.data.childReady,
      (newValue) => {
        if (newValue) {
          scopeCarousel.items.value.forEach((item, index) => {
            if (item.instance.uid === instance.uid) {
              data.position = index
            }
          })
        }
      }
    )
    return {
      start,
      move,
      end,
      data,
      itemStyle,
      isFclick
    }
  }
})
</script>

<style lang="scss">
.carousel-item {
  width: 100%;
  display: inline-block;
  vertical-align: middle;
}
</style>
