<template>
  <div class="play-wrapper">
    <transition name="scala">
      <div class="normal-play" v-show="fullScreen">
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
        <div class="middle"
          @touchstart="onMiddleStart"
          @touchmove="onMiddleMove"
          @touchend="onMiddleEnd"
          @contextmenu="e => e.preventDefault()"
          ref="animationWrapper"
        >
          <div class="middle-l" ref="opacityBox" :style="{opacity : opacity}">
            <!-- <img :src="currentSong.pic" /> -->
            <div class="rotate">
              <rotate :url="currentSong.pic"></rotate>
            </div>
          </div>
          <div class="middle-r" ref="moveBox">
            <div class="lyric-wrapper" ref="lyricWrapper">
              <ul v-if="playingLyric !== null">
                <li v-for="(text, index) in playingLyric.body" :idx="index" :key="index">
                  <p ref="item" class="text" :class="{ active: Number(currentLine) === Number(index) }" v-if="text !== ''">
                    {{text}}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: activeIndex === 1}"></span>
            <span class="dot" :class="{active: activeIndex === 2}"></span>
          </div>
          <div class="process-wrapper">
            <span class="time time-left">{{formate(state.currentTime)}}</span>
            <use-process
              class="process-bar"
              :time="state.currentTime"
              :duration="currentSong.duration * 1000"
              :playmode="state.processState"
              @processchange="processchangeHandle"
              @movechange="moveChangeHandle"
              >
            </use-process>
            <span class="time time-right">{{formate(currentSong.duration)}}</span>
          </div>
          <div class="opeartor">
            <div class="icon i-left">
              <i :class="modeIcon" @touchstart.stop="changeMode"></i>
            </div>
            <div class="icon i-left" :class="{disable: state.disableCls}">
              <i class="icon-prev" @touchstart.stop="prev"></i>
            </div>
            <div class="icon i-center" :class="{disable: state.disableCls}">
              <i :class="state.iconCenterCls" @touchstart.stop="pauseHandle"></i>
            </div>
            <!-- click.stop不起作用 -->
            <div class="icon i-right" :class="{disable: state.disableCls}">
              <i class="icon-next" :class="state.disableCls" @touchstart.stop="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="getIconFavourite(currentSong)"
                @touchstart.stop="changefavouriteStatus(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="mini-play">
      <mini-play :process="state.process" :pauseHandle="pauseHandle"></mini-play>
    </div>
    <audio ref="audioEl"
      :src="currentSong.url"
      @canplay="canPlay"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import UseProcess from '../process/index'
import Rotate from './rotate'
import MiniPlay from './mini-play.vue'
import useChangeMode from './useChangeMode'
import useFavorite from './useFavorite'
import useAnimation from './useAnimation'
import useLyric from './useLyric'
import { useStore } from 'vuex'
import { formate, toFixed2 } from '../../assets/js/utils'

export default defineComponent({
  name: 'Player',
  components: {
    UseProcess,
    Rotate,
    MiniPlay
  },
  setup () {
    const state = reactive({
      iconCenterCls: 'icon-play',
      disableCls: true,
      songReady: false,
      process: 0,
      processState: '',
      rotate: false,
      currentTime: 0
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
    const { activeIndex, opacity, animationWrapper, moveBox, opacityBox, onMiddleStart, onMiddleMove, onMiddleEnd } = useAnimation()
    const { playingLyric, currentLine, lyricWrapper, item } = useLyric(state)
    const goBack = () => {
      // todo 当浏览器的url变化的时候，页面没有退出
      store.dispatch('setFullScreen', false)
    }
    const pauseHandle = () => {
      if (!state.songReady) {
        return
      }
      // 当在播放的时候，按下按钮为暂停, 当暂停是按下按钮为重新执行
      if (playing.value) {
        state.processState = 'pause'
      } else {
        state.processState = 'resume'
      }
      store.dispatch('setPlayState', !playing.value)
    }
    const canPlay = () => {
      // if (state.songReady) {
      //   state.disableCls = false
      //   return
      // }
      console.info('canplay')
      state.processState = 'play'
      state.songReady = true
      state.disableCls = false
      state.rotate = true
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
      if ((index + 1) >= list.length) {
        index = 0
        store.dispatch('setCurrentIndex', index)
        store.dispatch('setPlayState', false)
        state.songReady = false
        state.disableCls = true
        return
      }
      store.dispatch('setCurrentIndex', index + 1)
      store.dispatch('setPlayState', false)
      state.songReady = false
      state.disableCls = true
    }
    const updateTime = (e) => {
      state.process = Math.floor(e.target.currentTime) / currentSong.value.duration
      state.currentTime = e.target.currentTime
    }
    const processchangeHandle = (process) => {
      const duration = currentSong.value.duration
      const audio = audioEl.value
      const time = duration * toFixed2((Math.floor(process) / 100))
      state.currentTime = time
      audio.currentTime = time
    }
    const moveChangeHandle = (process) => {
      const duration = currentSong.value.duration
      const audio = audioEl.value
      audio.currentTime = duration * toFixed2((Math.floor(process) / 100))
      console.info(process)
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
    watch(
      currentSong,
      (newSong, preSong) => {
        if (newSong.id !== preSong.id && preSong.id) {
          state.processState = 'restart'
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
      updateTime,
      formate,
      processchangeHandle,
      moveChangeHandle,
      // hook
      opacity,
      animationWrapper,
      moveBox,
      opacityBox,
      modeIcon,
      changeMode,
      getIconFavourite,
      changefavouriteStatus,
      onMiddleStart,
      onMiddleMove,
      onMiddleEnd,
      playingLyric,
      currentLine,
      lyricWrapper,
      item,
      activeIndex
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
    .middle {
      position: fixed;
      top: 80px;
      bottom: 170px;
      width: 100%;
      box-sizing: border-box;
      white-space: nowrap;
      .middle-l {
        display: inline-block;
        width: 100%;
        .rotate {
          vertical-align: middle;
          width: 80%;
          margin: auto;
          height: 300px;
        }
      }
      .middle-r {
        background: transparent;
        vertical-align: middle;
        display: inline-block;
        width: 100%;
        height: 100%;
        .lyric-wrapper {
          height: 100%;
          overflow: auto;
          .text {
            color: rgba(255, 255, 255, 0.5);
            font-size: 14px;
            line-height: 32px;
            text-align: center;
          }
          .text.active {
            color: #fff;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      width: 100%;
      bottom: 50px;
      .dot-wrapper {
        text-align: center;
        .dot {
          display: inline-block;
          height: 8px;
          width: 8px;
          margin: 0 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5)
        }
        .dot.active {
          width: 20px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.8);
        }
      }
      .process-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .process-bar {
          flex: 1;
        }
        .time {
          display: inline-block;
          width: 40px;
          font-size: 6px;
          color: yellow;
        }
        .time-left {
          text-align: left;
        }
        .time-right {
          text-align: right;
        }
      }
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
