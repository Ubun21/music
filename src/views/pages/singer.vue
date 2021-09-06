<template>
  <div class="singer">
    <index :data="singers" :activeIndex="activeIndex"
      @select="onSelect"
    ></index>
  </div>
</template>

<script>
import { getSingerList } from '../../service/singer'
import Index from '../../components/index-list/index'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Singer',
  props: ['activeIndex'],
  emits: ['select'],
  components: {
    Index
  },
  async setup (props, { emit }) {
    const singers = await getSingerList()
    const onSelect = (item) => {
      emit('select', item)
    }
    return {
      singers,
      onSelect
    }
  }
})
</script>

<style lang="scss">
.singer {
  width: 100vw;
  height: calc(100vh - 44px);
  background: rebeccapurple;
}
</style>
