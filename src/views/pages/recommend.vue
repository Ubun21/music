<template>
  <div class="recommend">
    <div class="carousel-wrapper">
      <carousel :enableDot="true" :nest="true" :fclick="true">
        <carousel-item  v-for="(item, index) in sliders" :key="index">
          <a :href="item.link">
            <img :src="item.pic"  />
          </a>
        </carousel-item>
      </carousel>
    </div>
    <div class="list-wrapper">
      <h1 class="list-title">热门推荐</h1>
      <ul class="list-content"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
          ref="listContent">
        <li class="list-content-item" v-for="item in albums" :key="item" @click="selectionAlbum(item)">
          <div class="icon">
            <img :src="item.pic">
          </div>
          <div class="text">
            <h2 class="text-name">{{item.username}}</h2>
            <p class="text-title">{{item.title}}</p>
          </div>
        </li>
        <li v-if="!isFullScreen" class="space"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import Carousel from '../../components/carousel/main.vue'
import CarouselItem from '../../components/carousel/item.vue'
import { getRecommend } from '../../service/recomment'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { usePreventDefault } from '@/hooks/usePreventDefalut'
export default defineComponent({
  name: 'recommend',
  components: {
    Carousel,
    CarouselItem
  },
  async setup () {
    const sliders = ref([])
    const albums = ref([])
    const listContent = ref(null)
    const router = useRouter()
    const store = useStore()
    const isFullScreen = computed(() => store.state.fullScreen)
    const selectionAlbum = (ablum) => {
      router.push({
        name: 'album',
        params: {
          ...ablum
        }
      })
    }
    const { touchStart, touchMove, touchEnd } = usePreventDefault(listContent)
    const result = await getRecommend()
    sliders.value = result.sliders
    albums.value = result.albums
    return {
      sliders,
      albums,
      isFullScreen,
      listContent,
      selectionAlbum,
      touchStart,
      touchMove,
      touchEnd
    }
  }
})
</script>

<style lang="scss">
.recommend {
  width: 100vw;
  height: calc(100vh - 44px);
  .carousel-wrapper {
    .carousel {
      .carousel-item {
        height: 150px;
        a {
          img {
            height: 150px;
            width: 100%;
            object-fit: fill;
          }
        }
      }
    }
  }
  .list-wrapper {
    display: flex;
    height: calc(100vh - 194px);
    flex-direction: column;
    .list-title {
      color: #ffcd32;
      height: 30px;
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .list-content {
      flex: 1;
      overflow: auto;
      .list-content-item {
        display: flex;
        box-sizing: border-box;
        overflow: hidden;
        padding: 0px 20px 20px 20px;
        .icon {
          padding-right: 20px;
          img {
            height: 60px;
            width: 62px;
          }
        }
        .text {
          font-size: 14px;
          .text-name {
            margin-bottom: 20px;
            color: #fff;
          }
          .text-title {
            width: 200px;
            color: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }
    .space {
      height: 80px;
    }
  }
}
</style>
