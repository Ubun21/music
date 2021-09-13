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

  let line = 0 // 用来记录上次歌词的位置
  let count = 0
  const skipScroll = 5 // 开头的5项不滚动
  const currentLine = computed(() => {
    const index = Math.floor(currentTime.value)
    const lyric = playingLyric.value
    if (lyric && lyric.body[index]) {
      if ((count < skipScroll) && (line !== index)) {
        count++
      } else if ((line !== index)) {
        scrollLyric()
      }
      line = index
      return index
    }
    return line
  })
  let lastScrollTop = 0
  const scrollLyric = () => {
    const lyricWrapperEl = lyricWrapper.value
    const itemEl = item.value
    const itemElWidth = itemEl.clientHeight
    lyricWrapperEl.scrollTop = itemElWidth + lastScrollTop
    lastScrollTop = lyricWrapperEl.scrollTop
  }
  watch(
    currentSong,
    async (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      const lyricWrapperEl = lyricWrapper.value
      const lyric = await getLyric(newSong)
      playingLyric.value = parserLyric(lyric)
      line = 0
      count = 0
      lastScrollTop = 0
      if (lyricWrapperEl) {
        lyricWrapperEl.scrollTop = 0
      }
    }
  )
  return {
    playingLyric,
    currentLine,
    lyricWrapper,
    item
  }
}
