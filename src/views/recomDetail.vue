<template>
  <div class="albums-wrapper">
    <detail :getDataFn="getAlbumm"></detail>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getAlbumm } from '../service/recomment'
import Detail from './detail'
export default defineComponent({
  name: 'RecomDetail',
  components: {
    Detail
  },
  setup () {
    return {
      getAlbumm
    }
  }
})
</script>
