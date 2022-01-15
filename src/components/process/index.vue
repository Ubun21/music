<template>
  <slider
    :useProcess="percentage"
    @processchange="changeHandle"
    @change="moveChange"
    >
  </slider>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import Slider from '../slider/index.vue'

export default defineComponent({
  name: 'UseProcess',
  props: {
    playmode: {
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
  emits: ['processchange', 'movechange'],
  components: {
    Slider
  },
  setup (props, { emit }) {
    const state = ref('init')
    const startTime = ref(0)
    const pauseTime = ref(0)
    const timeId = ref(null)
    const percentage = ref(0)

    const tick = () => {
      const t = Date.now() - startTime.value
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
      const process = e.process
      startTime.value = Date.now() - props.duration * (process / 100)
      if (state.value === 'done' || state.value === 'init') {
        tick()
      }
      emit('processchange', process)
    }
    const moveChange = (e) => {
      const process = e.process
      startTime.value = Date.now() - props.duration * (process / 100)
      emit('movechange', process)
    }
    // 观察用户的输入的playmode, playmode: 'play'|'pause'|'resume'
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
          return
        }

        if (newVal === 'restart') {
          pauseTime.value = 0
          clearTimeout(timeId.value)
          percentage.value = 0
          state.value = 'playing'
          startTime.value = Date.now()
          tick()
        }
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
      changeHandle,
      moveChange
    }
  }
})
</script>
