<template>
  <div class="search-wrapper">
    <i class="icon-search"></i>
    <input class="search-inner"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeHolder"
      ref="inputRef"
      />
    <i v-if="modelValue"
      class="icon-dismiss"
      @click="clearInoutText"
      ></i>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'SearchInput',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String
    },
    placeHolder: {
      type: String,
      default: '搜索歌手，歌名'
    }
  },
  setup (props, { emit }) {
    const clearInoutText = () => {
      emit('update:modelValue', '')
    }
    return {
      clearInoutText
    }
  }
})
</script>

<style lang="scss" scoped>
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  .icon-search {
    font-size: 24px;
    position: absolute;
  }
  .search-inner {
    box-sizing: border-box;
    height: 32px;
    padding: 0 24px;
    width: 100%;
    vertical-align: middle;
  }
  .icon-dismiss {
    position: absolute;
    right: 0px;
    font-size: 18px;
    padding-right: 3px;
  }
}
</style>
