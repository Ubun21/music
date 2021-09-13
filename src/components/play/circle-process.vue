<template>
  <div class="circle-process">
    <div class="control-left" @click.stop="pause">
      <svg
        class="process-wrapper"
        :width="radius"
        :height="radius"
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="process"
          cx="50"
          cy="50"
          r="50"
          fill="transparent"
          stroke-width="10"
          :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
        <circle class="process-background"
          cx="50"
          cy="50"
          r="50"
          fill="transparent"
          stroke-width="10"/>
      </svg>
      <i class="icon-mini" :class="playing"></i>
    </div>
    <div class="control-right">
      <i class="icon-playlist"></i>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'CircleProcess',
  props: ['radius', 'process', 'pauseHandle'],
  setup (props) {
    const store = useStore()
    const dashArray = computed(() => Math.PI * 100)
    const dashOffset = computed(() => {
      return (1 - props.process) * Math.PI * 100
    })
    const playing = computed(() => {
      const isPlaying = store.state.playing
      if (isPlaying) {
        return 'icon-play-mini'
      }
      return 'icon-pause-mini'
    })
    const pause = () => {
      props.pauseHandle()
    }
    return {
      dashArray,
      dashOffset,
      pause,
      playing
    }
  }
})
</script>

<style lang="scss">
.circle-process {
  display: flex;
  justify-content: space-around;
  .control-left {
    flex: 0 0 30px;
    position: relative;
    padding: 0 10px;
    .process-wrapper {
      .process-background {
        transform-origin: center;
        transform: scale(0.9);
        stroke: rgba(255, 205, 49, 0.5);
      }
      .process {
        transform-origin: center;
        transform: scale(0.9) rotate(-90deg);
        stroke: #ffcd32;
      }
    }
    .icon-mini {
      position: absolute;
      top: 0px;
      left: 10px;
      font-size: 32px;
      color: rgba(255, 205, 49, 0.5);
    }
  }
  .control-right {
    flex: 0 0 30px;
    padding: 0 10px;
    .icon-playlist {
      vertical-align: middle;
      line-height: 1;
      color: rgba(255, 205, 49, 0.5);
      font-size: 30px;
    }
  }
}
</style>
