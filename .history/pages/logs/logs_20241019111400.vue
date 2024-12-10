<template>
  <view class="box">
    <view class="title">打卡记录</view>
    <view class="logs_box">
      <view class="item" v-for="(log, index) in logs" :key="index">
        <image class="log-image" :src="log.thumb" mode="aspectFit " />
        <text class="product-name">{{ log.content }}</text>
        <view class="status" :class="{ 'checked-in': isCheckedIn, 'not-checked-in': !isCheckedIn }">
          <image v-if="isCheckedIn" style="width: 16px; height: 16px;" src=" @/static/images/Fram1e.png " mode="aspectFill" />
          <text>{{ isCheckedIn ? '已打卡' : '未打卡' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { getRecordList, getUrlParameter } from '@/utils/api'
const logs = ref([
  {
    productName:
      '产品A产品A产品A产品A产品A产品A产品A产品A产品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A品A产品A',
    image:
      'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
  {
    productName: '产品B',
    image:
      'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '未打卡',
  },
  {
    productName: '产品C',
    image:
      'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
  {
    productName: '产品D',
    image:
      'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
  {
    productName: '产品E',
    image:
      'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '未打卡',
  },
  {
    productName: '产品F',
    image:
      'https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg',
    checkInStatus: '已打卡',
  },
])
const isCheckedIn = ref(false) // 初始化打卡状态，可以根据实际情况更新这个值
onMounted(async () => {
  const param = getUrlParameter("param");
  console.log(param);
  if (param) {
    uni.setStorage({
      key: "param",
      data: param,
      success: () => console.log("param存储成功"),
      fail: (err) => console.error("param存储失败", err),
    });
  }
  try {
    const response = await getRecordList({ param }); // 调用接口
    console.log('打卡结果:', response.data);
    logs.value = response.data; // 提取is_point和产品信息
  } catch (error) {
    console.error('打卡失败:', error);
  }
});
</script>

<style scoped>
.box {
  background: #f7f8fa;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  text-align: center;
  padding: 12px 0;
  position: fixed;
  left: 0;
  right: 0;
  z-index: 99;
  background: #f7f8fa;
}
.logs_box {
  column-count: 2;
  gap: 10px;
  padding: 10px;
  padding-top: 55px;
}

.item {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  transition: transform 0.3s;
  break-inside: avoid;
  box-shadow: 0px 0px 20px 0px rgba(0, 92, 185, 0.1);
  margin-bottom: 10px;
  background: #ffffff;
}

.item:hover {
  transform: scale(1.02);
  /* 鼠标悬停时放大 */
}

.log-image {
  width: 100%;
  /*图片宽度占满 */

  object-fit: cover;
  /*确保图片填充 */
  border-radius: 5px;
  /* 边角圆滑 */
}

.product-name {
  overflow: hidden;
  /* 防止文本溢出 */
  text-overflow: ellipsis;
  /* 超过范围用省略号显示 */
  /*white-space: nowrap;  不换行 */
  margin: 10px;
  font-weight: bold;
  color: #333333;
}

.check-in-status {
  margin-top: auto;
  /* 将状态文本推到底部 */
  font-size: 12px;
  /* 调整字体大小 */
}

.status {
  width: 120px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: white;
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  border-radius: 100px 100px 100px 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-bottom: 10px;
}
.checked-in {
  background: linear-gradient(
    90deg,
    #005cb9 0%,
    #56b7e6 100%
  ); /* 打卡已完成背景颜色 */
}

.not-checked-in {
  background-color: #b3b3b3; /* 打卡未完成背景颜色 */
}
</style>
