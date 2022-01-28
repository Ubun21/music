<template>
    <div class="home-wrapper"
         @touchstart="touchStart"
         @touchmove="touchMove"
         @touchend="touchEnd">
      <tab @active="hanldChange" :index="data.index"></tab>
      <carousel :index="data.index" :fclick="true" :loop="false" @active="active">
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
    <router-view></router-view>
</template>

<script>
import { defineComponent, reactive } from 'vue'
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
      index: 0,
      flick: false
    })
    const router = useRouter()
    const hanldChange = (e) => {
      data.index = e
    }
    let startX = 0
    let startY = 0
    const touchStart = (e) => {
      startX = e.changedTouches[0].clientX
      startY = e.changedTouches[0].clientY
    }
    const touchMove = (e) => {
      const moveX = e.changedTouches[0].clientX
      const moveY = e.changedTouches[0].clientY
      const dx = startX - moveX
      const dy = startY - moveY
      const isYMoved = Math.abs(dy) > 15
      const isXMoved = Math.abs(dx) > 15
      if (isXMoved && !isYMoved) {
        e.preventDefault()
      }
    }
    const touchEnd = (e) => {
      startX = 0
      startY = 0
    }
    const active = (e) => {
      data.index = e
    }
    const onSelect = (item) => {
      router.push(
        {
          name: 'singer',
          params: {
            id: item.mid,
            pic: item.pic,
            name: item.name
          }
        }
      )
    }
    return {
      data,
      hanldChange,
      touchStart,
      touchMove,
      touchEnd,
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
