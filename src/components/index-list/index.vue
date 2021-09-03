<template>
  <div class="index-wrapper" ref="container">
    <ul>
      <li class="list"  ref="list" :ground-name="item.title"
        v-for="(item, index) in data.singers" :key="index"
      >
        <div class="list-title">{{item.title}}</div>
        <ul>
          <li class="list-item" v-for="(child, index) in item.list" :key="index">
            <div class="avator">
              <img :src="child.pic" />
            </div>
            <div class="name">
              {{child.name}}
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut">
      <ul class="striky">
        <li class="item" v-for="(item, index) in data.singers" :key="index">
          {{item.title}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'IndexList',
  props: ['data'],
  setup (props) {
    const container = ref(null)
    const list = ref(null)
    onMounted(() => {
    })
    return {
      container,
      list
    }
  }
})
</script>

<style lang="scss">
.index-wrapper {
  position: relative;
  height: 100%;
  overflow: auto;
  .list {
    .list-title {
      // position: sticky;
      // top: 0px;
      padding-left: 10px;
      background: red;
    }
    .list-item {
      display: flex;
      padding-top: 20px;
      padding-left: 30px;
      height: 50px;
      .avator {
        img {
          border-radius: 50%;
          height: 50px;
          width: 50px;
        }
      }
      .name {
        margin-left: 20px;
        line-height: 50px;
      }
    }
  }
  .shortcut {
    position: fixed;
    background: green;
    right: 4px;
    top: 20%;
    padding: 20px 0;
    width: 20px;
    border-radius: 10px;
    text-align: center;
    .striky {
      background: yellow;
      .item {
        padding: 2px;
        font-size: 12px;
      }
    }
  }
}
</style>>
