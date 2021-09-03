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
          <singer></singer>
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
  setup (props) {
    const data = reactive({
      index: 0
    })
    onMounted(() => {
      // setInterval(() => {
      //   data.index = (data.index + 1) % 4
      // }, 2000)
    })
    const hanldChange = (e) => {
      data.index = e
    }
    const active = (e) => {
      data.index = e
    }
    return {
      data,
      hanldChange,
      active
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
