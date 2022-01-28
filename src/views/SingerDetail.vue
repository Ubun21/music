<template>
  <transition name="swiper">
    <div class="music-wrapper" v-if="data.songs">
      <music-list
        :songs="data.songs"
        :title="data.title"
        :pic="data.pic"
      >
      </music-list>
    </div>
  </transition>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import MusicList from '../components/music-list/index'
import { useRoute } from 'vue-router'
import { getSingerDetail } from '../service/singer'
import { processSongs } from '../service/song'
export default defineComponent({
  name: 'SingerDetail',
  components: {
    MusicList
  },
  setup () {
    const data = reactive({
      songs: null,
      title: null,
      pic: null
    })
    const classes = ref([])
    const router = useRoute()
    onBeforeMount(async () => {
      const songs = await getSingerDetail({ mid: router.params.id })
      const result = await processSongs(songs.songs)
      data.songs = result
      data.title = router.params.name
      data.pic = router.params.pic
    })
    return {
      data,
      classes
    }
  }
})
</script>

<style lang="scss" scoped>
.music-wrapper {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
