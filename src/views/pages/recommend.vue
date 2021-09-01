<template>
  <div class="recommend">
    <div class="carousel-wrapper">
      <carousel>
        <carousel-item :enableDot="true" v-for="(item, index) in sliders" :key="index">
          <a :href="item.link">
            <img :src="item.pic"  />
          </a>
        </carousel-item>
      </carousel>
    </div>
    <div class="list-wrapper"></div>
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
          }
        }
      }
    }
  }
}
</style>
