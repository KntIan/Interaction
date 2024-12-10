<template>
  <view class="container">
    <view class="info_img">
      <image style="width: 100%;" :src="productInfo.thumb" />
    </view>
    <view class="info_text">
      <text>{{ productInfo.title }}</text>
      <text>{{ productInfo.content }}</text>
      <view class="status" :class="{ 'checked-in': isCheckedIn, 'not-checked-in': !isCheckedIn }">
        <image v-if="isCheckedIn" style="width: 16px; height: 16px;" src="@/static/images/Fram1e.png" mode="aspectFill" />
        <text>{{ isCheckedIn ? '已打卡' : '未打卡' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { punchIn, getRecordList, getUrlParameter } from '@/utils/api'; // 引入指定的接口方法
import { useAttendanceStore } from '@/store/store'; // 导入 Pinia store
import dialog from '../../components/dialog.vue';

const attendanceStore = useAttendanceStore(); // 使用 Pinia store
const isCheckedIn = ref(false); // 初始化打卡状态
const productInfo = ref({}); // 响应式变量，用于存储产品信息

// 页面加载时调用punchIn方法
onShow(async () => {
  const param = getUrlParameter("param") || uni.getStorageSync("param");

  if (param) {
    try {
      uni.setStorageSync("param", param); // 使用同步方法减少异步操作
      console.log("param存储成功");

      // 首先调用打卡接口
      const punchResponse = await punchIn({ param }); // 调用打卡接口
      console.log('打卡结果:', punchResponse);

      // 提取打卡状态和产品信息并更新状态
      isCheckedIn.value = punchResponse.data.is_point;
      productInfo.value = punchResponse.data.product;

      // 存储打卡状态到 Pinia
      attendanceStore.setLogs([...attendanceStore.logs, { is_point: isCheckedIn.value, product: productInfo.value }]);
      console.log(attendanceStore.logs);

      // 调用 getRecordList 接口
      const recordResponse = await getRecordList({ param });
      console.log('获取打卡记录:', recordResponse);

      // 将获取的打卡记录存储到 Pinia
      attendanceStore.setLogs(recordResponse.data || []); // 更新打卡记录数据

      // 统计检查打卡状态，如果全部为已打卡，则弹窗提醒
      const allCheckedIn = attendanceStore.logs.every(log => log.is_point);
      if (allCheckedIn) {
        uni.showToast({
          title: '恭喜您，全部打卡已完成！',
          icon: 'none',
        });
      } else {
        console.log('未完全打卡');
      }

    } catch (error) {
      console.error('操作失败:', error);
    }
  } else {
    console.warn('没有有效的参数');
  }
});
</script>

<style scoped>
.container {
  background: #f7f8fa;
  padding: 20px;
}
.info_img {
  background: white;
  border-radius: 20px;
  padding: 50px;
  background: url(@/static/images/Scan-code.png) no-repeat center;
}
.info_text {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: grid;
  justify-items: center;
  gap: 10px;
  margin: 20px 0;
}
.status {
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
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
