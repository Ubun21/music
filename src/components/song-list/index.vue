<template>
  <div class="song-list">
    <ul>
      <li v-for="(item, index) in songs" :key="index">
        <div class="item">
          <h2>{{ item.name }}</h2>
          <p class="text">
            {{ item.singer }}|{{item.album}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, watch } from 'vue'
export default defineComponent({
  name: 'SongList',
  props: {
    songs: Array
  },
  setup (props) {
    watch(
      () => props.songs,
      (val) => {
        console.info('songlist props')
        console.info(val)
      }
    )
    return {}
  }
})
</script>

<style lang="scss">
.song-list {
  padding: 20px 30px;
  background: yellow;
  box-sizing: border-box;
  .item {
    height: 64px;
    font-size: 14px;
    .text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
