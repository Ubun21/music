import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '../../service/song'
import parserLyric from './parseLyric'

export default function useLyric (state) {
  const store = useStore()
  const lyricWrapper = ref(null)
  const item = ref(null)
  const playingLyric = ref(null)
  const currentTime = computed(() => state.currentTime)
  const currentSong = computed(() => store.getters.currentSong)
  const timeMapElementArray = ref([])
  // currentLine 要接受2个数据源一个是currentTime和外界传进来要跳转的位置
  const currentLine = ref(0)
  const findLyricIndexByTime = (time) => {
    time = Math.floor(time)
    const lyric = timeMapElementArray.value[time]
    const keys = Object.keys(playingLyric.value.body)
    if (!lyric || !lyric.head) {
      return
    }
    const index = keys.findIndex(item => item === lyric.head)
    return index
  }
  const findLyricHeadByIndex = (index) => {
    if (index === 'undefined' || !playingLyric.value) {
      return
    }
    const keys = Object.keys(playingLyric.value.body)
    return keys[index]
  }
  let lastIndex = -1
  watch(
    currentTime,
    (newTime) => {
      const index = findLyricIndexByTime(newTime)
      const lyricWrapperEl = lyricWrapper.value
      const itemHeight = item.value.clientHeight
      currentLine.value = findLyricHeadByIndex(index)
      if (lastIndex === index) {
        return
      }
      if (index < 6) {
        lastIndex = index
        lyricWrapperEl.scrollTop = 0
        return
      }
      const scrollTop = itemHeight * index - itemHeight * 5
      lyricWrapperEl.scrollTop = scrollTop
      lastIndex = index
    }
  )
  watch(
    currentSong,
    async (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const lyricWrapperEl = lyricWrapper.value
      const lyric = await getLyric(newSong)
      const { parsetedLyric, timeMapElementIdx } = parserLyric(lyric)
      playingLyric.value = parsetedLyric
      debugger
      timeMapElementArray.value = timeMapElementIdx
      currentLine.value = 0
      lastIndex = -1
      state.indicatorLineTime = 0
      if (lyricWrapperEl) {
        lyricWrapperEl.scrollTop = 0
      }
    }
  )
  // watch(
  //   () => state.songReady,
  //   (ready) => {
  //     if (ready) {
  //       console.info('come from useLyric', lyricWrapper.value.children)
  //     }
  //   }
  // )
  return {
    timeMapElementArray,
    findLyricHeadByIndex,
    playingLyric,
    currentLine,
    lyricWrapper,
    item
  }
}
