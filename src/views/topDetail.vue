<template>
  <div class="topDetail-wrapper">
    <detail :getDataFn="getTopDetail"></detail>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getTopDetail } from '../service/top'
import Detail from './detail'
export default defineComponent({
  name: 'TopDetail',
  components: {
    Detail
  },
  setup () {
    return {
      getTopDetail
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
