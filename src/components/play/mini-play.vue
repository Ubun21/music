<template>
  <transition name="slider">
      <div class="mini-play-wrapper" v-if="!fullScreen && playList.length">
      <div class="left" @click="setFullState">
        <rotate :url="currentSong.pic" :borderWidth="1"></rotate>
      </div>
      <div class="center">
        <carousel :loop="false">
          <carousel-item v-for="(item, index) in playList" :key="index">
            <h2 class="song-name">{{item.name}}</h2>
            <p class="singer-name">{{item.singer}}</p>
          </carousel-item>
        </carousel>
      </div>
      <div class="right">
        <circle-process
          :radius="32"
          :process="process"
          :pauseHandle="pauseHandle"
        >
        </circle-process>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, defineComponent } from 'vue'
import Rotate from './rotate.vue'
import Carousel from '../carousel/main'
import CarouselItem from '../carousel/item'
import CircleProcess from './circle-process'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'MiniPlay',
  components: {
    Rotate,
    Carousel,
    CarouselItem,
    CircleProcess
  },
  props: ['process', 'pauseHandle'],
  setup () {
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playList = computed(() => store.state.playList)
    const setFullState = () => {
      store.dispatch('setFullScreen', true)
    }
    return {
      fullScreen,
      currentSong,
      playList,
      setFullState
    }
  }
})
</script>

<style lang="scss">
.mini-play-wrapper {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  background: #333;
  height: 60px;
  left: 0;
  bottom: 0;
  z-index: 300;
  .left {
    flex-basis: 40px;
    padding: 0 10px 0 20px;
  }
  .center {
    flex: 1;
    background: yellow;
    overflow: hidden;
  }
  .right {
    flex-basis: 80px;
  }
}
</style>
