<template>
  <div class="me">
    <div class="search-input">
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content"></div>
    <div class="search-result"></div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { debounce } from 'lodash'
import SearchInput from '../../components/input/index'
export default defineComponent({
  name: 'me',
  components: {
    SearchInput
  },
  setup () {
    const query = ref('')
    watch(
      query,
      debounce((newVal) => {
        console.info(newVal)
      }, 300)
    )
    return {
      query
    }
  }
})
</script>

<style lang="scss">
.me {
  width: 100vw;
  height: calc(100vh - 44px);
  background: rebeccapurple;
  .search-input {
    margin: 20px;
  }
}
</style>
