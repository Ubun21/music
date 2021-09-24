<template>
  <div class="me">
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
          <span class="clear">
            <i class="icon-clear"></i>
          </span>
        </div>
        <div class="search-history-content"></div>
      </div>
    </div>
    <div class="search-result" v-if="query">
      <scroll @intersection="loadMore">
        <ul v-if="searchRes" class="search-result-list">
          <li v-for="(item, index) in searchRes" :key="index">
            <div class="song">
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
</template>

<script>
import { defineComponent, ref, watch, onBeforeMount } from 'vue'
import Scroll from '../../components/scroll/index'
import { getHotKeys, search } from '../../service/search'
import { debounce } from 'lodash'
import SearchInput from '../../components/input/index'
export default defineComponent({
  name: 'me',
  components: {
    SearchInput,
    Scroll
  },
  setup () {
    const query = ref('')
    const hotKeys = ref(null)
    const searchRes = ref([])
    const page = ref(0)
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
        debugger
      } catch (e) {
        console.info(e)
      }
      if (!res || !res.songs) {
        return
      }
      searchRes.value = sourceArr.concat(res.songs)
      page.value += 1
    }
    watch(
      query,
      debounce((newVal) => {
        if (!newVal) {
          searchRes.value = []
          return
        }
        loadMore()
      }, 300)
    )
    return {
      query,
      hotKeys,
      searchRes,
      hotKeyClicked,
      loadMore
    }
  }
})
</script>

<style lang="scss">
.me {
  width: 100vw;
  height: calc(100vh - 44px);
  background: #333;
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
