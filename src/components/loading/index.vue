<template>
  <div class="loading">
    <div class="content">
      <img src="./loading.gif">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="scss">
.loading {
  position: absolute;
  left: calc(50% - 16px);
  top: calc(50% - 16px);
  .content {
    img {
      height: 2em;
      width: 2em;
    }
  }
}
</style>
