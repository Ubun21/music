<template>
  <div class="wrapper"
     @touchstart="start" @touchmove="move" @touchend="end"
  >
    <slot></slot>
  </div>
</template>

<script>
import { TimeLine, Animation } from '@/lib/animation.js'
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'Ratate',
  props: {
    duration: {
      type: Number,
      default: 10,
      require: true
    }
  },
  emits: ['restart', 'puase'],
  setup (props, context) {
    const timeLine = ref(null)
    const animation = ref(null)
    const el = ref(null)
    const rect = ref(null)
    const startAngel = ref(0)
    const lastProces = ref(0)
    if (!context.slots) {
      throw new Error('slot could be emptry')
    }
    onMounted(() => {
      const elslots = context.slots.default()?.[0]?.el
      rect.value = elslots.getBoundingClientRect()
      el.value = elslots
      timeLine.value = new TimeLine()
      animation.value = new Animation(elslots.style, 'transform', (v) => `rotate(${v}turn)`, 0, 1, 0, props.duration)
      timeLine.value.add(animation.value)
      timeLine.value.start()
    })
    const start = (e) => {
      e.preventDefault()
      timeLine.value.pause()
      startAngel.value = getAngel(e)
      const reg = /rotate\(([\s\S]+)turn\)/
      lastProces.value = Number(el.value.style?.transform.match(reg)[1])
      context.emit('puase', { process: lastProces.value })
    }
    const move = (e) => {
      e.preventDefault()
      let moveAngel = getAngel(e)
      if (startAngel.value > moveAngel) {
        moveAngel += 360
      }
      const dx = moveAngel - startAngel.value
      let process = Number(dx / 360)
      process += lastProces.value
      el.value.style.transform = `rotate(${process}turn)`
    }
    const calcAngleDegrees = (x, y) => {
      let angle = Math.atan2(y, x) * 180 / Math.PI
      if (angle < 0) angle += 360
      return angle
    }
    const end = (e) => {
      const reg = /rotate\(([\s\S]+)turn\)/
      const process = Number(el.value.style?.transform.match(reg)[1])
      if (process >= 1) {
        return
      }
      context.emit('restart', { process: process })
      // 动画时间固定为5秒, todo
      const animation = new Animation(el.value.style, 'transform', (v) => `rotate(${v}turn)`, process, 1, 0, 5)
      timeLine.value.reset()
      timeLine.value.add(animation)
      timeLine.value.start()
    }
    const getAngel = (e) => {
      const { x, y, width } = rect.value
      const touch = e.changedTouches[0]
      const startX = touch.clientX - x - width / 2
      const startY = touch.clientY - y - width / 2
      return Math.floor(calcAngleDegrees(startX, startY))
    }
    return {
      timeLine,
      animation,
      startAngel,
      start,
      move,
      end,
      rect
    }
  }
})
</script>
