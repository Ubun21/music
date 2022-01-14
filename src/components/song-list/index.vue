<template>
  <div class="song-list">
    <ul>
      <li v-for="(item, index) in songs" :key="index"
        @click="clickHandle(songs, index)"
      >
        <div class="item">
          <h2 class="name">{{ item.name }}</h2>
          <p class="text">
            {{ item.singer }}|{{item.album}}
          </p>
        </div>
      </li>
      <li v-if="!isFullScreenSize" class="space"></li>
    </ul>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SongList',
  props: {
    songs: Array
  },
  emits: ['selectItem'],
  setup (props, { emit }) {
    const store = useStore()
    const isFullScreenSize = computed(() => store.state.fullScreen)
    const clickHandle = (songs, index) => {
      emit('selectItem', songs, index)
    }
    return {
      isFullScreenSize,
      clickHandle
    }
  }
})
</script>

<style lang="scss" scoped>
.song-list {
  padding: 20px 30px;
  box-sizing: border-box;
  .item {
    height: 64px;
    font-size: 14px;
    .name {
      color: #fff;
      margin-bottom: 3px;
    }
    .text {
      color: rgba(255, 255, 255, 0.3);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .space {
    height: 80px;
  }
}
</style>
