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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 响应式列宽 */
  grid-auto-rows: 200px; /* 设置自动行高 */
  justify-items: center;
  padding: 20px;
}
.item {
  background: white;
  border: 1px solid #ccc;
  display: flex; /* 使用 flex 使内容垂直排列 */
  flex-direction: column;
  border-radius: 5px;
  width: 100%; /* 宽度占满 */
  padding: 10px;
  box-sizing: border-box;
}
.log-image {
  width: 100%; /* 图片宽度占满 */
  border-radius: 5px;
  height: 120px; /* 固定图片高度 */
  object-fit: cover; /* 保持宽高比，填充区域 */
}
.product-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 强制不换行 */
  margin-top: 5px; /* 与图片保持间距 */
}
.check-in-status {
  margin-top: auto; /* 将状态文本推到底部 */
  font-size: 12px; /* 调整字体大小 */
}
</style>
