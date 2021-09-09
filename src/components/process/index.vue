<template>
  <slider :useProcess="percentage" @processchange="changeHandle"></slider>
  <span>{{time}}, {{duration}}, {{playmode}}</span>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import Slider from '../slider/index.vue'

export default defineComponent({
  name: 'UseProcess',
  props: {
    playmode: { // 糟糕的名字
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      require: true
    },
    time: {
      type: Number
    }
  },
  components: {
    Slider
  },
  setup (props) {
    const state = ref('init')
    const startTime = ref(0)
    const pauseTime = ref(0)
    const timeId = ref(null)
    const percentage = ref(0)

    const tick = () => {
      const t = Date.now() - startTime.value
      console.info('t', t)
      let process = t / props.duration
      if (process > 1) {
        process = 100
        percentage.value = 100
        state.value = 'done'
        return
      }
      percentage.value = Number(process).toFixed(4) * 100
      timeId.value = setTimeout(() => {
        tick()
      }, 1000)
    }
    const changeHandle = (e) => {
      debugger
      const process = e.process
      startTime.value = Date.now() - props.duration * (process / 100)
      if (state.value === 'done' || state.value === 'init') {
        tick()
      }
    }
    // todo remove
    watch(
      () => props.playmode,
      (newVal) => {
        if (newVal === 'play' && state.value === 'init') {
          startTime.value = Date.now()
          state.value = 'playing'
          tick()
          return
        }

        if (newVal === 'pause' && state.value === 'playing') {
          pauseTime.value = Date.now()
          clearTimeout(timeId.value)
          state.value = 'paused'
          return
        }

        if (newVal === 'resume' && state.value === 'paused') {
          startTime.value = Date.now() - (pauseTime.value - startTime.value)
          state.value = 'playing'
          tick()
        }
      }
    )
    watch(
      () => props.time,
      (time) => {
        console.info(time)
      }
    )
    watch(state, (newState) => {
      if (newState === 'done') {
        clearTimeout(timeId.value)
      }
    })
    return {
      state,
      startTime,
      timeId,
      pauseTime,
      percentage,
      changeHandle
    }
  }
})
</script>
