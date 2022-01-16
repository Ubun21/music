<template>
  <div class="me"
       @touchstart="touchStart"
       @touchmove="touchMove"
       @touchend="touchEnd"
       ref="me">
    <div class="search-input">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content" v-if="!query">
      <h1 class="search-content-title">热门搜索</h1>
      <ul class="hot-keys">
        <li class="key" v-for="(item, index) in hotKeys" :key="index">
          <span @click="hotKeyClicked(item.key)" class="key-text">{{item.key}}</span>
        </li>
      </ul>
      <div class="search-history">
        <div class="search-history-title">
          <span class="text">历史搜索</span>
          <span class="clear" @touchstart.stop="openConfirm">
            <i class="icon-clear"></i>
          </span>
        </div>
        <div class="search-history-list">
          <ul>
            <li class="history-item" v-for="(item, index) in searchHis" :key="index">
              <span class="name">{{item.name}}</span>
              <span class="icon">
                <i class="icon-delete" @touchstart.stop="deleHistorySongItem(item)"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" @touchstart.stop v-if="query">
      <scroll @intersection="loadMore">
        <ul v-if="searchRes" class="search-result-list">
          <li v-for="(item, index) in searchRes" :key="index">
            <div class="song" @touchstart.stop="selectSong(item)">
              <span class="song-icon">
                <i class="icon-music"></i>
              </span>
              <span class="song-text">
                {{item.name}}
              </span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
  <confirm
    title="是否清空播放历史"
    ref="confirmRef"
    @clear="confirmClear"
    @cancle="confirmCancle"
    ></confirm>
</template>

<script>
import { defineComponent, ref, watch, onBeforeMount, toRaw } from 'vue'
import Scroll from '../../components/scroll/index'
import Confirm from '../../components/confirm/index'
import { getHotKeys, search } from '../../service/search'
import { debounce } from 'lodash'
import SearchInput from '../../components/input/index'
import { usePreventDefault } from '@/hooks/usePreventDefalut'
import { useStore } from 'vuex'
import { processSongs } from '@/service/song'
export default defineComponent({
  name: 'me',
  components: {
    SearchInput,
    Scroll,
    Confirm
  },
  setup () {
    const query = ref('')
    const hotKeys = ref(null)
    const confirmRef = ref(null)
    const searchRes = ref([])
    const searchHis = ref([])
    const page = ref(0)
    const me = ref(null)
    const store = useStore()
    const { touchStart, touchMove, touchEnd } = usePreventDefault(me)
    const selectSong = async (song) => {
      const history = searchHis.value
      const exits = history.some((item) => item.id === song.id)
      if (exits) {
        return
      }
      searchHis.value.push(song)
      const rawSearchHis = toRaw(searchHis.value)
      const playLists = await processSongs(rawSearchHis) // 通过processSongs拿到完整url
      store.dispatch(
        'selectPlay',
        { list: playLists, index: playLists.length - 1 }
      )
    }
    onBeforeMount(async () => {
      const res = await getHotKeys()
      hotKeys.value = res.hotKeys
    })
    const hotKeyClicked = (key) => {
      if (!key) return
      query.value = key
    }
    const loadMore = async () => {
      const sourceArr = searchRes.value
      const searchKey = query.value.trim()
      const searchPage = page.value
      const showSinger = true
      let res = null
      try {
        res = await search(searchKey, searchPage, showSinger)
      } catch (e) {
        console.info(e)
      }
      if (!res || !res.songs) {
        return
      }
      searchRes.value = sourceArr.concat(res.songs)
      page.value += 1
    }
    const openConfirm = () => {
      confirmRef.value.openConfirm()
    }
    const deleHistorySongItem = (item) => {
      const id = item.id
      const history = searchHis.value
      const newArr = history.filter((item) => item.id !== id)
      searchHis.value = newArr
    }
    const confirmClear = () => {
      searchHis.value = []
    }
    const confirmCancle = () => {
      confirmRef.value.close()
    }
    watch(
      query,
      debounce((newVal) => {
        if (!newVal) {
          searchRes.value = []
          return
        }
        loadMore()
      }, 600)
    )
    return {
      me,
      touchStart,
      touchMove,
      touchEnd,
      query,
      hotKeys,
      searchRes,
      confirmRef,
      openConfirm,
      hotKeyClicked,
      searchHis,
      selectSong,
      deleHistorySongItem,
      loadMore,
      confirmClear,
      confirmCancle
    }
  }
})
</script>

<style lang="scss">
.me {
  width: 100vw;
  height: calc(100vh - 44px);
  display: flex;
  flex-direction: column;
  .search-input {
    margin: 20px;
  }
  .search-content {
    margin: 0 20px;
    .search-content-title {
      font-size: 14px;
      margin-bottom: 20px;
      color: rgba(255, 255, 255, 0.3);
    }
    .hot-keys {
      white-space: pre-wrap;
      margin-bottom: 20px;
      .key {
        display: inline-block;
        margin: 0 20px 10px 0;
        background: #333;
        .key-text {
          display: inline-block;
          padding: 5px 10px;
          color: rgba(255, 255, 255, 0.3);
        }
      }
    }
    .search-history {
      color: rgba(255, 255, 255, 0.3);
      .search-history-title {
        display: flex;
        justify-content: space-between;
      }
      .search-history-list {
        line-height: 40px;
        .history-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          .name {
            flex: 1;
            display: inline-block;
            overflow-x: hidden;
            text-overflow: ellipsis;
          }
          .icon {
            text-align: right;
            font-size: 12px;
            flex-basis: 36px;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    position: relative;
    overflow: auto;
    color: rgba(255, 255, 255, 0.3);
    .search-result-list {
      padding: 0 20px;
      .song {
        padding-bottom: 20px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        .song-icon {
          padding-right: 10px;
        }
      }
    }
  }
}
</style>
