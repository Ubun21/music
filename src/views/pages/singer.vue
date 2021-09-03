<template>
  <div class="singer">
    <index :data="singers"></index>
  </div>
</template>

<script>
import { getSingerList } from '../../service/singer'
import Index from '../../components/index-list/index'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Singer',
  components: {
    Index
  },
  async setup () {
    const singers = await getSingerList()
    return {
      singers
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
