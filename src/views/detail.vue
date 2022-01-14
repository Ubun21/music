<template>
  <div class="topDetail-wrapper" v-if="data">
    <music-list
      :songs="data.songs"
      :title="song.name"
      :pic="song.pic"
    ></music-list>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { processSongs } from '../service/song'
import MusicList from '../components/music-list/index'
import useAsync from '../hooks/useAsync'
export default defineComponent({
  name: 'detail',
  props: {
    getDataFn: {
      type: Function
    }
  },
  components: {
    MusicList
  },
  setup (props) {
    const route = useRoute()
    const song = { ...route.query }
    const { excute, data, loading, error } = useAsync(props.getDataFn)
    excute(song).then((res) => {
      const result = processSongs(res.songs)
      return result
    }).then((songs) => {
      data.value.songs = songs
    })
    return {
      song,
      data,
      loading,
      error
    }
  }
})
</script>
