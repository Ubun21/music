<template>
  <div class="container" v-infinite-scroll="cb" ref="container">
    <div class="content">
      <div class="content__item" v-for="(value, index) in items" :key="index">
        {{ value }}
      </div>
    </div>
    <div class="reference" ref="renference"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from 'vue'
export default defineComponent({
  name: 'Scroll',
  setup () {
    const items = reactive([1, 2, 3, 4, 5, 6, 7])
    const renference = ref(null)
    const container = ref(null)
    const cb = () => {
      items.push(2, 3, 4, 5)
    }
    onMounted(() => {
    })
    return {
      items,
      container,
      renference,
      cb
    }
  }
})
</script>

<style lang="scss">
.content__item {
  line-height: 100px;
  height: 100px;
  background: red;
  text-align: center;
}
.reference {
  background: blue;
  height: 100px;
}
.container {
  height: 100vh;
  overflow: auto;
}
</style>
