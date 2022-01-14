<template>
  <div class="app-view">
    <router-view v-if="mobile" v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <not-support-pc v-else></not-support-pc>
  </div>
  <div>
    <player></player>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import Player from './components/play/index'
import NotSupportPc from '@/views/notSupportPc'
import { isMobile } from './uitls/check'
export default defineComponent({
  name: 'app',
  components: {
    Player,
    NotSupportPc
  },
  setup () {
    const mobile = ref(() => isMobile())
    window.addEventListener('resize', () => {
      const height = document.body.offsetHeight
      const width = document.body.offsetWidth
      if (height > 926 || width > 428) {
        mobile.value = false
        return
      }
      mobile.value = isMobile()
    })
    return {
      mobile
    }
  }
})
</script>

<style lang="scss">

</style>
