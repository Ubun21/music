<template>
  <div class="slider-wraper" @touchstart="touchStartHandler" ref="container">
    <div class="slider__bar" :style="{width: styleWidth}"></div>
    <div class="slider__button"
     :style="{ left: styleLeft}"
     @touchmove="touchMoveHandler"
     @touchend="touchEndHandler">
      <div class="button"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
export default defineComponent({
  name: 'SLIDER',
  props: {
    useProcess: {
      type: Number,
      default: 0
    }
  },
  emits: {
    processchange: null
  },
  setup (props, context) {
    const container = ref(null)
    const containerRect = ref(null)
    const lastTouchPointX = ref(0)
    const process = ref(0)
    const moveProcess = ref(0)
    const styleWidth = ref('')
    const styleLeft = ref('')

    onMounted(() => {
      if (container.value) {
        containerRect.value = container.value.getBoundingClientRect()
      }
    })

    const touchStartHandler = (e) => {
      const clientX = e.changedTouches[0]?.clientX
      lastTouchPointX.value = clientX
      process.value = ((clientX - containerRect.value.x) / containerRect.value.width).toFixed(4) * 100
      styleWidth.value = `${process.value}%`
      styleLeft.value = `${process.value}%`
      context.emit('processchange', { process: process.value })
    }

    const touchMoveHandler = (e) => {
      const clientX = e.changedTouches[0]?.clientX
      const dx = clientX - lastTouchPointX.value
      moveProcess.value = (dx / containerRect.value.width).toFixed(4) * 100 + process.value
      if (moveProcess.value > 100) {
        moveProcess.value = 100
      } else if (moveProcess.value < 0) {
        moveProcess.value = 0
      }
      styleWidth.value = `${moveProcess.value}%`
      styleLeft.value = `${moveProcess.value}%`
    }

    const touchEndHandler = () => {
      process.value = moveProcess.value
      context.emit('change', { process: process.value })
    }
    watch(
      () => props.useProcess,
      (newVal) => {
        if (newVal < 0 || newVal > 100) {
          return
        }
        styleWidth.value = `${newVal}%`
        styleLeft.value = `${newVal}%`
        process.value = newVal
      }
    )
    return {
      container,
      containerRect,
      lastTouchPointX,
      process,
      moveProcess,
      styleWidth,
      styleLeft,
      touchStartHandler,
      touchMoveHandler,
      touchEndHandler
    }
  }
})
</script>

<style lang="scss">
.slider-wraper {
  height: 6px;
  position: relative;
  background: red;
  .slider__bar {
    height: 6px;
    background: burlywood;
    width: 0;
  }
  .slider__button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
    height: 36px;
    width: 36px;
    top: -15px;
    .button {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: wheat;
    }
  }
}
</style>
