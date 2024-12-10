<template>
  <view>
    <view class="logs_box">
    <view class="item" v-for="(log, index) in logs" :key="index">
      <image class="log-image" :src="log.image" mode="" />
      <text class="product-name">{{ log.productName }}</text>
      <text class="check-in-status">{{ log.checkInStatus }}</text>
    </view>
  </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
const logs = ref([
  {
    productName: '产品A产品A产品A产品A产品A产品A产品A产品A产品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A',
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
  column-count: 2;
  gap: 10px;
  padding: 10px;
}
.item {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 10px;
  transition: transform 0.3s;
  break-inside: avoid;
  box-shadow: 0px 0px 20px 0px rgba(0, 92, 185, 0.1);
  margin-bottom: 10px;
}
.item:hover {
  transform: scale(1.02); /* 鼠标悬停时放大 */
}
.log-image {
  width: 100%; /*图片宽度占满 */

  object-fit: cover; /*确保图片填充 */
  border-radius: 5px; /* 边角圆滑 */
}
.product-name {
  overflow: hidden; /* 防止文本溢出 */
  text-overflow: ellipsis; /* 超过范围用省略号显示 */
  /*white-space: nowrap;  不换行 */
  margin: 10px 0;
  font-weight: bold;
  color: #333333;
}
.check-in-status {
  margin-top: auto; /* 将状态文本推到底部 */
  font-size: 12px; /* 调整字体大小 */
}
</style>
