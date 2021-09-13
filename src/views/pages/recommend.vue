<template>
  <div class="recommend">
    <div class="carousel-wrapper">
      <carousel :enableDot="true">
        <carousel-item  v-for="(item, index) in sliders" :key="index">
          <a :href="item.link">
            <img :src="item.pic"  />
          </a>
        </carousel-item>
      </carousel>
    </div>
    <div class="list-wrapper">
      <h1 class="list-title">热门推荐</h1>
      <ul class="list-content">
        <li class="list-content-item" v-for="item in albums" :key="item">
          <div class="icon">
            <img :src="item.pic">
          </div>
          <div class="text">
            <h2 class="text-name">{{item.username}}</h2>
            <p class="text-title">{{item.title}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Carousel from '../../components/carousel/main.vue'
import CarouselItem from '../../components/carousel/item.vue'
import { getRecommend } from '../../service/recomment'
export default defineComponent({
  name: 'recommend',
  components: {
    Carousel,
    CarouselItem
  },
  async setup () {
    const sliders = ref([])
    const albums = ref([])
    const selectionAlbum = ref(null)

    const result = await getRecommend()
    sliders.value = result.sliders
    albums.value = result.albums
    console.info(sliders.value)
    return {
      sliders,
      albums,
      selectionAlbum
    }
  }
})
</script>

<style lang="scss">
.recommend {
  width: 100vw;
  background: rebeccapurple;
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
      height: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: blue;
    }
    .list-content {
      flex: 1;
      overflow: auto;
      background: red;
      .list-content-item {
        display: flex;
        padding: 0px 20px 20px 20px;
        .icon {
          padding-right: 20px;
          img {
            height: 60px;
            width: 62px;
          }
        }
        .text {
          .text-name {
            margin-bottom: 20px;
          }
          .text-title {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
