<template>
  <music-list
    :songs="data.songs"
    :title="data.title"
    :pic="data.pic"
    ></music-list>
</template>

<script>
import { defineComponent, onBeforeMount, reactive } from 'vue'
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
    const router = useRoute()
    onBeforeMount(async () => {
      const songs = await getSingerDetail({ mid: router.query.id })
      const result = await processSongs(songs.songs)
      data.songs = result
      data.title = router.query.name
      data.pic = router.query.pic
    })
    return {
      data
    }
  }
})
</script>
