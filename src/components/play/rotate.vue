<template>
  <div class="rotate-wrapper">
    <div class="play" :class="cls" :style="borderStyle" ref="wrapper">
      <img :src="url" />
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref, computed } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Rotate',
  props: {
    url: {
      type: String
    },
    borderWidth: {
      type: Number,
      default: 0
    }
  },
  setup (props) {
    const cls = ref('pause')
    const store = useStore()
    const playing = computed(() => store.state.playing)
    const borderStyle = computed(() => {
      const borderStri = '6px solid lawngreen'
      if (props.borderWidth !== 0) {
        return { border: `${props.borderWidth}px solid lawngreen` }
      }
      return { border: borderStri }
    })
    watch(
      playing,
      (playing) => {
        if (playing) {
          cls.value = 'running'
        } else {
          cls.value = 'pause'
        }
      }
    )
    return {
      cls,
      borderStyle
    }
  }
})
</script>

<style lang="scss">
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.rotate-wrapper {
  .play {
    animation: rotate 20s linear infinite;
    border-radius: 50%;
    img {
      border-radius: 50%;
      height: 100%;
      width: 100%;
    }
  }
  .play.running {
    animation-play-state: running;
  }
  .play.pause {
    animation-play-state: paused;
  }
}
</style>
