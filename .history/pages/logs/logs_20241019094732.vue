<template>
  <view class="logs_box">
    <view :ref="el => rootRefs[index] = el" class="item" v-for="(log, index) in logs" :key="index">
      <image class="log-image" :src="log.image" mode="" />
      <text class="product-name">{{ log.productName }}</text>
      <text class="check-in-status">{{ log.checkInStatus }}</text>
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
const rootRefs = ref([]);
// 监听 logs 变化
watch(logs, async () => {
  await nextTick();
  checkHeight();
}, { immediate: true });
const checkHeight = () => {
  console
  rootRefs.value.forEach((el) => {
    if (el) {
      const rows = Math.ceil(el.clientHeight / 5) + 2;
      console.log(rows);
      el.style.gridRowEnd = `span ${rows}`;
    }
  });
};

onMounted(() => {
  checkHeight(); // 初始渲染后检查
});


</script>

<style scoped>
.logs_box {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(50% - 5px));
  grid-auto-rows: 5px;
  align-items: start;
  justify-content: space-between;
  padding: 0 10px 10px;
}
.item {
  background: white;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column; /* 垂直排列内容 */
  border-radius: 5px;
  width: 100%; /* 让盒子占满列宽度 */
  padding: 10px;
  box-sizing: border-box; /* 包含内边距在宽度计算中 */
  transition: transform 0.3s; /* 渐变效果 */
  overflow: hidden;
}
.item:hover {
  transform: scale(1.02); /* 鼠标悬停时放大 */
}
.log-image {
  width: 100%; /*图片宽度占满 */
  height: 120px; /* 固定高度 */
  object-fit: cover; /*确保图片填充 */
  border-radius: 5px; /* 边角圆滑 */
}
.product-name {
  /* width: 100px; */
  overflow: hidden; /* 防止文本溢出 */
  text-overflow: ellipsis; /* 超过范围用省略号显示 */
  /*white-space: nowrap;  不换行 */
  margin-top: 5px; /* 与图片保持间距 */
}
.check-in-status {
  margin-top: auto; /* 将状态文本推到底部 */
  font-size: 12px; /* 调整字体大小 */
}
</style>
