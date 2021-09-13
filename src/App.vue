<template>
  <div class="app-view">
    <router-view>
    </router-view>
  </div>
  <div>
    <player></player>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Player from './components/play/index'
export default defineComponent({
  name: 'app',
  components: {
    Player
  }
})
</script>

<style lang="scss">

</style>
