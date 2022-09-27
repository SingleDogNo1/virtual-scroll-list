<template>
  <div class="demo-wrapper">
    <div class="demo1">
      <div class="extra-wrapper">
        <h1>基本用法</h1>
      </div>
      <InfiniteList
        :data="data"
        :width="demoWidth"
        :height="demoHeight"
        :itemSize="50"
        v-slot="{ item, index }"
      >
        <div class="list-item">{{ index + 1 }} : {{ item }}</div>
      </InfiniteList>
    </div>
    <div class="demo2">
      <div class="extra-wrapper">
        <h1>横向滚动</h1>
      </div>
      <InfiniteList
        :data="data"
        :width="demoWidth"
        :height="demoHeight"
        :itemSize="120"
        scrollDirection="horizontal"
        v-slot="{ item }"
      >
        <div class="list-item-hr">
          {{ item.title }}
          <br />
          {{ item.msg }}
        </div>
      </InfiniteList>
    </div>
    <div class="demo3">
      <div class="extra-wrapper">
        <h1>自定义高度</h1>
      </div>
      <InfiniteList
        :data="data"
        :width="demoWidth"
        :height="demoHeight"
        :itemSize="getItemSize"
        v-slot="{ item, index }"
      >
        <div class="list-item">{{ index + 1 }} : {{ item }}</div>
      </InfiniteList>
    </div>
    <div class="demo4">
      <div class="extra-wrapper">
        <input
          style="margin: 0 20px; display: inline-block; width: 150px"
          v-model="scrollToIndex"
          type="number"
          max="100000"
          min="0"
          placeholder="输入跳转到第几个"
        />

        <select
          style="margin: 0 20px; display: inline-block; width: 150px"
          v-model="scrollToAlignment"
        >
          <option value="">选择对齐方式</option>
          <option value="auto">auto</option>
          <option value="start">start</option>
          <option value="center">center</option>
          <option value="end">end</option>
        </select>

        <input
          style="margin: 0 20px; display: inline-block; width: 150px"
          v-model="scrollOffset"
          type="number"
          max="10000"
          min="0"
          placeholder="输入滚动的高度"
        />
        <h1 style="display: inline">控制滚动</h1>
      </div>
      <InfiniteList
        :data="data"
        :width="demoWidth"
        :height="demoHeight"
        :itemSize="getItemSize"
        :scrollToIndex="scrollToIndex"
        :scrollToAlignment="scrollToAlignment"
        :scrollOffset="scrollOffset"
        v-slot="{ item, index }"
      >
        <div class="list-item" :class="{ active: index === scrollToIndex }">
          {{ index }} : {{ item }}
        </div>
      </InfiniteList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import InfiniteList from './components/virtualScroll/index.vue'

function generateData(len = 100000): { title: number; msg: string }[] {
  const data: { title: number; msg: string }[] = []

  for (let i = 0; i < len; i++) {
    data.push({ title: i + 1, msg: `hello world ${i + 1}` })
  }
  return data
}

const data = ref(generateData(100000))
const scrollToIndex = ref()
const scrollOffset = ref()
const scrollToAlignment = ref('')
const demoHeight = window.innerHeight / 2
const demoWidth = window.innerWidth / 2

function getItemSize(i: number) {
  switch (i % 4) {
    case 1:
      return 50
    case 2:
      return 100
    case 3:
      return 150
    default:
      return 200
  }
}
</script>

<style lang="scss" scoped>
.demo-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #eee;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  grid-template-rows: repeat(2, 50%);
  gap: 5px;

  [class^='demo'] {
    background-color: #fff;
    position: relative;
  }

  .list-item {
    padding: 0 20px;
    line-height: 50px;
    height: 100%;
    border-bottom: 1px solid #eee;
    &.active {
      background: #eee;
    }
  }

  .list-item-hr {
    padding: 0 4px;
    height: 100%;
    border-right: 1px solid #eee;
  }

  .extra-wrapper {
    position: absolute;
    z-index: 999;
    right: 30px;
    top: 30px;
  }
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
}
</style>
