<template>
  <view class="logs_box">
    <view class="item" v-for="(log, index) in logs" :key="index">
      <image style="width: 100%;" :src="log.image" mode="aspectFill" />
      <text>{{ log.productName }}</text>
      <text>{{ log.checkInStatus }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const logs = ref([
  {
    productName: '产品A产品A产品A产品A产品A产品A产品A产品A产品A产品A',
    image: 'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
  {
    productName: '产品B',
    image: 'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '未打卡',
  },
  {
    productName: '产品C',
    image: 'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
  {
    productName: '产品D',
    image: 'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
  {
    productName: '产品E',
    image: 'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '未打卡',
  },
  {
    productName: '产品F',
    image: 'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
]);
</script>

<style scoped>
.logs_box {
  background: #ccc;
  display: grid;
  gap: 10px;
  grid-template-columns: 50% 50%;
  justify-items: center;
  align-items: center;
  padding: 20px;
}
.item {
  background: white;
  border: 1px solid #ccc;
  display: grid;
  border-radius: 5px;
  width: 95%;
  row-gap: 5px;
  padding: 5px;
}
</style>
