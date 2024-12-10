<template>
  <view class="box">
    <view class="title">打卡记录</view>
    <view class="logs_box">
      <view class="item" v-for="(log, index) in attendanceStore.logs" :key="index">
        <image style="border-radius: 20px;" class="log-image" :src="log.thumb" mode="aspectFit" />
        <text class="product-name">{{ log.content }}</text>
        <view class="status" :class="{ 'checked-in': log.is_point, 'not-checked-in': !log.is_point }">
          <image v-if="log.is_point" style="width: 16px; height: 16px;" src="@/static/images/Fram1e.png" mode="aspectFill" />
          <text>{{ log.is_point ? '已打卡' : '未打卡' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getRecordList, getUrlParameter } from '@/utils/api';
import { useAttendanceStore } from '@/store/store';

const attendanceStore = useAttendanceStore(); // 使用 Pinia store
const param = getUrlParameter("param") || uni.getStorageSync("param");

onMounted(async () => {
  if (param) {
    try {
      uni.setStorageSync("param", param);
      console.log("param存储成功");

      const response = await getRecordList({ param });
      attendanceStore.setLogs(response.data || []); // 存储到 Pinia 中
      console.log('获取打卡记录成功:', attendanceStore.logs);
    } catch (error) {
      console.error('打卡失败:', error);
      uni.showToast({
        title: '获取打卡记录失败',
        icon: 'none',
      });
    }
  } else {
    console.warn('未找到param参数');
    uni.showToast({
      title: '缺少param参数',
      icon: 'none',
    });
  }
});
</script>

<style scoped>
.box {
  background: #f7f8fa;
  height: 87vh;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333;
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
  border-radius: 20px;
  transition: transform 0.3s;
  break-inside: avoid;
  box-shadow: 0 0 20px rgba(0, 92, 185, 0.1);
  margin-bottom: 10px;
  background: #fff;
}
.item:hover {
  transform: scale(1.02);
}
.log-image {
  width: 100%;
  object-fit: cover;
  border-radius: 20px;
}
.product-name {
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 10px;
  font-weight: bold;
  color: #333;
}
.status {
  width: 120px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: white;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-bottom: 10px;
}
.checked-in {
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
}
.not-checked-in {
  background-color: #b3b3b3;
}
</style>
