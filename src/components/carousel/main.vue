<template>
  <div class="container">
    <div :class="classes"
      ref="root"
      :style="{ height: height }"
      >
      <slot></slot>
    </div>
    <div class="indicator-wrapper" v-show="enableDot">
      <ul class="indicator">
        <li class="indicator-item" v-for="(value, index) in data.childLength" :key="index">
          <div class="indicator-item__dot"
            :class="{ active: activeIdx === index }"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  provide,
  onMounted,
  reactive,
  watch,
  nextTick,
  onBeforeUnmount,
  computed
} from 'vue'
import { Animation, TimeLine } from '@/lib/animation.js'
export default defineComponent({
  name: 'Carousel',
  props: {
    height: {
      type: Number,
      require: true
    },
    loop: {
      type: Boolean,
      require: true,
      default: true
    },
    overHiden: {
      type: Boolean,
      require: true,
      default: false
    },
    nest: {
      type: Boolean,
      require: true,
      default: false
    },
    enableDot: {
      type: Boolean,
      require: true
    },
    index: {
      type: Number,
      default: 0
    },
    fclick: {
      type: Boolean,
      default: false
    }
  },
  emits: ['active'],
  setup (props, context) {
    const data = reactive({
      activeIndex: 0,
      childReady: false,
      timer: null,
      timeLine: null,
      childLength: 0,
      pauser: null
    })
    const items = ref([])
    const root = ref(null)
    const offsetWidth = ref(0)
    const offsetHeight = ref(0)
    const classes = ref(['carousel'])

    const setActiveItem = (index) => {
      data.activeIndex = index
    }

    const activeIdx = computed(() => {
      return data.activeIndex
    })

    // todo remove
    const isFclick = computed(() => {
      return props.fclick
    })

    if (props.overHiden) {
      classes.value.push('carousel--overhide')
    }

    if (props.nest) {
      classes.value.push('carousel--nest')
    }
    // const resetPositionItem = () => {
    // }

    const pre = () => {
      setActiveItem(-1)
    }

    const next = () => {
      setActiveItem(data.activeIndex + 1)
    }
    data.timeLine = new TimeLine()
    const nextPic = () => {
      if (!data.childReady || data.childLength === 0) {
        return
      }
      const width = offsetWidth.value
      const nextPos = (data.activeIndex + 1) % data.childLength
      const currItem = items.value[data.activeIndex]
      const nextItem = items.value[nextPos]
      const curAnimation = new Animation(currItem, 'setTranslate', (v) => v,
        -width * data.activeIndex,
        -width * data.activeIndex - width,
        0,
        1
      )
      const nextAnimation = new Animation(nextItem, 'setTranslate', (v) => v,
        -width * nextPos + width,
        -width * nextPos,
        0,
        1
      )
      data.timeLine.reset()
      data.timeLine.add(curAnimation)
      data.timeLine.add(nextAnimation)
      data.timeLine.start()
      data.activeIndex = nextPos
      data.timer = setTimeout(nextPic, 5000)
    }
    onMounted(() => {
      if (root.value) {
        offsetWidth.value = root.value.offsetWidth
        offsetHeight.value = root.value.offsetHeight
      }
      nextTick(() => {
        data.childLength = items.value.length
        if (items.value.length > 0) {
          data.childReady = true
        }
        if (props.loop) {
          data.timer = setTimeout(nextPic, 2000)
        }
      })
    })
    onBeforeUnmount(() => {
      if (data.timer != null) {
        clearTimeout(data.timer)
      }
    })
    data.pauser = () => {
      if (data.timer != null) {
        clearTimeout(data.timer)
        data.timeLine.pause()
      }
    }
    const addItem = (item) => {
      items.value.push(item)
    }
    provide('CarouselChildren', {
      addItem,
      offsetWidth,
      offsetHeight,
      data,
      items,
      nextPic: nextPic,
      loop: props.loop,
      isFclick
    })
    watch(
      () => data.activeIndex,
      (curr) => {
        data.activeIndex = curr
        context.emit('active', data.activeIndex)
        // resetPositionItem()
      }
    )
    // 根据props.index的值tranlsate子元素
    watch(
      () => props.index,
      (curr) => {
        if (!data.childReady && data.childLength) {
          return
        }
        if (curr < 0 && curr > data.childLength) {
          return
        }
        // todo 有待优化
        const width = offsetWidth.value
        const currPos = -width * curr
        const otherPos = -width * curr + width
        const currItem = items.value[curr]
        currItem.setTranslate = currPos
        items.value.forEach((item, index) => {
          if (index === curr) {
            return
          }
          item.setTranslate = otherPos
        })
      }
    )
    return {
      root,
      pre,
      next,
      classes,
      data,
      activeIdx,
      items,
      isFclick
    }
  }
})

</script>

<style lang="scss">
.container {
  position: relative;
  .carousel {
    white-space: nowrap;
    overflow: hidden;
 }
 .indicator-wrapper {
   position: absolute;
   left: 0;
   right: 0;
   bottom: 0;
   .indicator {
     display: flex;
     justify-content: center;
     .indicator-item {
       display: inline-block;
       .indicator-item__dot {
         display: inline-block;
         margin-right: 5px;
         height: 10px;
         width: 10px;
         background: red;
         border-radius: 50%;
       }
       .indicator-item__dot.active {
         background: burlywood;
       }
     }
   }
 }
}
</style>
