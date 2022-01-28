<template>
  <div class="topDetail-wrapper">
    <detail :getDataFn="getSingerDetail"></detail>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getSingerDetail } from '@/service/singer'
import Detail from './detail'
export default defineComponent({
  name: 'TopDetail',
  components: {
    Detail
  },
  setup () {
    return {
      getSingerDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.topDetail-wrapper {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
