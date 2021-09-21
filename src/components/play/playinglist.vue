<template>
  <teleport to="body">
    <transition name="slider">
      <div class="playinglist-wrapper" v-if="visiual">
        <div class="list-wrapper">
          <div class="list-head">
            <span class="icon-mode">
              <i :class="modeIcon" @touchstart="changeMode"></i>
            </span>
            <span class="mode">
              {{getModeText}}
            </span>
            <span class="icon-del">
              <i class="icon-clear"></i>
            </span>
          </div>
          <div class="list-content">
            <ul>
              <li class="item" v-for="(song, index) in playList" :key="index">
                <div class="left">
                  <i class="icon" :class="currentIndex(index)"></i>
                </div>
                <div class="center" @touchstart.stop="selectCurrSong(index)">
                  {{song.name}}
                </div>
                <div class="right">
                  <span class="faovrite">
                    <i class="icon-not-favorite"></i>
                  </span>
                  <span class="dele">
                    <i class="icon-delete"></i>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="list-add">
            <div class="add">
              <i class="icon-add"></i>
              <span>添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @touchstart="closeHandle">
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import useChangeMode from './useChangeMode'
export default defineComponent({
  name: 'PlayList',
  setup (props) {
    const store = useStore()
    const { modeIcon, changeMode } = useChangeMode()
    const modeText = ['顺序播放', '单曲循环', '随机播放']
    const playMode = computed(() => store.state.playMode)
    const getModeText = computed(() => {
      return modeText[playMode.value]
    })
    const playList = computed(() => store.state.playList)
    const playingSongIndex = computed(() => store.state.currentIndex)
    const visiual = computed(() => store.state.visiual)
    const closeHandle = () => {
      store.dispatch('setVisiual', false)
    }
    const currentIndex = (index) => {
      if (playingSongIndex.value === index) {
        return 'icon-play'
      }
      return ''
    }
    const selectCurrSong = (index) => {
      console.info('index', index)
      store.dispatch('setCurrentIndex', index)
      store.dispatch('setPlayState', false)
    }
    return {
      modeIcon,
      changeMode,
      getModeText,
      playList,
      playingSongIndex,
      visiual,
      closeHandle,
      currentIndex,
      selectCurrSong
    }
  }
})
</script>

<style lang="scss" scoped>
.playinglist-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  z-index: 300;
  color: rgba(255, 255, 255, 0.5);
  .list-head {
    padding: 20px 30px 10px 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
    .icon-mode {
      margin-right: 10px;
      font-size: 24px;
      color: rgba(255, 205, 49, 0.5);
    }
    .mode {
      flex: 1;
      color: rgba(255, 255, 255, 0.5)
    }
    .icon-del {
      color: rgba(255, 255, 255, 0.3)
    }
  }
  .list-content {
    max-height: 240px;
    overflow: auto;
    font-size: 14px;
    .item {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 30px 0 20px;
      .left {
        display: inline-block;
        height: 12px;
        width: 20px;
        .icon {
          font-size: 12px;
          color: #ffcd32;
        }
      }
      .center {
        flex: 1;
        font-size: 14px
      }
      .right {
        font-size: 12px;
        color: #ffcd32;
        .faovrite {
          padding-right: 14px;
        }
      }
    }
  }
  .list-add {
    width: 140px;
    margin: 20px auto 30px auto;
    font-size: 12px;
    .add {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 100px;
      color: rgba(255, 255, 255, 0.5);
      .icon-add {
        padding-right: 5px;
      }
    }
  }
  .list-footer {
    text-align: center;
    line-height: 50px;
    background: #222;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
