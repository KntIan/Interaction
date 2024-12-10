<template>
  <view class="logs_box">
    <view class="item" v-for="(log, index) in logs" :key="index">
      <image class="log-image" :src="log.image" mode="aspectFill" />
      <text class="product-name">{{ log.productName }}</text>
      <text class="check-in-status">{{ log.checkInStatus }}</text>
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 自动填充网格，最小宽度为200px */
  grid-auto-rows: 10px; /* 根据内容自动调整行高 */
  justify-items: center;
  align-items: start;
  padding: 20px;
}
.item {
  background: white;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100%; /* 让项目宽度占满整个网格 */
  padding: 5px;
}
.log-image {
  width: 100%; /* 确保图片宽度占满 */
  border-radius: 5px;
}
.product-name {
  overflow: hidden; /* 防止文本溢出 */
  text-overflow: ellipsis; /* 超出部分用省略号表示 */
  white-space: nowrap; /* 不换行 */
}
.check-in-status {
  margin-top: 5px; /* 状态与产品名称之间增加间距 */
}
</style>
