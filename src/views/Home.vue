<template>
  <div class="home-wrapper">
    <tab @active="hanldChange" :index="data.index"></tab>
    <carousel :index="data.index" :loop="false" @active="active">
      <carousel-item>
        <suspense>
          <recommend></recommend>
        </suspense>
      </carousel-item>
      <carousel-item>
        <suspense>
          <singer :activeIndex="data.index" @select="onSelect"></singer>
        </suspense>
      </carousel-item>
      <carousel-item>
        <ranking></ranking>
      </carousel-item>
      <carousel-item>
        <me></me>
      </carousel-item>
    </carousel>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from 'vue'
import Carousel from '../components/carousel/main'
import CarouselItem from '../components/carousel/item'
import { Singer, Recommend, Ranking, Me } from './pages/index'
import Tab from '../components/tab/index'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'app',
  components: {
    Singer,
    Recommend,
    Ranking,
    Me,
    Carousel,
    CarouselItem,
    Tab
  },
  props: ['activeIndex'],
  setup (props) {
    const data = reactive({
      index: 0
    })
    const router = useRouter()
    onMounted(() => {
    })
    const hanldChange = (e) => {
      data.index = e
    }
    const active = (e) => {
      data.index = e
    }
    const onSelect = (item) => {
      router.push({
        path: '/singer/',
        query: {
          id: item.mid,
          pic: item.pic,
          name: item.name
        }
      })
      console.info('home', item)
    }
    return {
      data,
      hanldChange,
      active,
      onSelect
    }
  }
})
</script>

<style lang="scss">
.home-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .container {
    flex: 1;
  }
}
</style>
