<template>
  <div class="play-wrapper">
    <div class="normal-play" v-if="fullScreen">
      <div class="background">
        <img class="image" :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back">
          <i class="icon-back" @click="goBack"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <h2 class="subtitle">{{currentSong.singer}}</h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <!-- <img :src="currentSong.pic" /> -->
        </div>
        <div class="middle-r">
        </div>
      </div>
      <div class="bottom">
        <div class="opeartor">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left" :class="{disable: state.disableCls}">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="{disable: state.disableCls}">
            <i :class="state.iconCenterCls" @click="pauseHandle"></i>
          </div>
          <div class="icon i-right" :class="{disable: state.disableCls}">
            <i class="icon-next" :class="state.disableCls" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i :class="getIconFavourite(currentSong)"
              @click="changefavouriteStatus(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioEl"
      :src="currentSong.url"
      @canplay="canPlay"
    ></audio>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import useChangeMode from './useChangeMode'
import useFavorite from './useFavorite'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Player',
  setup () {
    const state = reactive({
      iconCenterCls: 'icon-play',
      disableCls: true,
      songReady: false
    })
    const audioEl = ref(null)
    const store = useStore()
    window.store = store
    const fullScreen = computed(() => store.state.fullScreen)
    const playing = computed(() => {
      if (!state.songReady) {
        store.dispatch('setPlayState', false)
      }
      return store.state.playing
    })
    const currentSong = computed(() => store.getters.currentSong)
    const currentIndex = computed(() => store.state.currentIndex)
    const playList = computed(() => store.state.playList)

    // hook
    const { modeIcon, changeMode } = useChangeMode()
    const { getIconFavourite, changefavouriteStatus } = useFavorite()
    const goBack = () => {
      // todo 当浏览器的url变化的时候，页面没有退出
      store.dispatch('setFullScreen', false)
    }
    const pauseHandle = () => {
      if (!state.songReady) {
        return
      }
      store.dispatch('setPlayState', !playing.value)
    }
    const canPlay = () => {
      console.info('canPlay exe')
      if (state.songReady) {
        state.disableCls = false
        return
      }
      state.songReady = true
      state.disableCls = false
      store.dispatch('setPlayState', true)
    }
    const prev = () => {
      const list = playList.value
      let index = currentIndex.value
      if (list.length === 0 || !state.songReady) {
        return
      }
      if (list.length === 1) {
        loose()
        return
      }
      debugger
      if ((index - 1) === -1) {
        index = list.length - 1
        store.dispatch('setCurrentIndex', index)
        state.disableCls = true
        state.songReady = false
        return
      }
      store.dispatch('setCurrentIndex', index - 1) // 切换歌曲
      store.dispatch('setPlayState', false) // 切换歌曲时播放状态设置为false, 等待audio可以播放时再重置
      state.songReady = false
      state.disableCls = true
    }
    const next = () => {
      const list = playList.value
      let index = currentIndex.value
      if (list.length === 0 || !state.songReady) {
        return
      }
      if (list.length === 1) {
        loose()
        return
      }
      if ((index + 1) > list.length) {
        index = 1
        store.dispatch('setCurrentIndex', index)
        return
      }
      store.dispatch('setCurrentIndex', index + 1)
      store.dispatch('setPlayState', false)
      state.songReady = false
      state.disableCls = true
    }
    const loose = () => {
      audioEl.value.currentTime = 0
      audioEl.value.play()
    }
    onMounted(() => {
      if (audioEl.value) {
        if (playing.value) {
          audioEl.value.play()
        }
      }
    })
    watch(
      playing,
      (play) => {
        console.info('watch')
        if (!state.songReady) {
          return
        }
        const audio = audioEl.value
        if (play) {
          state.iconCenterCls = 'icon-pause'
          audio.play()
        } else {
          state.iconCenterCls = 'icon-play'
          audio.pause()
        }
      }
    )
    return {
      state,
      audioEl,
      fullScreen,
      currentSong,
      goBack,
      pauseHandle,
      canPlay,
      prev,
      next,
      // hook
      modeIcon,
      changeMode,
      getIconFavourite,
      changefavouriteStatus
    }
  }
})
</script>

<style lang="scss">
.play-wrapper {
  .normal-play {
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background: black;
    z-index: 200;
    .background {
      position: absolute;
      filter: blur(20px);
      opacity: 0.6;
      .image {
        height: 100vh; // todo
        width: 100vw; // todo
      }
    }
    .top {
      position: relative;
      text-align: center;
      color: #fff;
      .back {
        padding-left: 10px;
        color: yellow;
        font-size: 18px;
      }
      .title {
        font-size: 18px;
        line-height: 40px;
      }
      .subtitle {
        line-height: 20px;
      }
      .back {
        line-height: 40px;
        position: absolute;
      }
    }
    .bottom {
      position: relative;
      .opeartor {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          font-size: 30px;
          color: yellow;
        }
        .icon.disable {
          color: rgba(255, 205, 49, 0.5);
        }
        .i-center {
          font-size: 40px
        }
        .icon.i-left {
          text-align: right;
        }
        .icon.i-center {
          padding: 0 20px;
          text-align: center;
        }
        .icon.i-right {
          text-align: left;
        }
      }
    }
  }
}
</style>
