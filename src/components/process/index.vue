<template>
  <slider :useProcess="percentage" @processchange="changeHandle"></slider>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import Slider from '../slider/index.vue'

export default defineComponent({
  name: 'Process',
  props: ['useInput', 'duration'],
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
      timeId.value = setInterval(() => {
        const t = Date.now() - startTime.value
        let process = t / props.duration
        if (process > 1) {
          process = 100
          percentage.value = 100
          state.value = 'done'
          return
        }
        console.info(Number(process).toFixed(4))
        percentage.value = Number(process).toFixed(4) * 100
      }, 500)
    }

    const changeHandle = (e) => {
      const process = e.process
      startTime.value = Date.now() - props.duration * (process / 100)
      if (state.value === 'done' || state.value === 'init') {
        tick()
      }
    }

    watch(
      () => props.useInput,
      (newVal) => {
        console.info('exe')
        if (newVal === 'play' && state.value === 'init') {
          startTime.value = Date.now()
          state.value = 'playing'
          tick()
          return
        }

        if (newVal === 'pause' && state.value === 'playing') {
          pauseTime.value = Date.now()
          clearInterval(timeId.value)
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
