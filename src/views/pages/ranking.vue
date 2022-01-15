<template>
  <div class="ranking"
       @touchstart="touchStart"
       @touchmove="touchMove"
       @touchend="touchEnd"
       ref="ranking">
    <ul class="top-list">
      <li class="item" v-for="(item, index) in data" @click="selectTop(item)" :key="index">
        <div class="left">
          <img height="100" width="100" :src="item.pic" />
        </div>
        <div class="right">
          <ul class="list-item-wrapper">
            <li class="list-item" v-for="(song, index) in item.songList" :key="index">
              <span class="index">{{index}}.</span>
              <span class="name">{{song.songName}}-{{song.singerName}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { getTopList } from '../../service/top'
import { useRouter } from 'vue-router'
import { usePreventDefault } from '@/hooks/usePreventDefalut'
export default defineComponent({
  name: 'ranking',
  setup () {
    const data = ref(null)
    const ranking = ref(null)
    const router = useRouter()
    const { touchStart, touchMove, touchEnd } = usePreventDefault(ranking)
    onBeforeMount(async () => {
      const res = await getTopList()
      data.value = res.topList
      // console.info('res', res)
      // console.info(data.value)
    })
    const selectTop = (top) => {
      router.push({
        path: '/top/',
        query: {
          ...top
        }
      })
    }
    return {
      data,
      ranking,
      touchStart,
      touchMove,
      touchEnd,
      selectTop
    }
  }
})
</script>

<style lang="scss" scoped>
.ranking {
  width: 100vw;
  height: calc(100vh - 44px);
  overflow: auto;
  .top-list {
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      .right {
        flex: 1;
        height: 100px;
        overflow: hidden;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
        background: #333;
        .list-item-wrapper {
          display: flex;
          flex-flow: wrap;
          justify-items: center;
          padding: 0 20px;
          line-height: 100px;
          height: 100px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          .list-item {
            line-height: 26px;
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            .index {
              padding-right: 3px;
            }
          }
        }
      }
    }
  }
}
</style>
