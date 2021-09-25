<template>
  <teleport to="body">
      <div class="confirm-wrapper" v-if="open">
        <div class="confirm-content">
          <div class="confirm-title">{{title}}</div>
          <div class="confirm-options">
            <div class="confirm-clear" @touchstart.stop="clear">清空</div>
            <div class="confirm-options-middle"></div>
            <div class="confirm-cancle" @touchstart.stop="cancle">取消</div>
          </div>
        </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Confirm',
  emits: ['clear', 'cancle'],
  props: {
    title: {
      type: String
    },
    visiual: {
      type: Boolean
    }
  },
  setup (props, { emit }) {
    const open = ref(false)
    const clear = () => {
      emit('clear')
      close()
    }
    const cancle = () => {
      emit('cancle')
      close()
    }
    const close = () => {
      open.value = false
    }
    const openConfirm = () => {
      open.value = true
    }
    return {
      open,
      clear,
      cancle,
      close,
      openConfirm
    }
  }
})
</script>

<style lang="scss" scoped>
.confirm-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
  .confirm-content {
    border-radius: 13px;
    width: 270px;
    font-size: 18px;
    background: black;
    .confirm-title {
      text-align: center;
      padding: 19px 15px;
      line-height: 26px;
      color: rgba(255, 255, 255, 0.5);
    }
    .confirm-options {
      display: flex;
      align-items: center;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.5);
      color: rgba(255, 255, 255, 0.5);
      height: 43px;
      .confirm-options-middle {
        height: 100%;
        border-right: 1px solid rgba(255, 255, 255, 0.5);
      }
      .confirm-clear {
        flex: 1;
      }
      .confirm-cancle {
        flex: 1;
      }
    }
  }
}
</style>
