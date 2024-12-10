<template>
  <view class="container">
    <!-- 自定义全屏弹出框 -->
    <view v-if="showToast" class="custom-toast">
      <view class="overlay" @click="closeToast"></view>
      <view class="toast-content">
        <view class="logo_tit">
          <image style="width: 145px;height: 20px;" src="@/static/images/Frame.png" mode="" />
          <text style="font-size: 14px;color: #000000;">请选择感兴趣的产品</text>
        </view>
        <view class="logs_box">
          <view class="item" v-for="item in radioOptions">
            <image style="width: 135px;height: 135px;border-radius: 20px;" class="log-image" :src="item.image" mode="" />
            <text style="padding: 10px;text-align: center;" class="product-name">{{ item.label }}</text>
            <image style="width: 24px; height: 24px; margin: auto; padding-bottom: 10px;" :src="item.checked ? '/static/images/iconis.png' : '@/static/images/iconno.png'" @click="changeIcon(item)" />
          </view>
        </view>

      </view>
    </view>

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
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app'
import { punchIn, getRecordList, getUrlParameter } from '@/utils/api'; // 引入指定的接口方法
import { useAttendanceStore } from '@/store/store'; // 导入 Pinia store

const attendanceStore = useAttendanceStore(); // 使用 Pinia store

const isCheckedIn = ref(false); // 初始化打卡状态
const productInfo = ref({}); // 响应式变量，用于存储产品信息
// 页面加载时调用punchIn方法
const showToast = ref(false); // 控制弹窗的显示
const toastMessage = ref(''); // 存储弹窗消息
const selectedValue = ref(null); // 用于存储选择的 radio 值
// 计算属性，用于构建 radioOptions
const radioOptions = computed(() => {
  return attendanceStore.logs.map(log => ({
    value: log.id, // 假设每个 log 有一个唯一的 id
    label: log.title, // 假设 log 里有 content 字段用于显示的文字
    image: log.thumb, // 假设 log 里有 thumb 字段用于显示的图像
    checked: false, // 根据需要设置是否默认选中
  }));
});
const changeIcon = (item) => {
  item.checked = !item.checked; // 切换选中状态
  console.log('当前选中项:', item);
};
const closeToast = () => {
  showToast.value = false; // 关闭弹窗
  document.body.style.overflow = ''; // 恢复背景滚动
};
// 打开弹窗时禁用背景滚动
const openToast = () => {
  showToast.value = true; // 显示弹窗
  document.body.style.overflow = 'hidden'; // 禁止背景滚动
};
// 处理单选框变化
const onRadioChange = (event) => {
  selectedValue.value = event.detail.value; // 更新选择的值
  console.log('选择的值:', selectedValue.value);
};
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
      console.log('获取打卡记录:', recordResponse.data);

      // 将获取的打卡记录存储到 Pinia
      attendanceStore.setLogs(recordResponse.data || []); // 更新打卡记录数据

      // 统计检查打卡状态，如果全部为已打卡，则弹窗提醒
      const allCheckedIn = attendanceStore.logs.every(log => log.is_point);
      if (!allCheckedIn) {
        toastMessage.value = '恭喜您，全部打卡已完成！'; // 设置弹窗消息
        showToast.value = true; // 显示弹窗
        openToast()
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

/*弹窗*/
.custom-toast {
  position: fixed; /* 使用fixed以全屏显示 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
  z-index: 999; /* 确保在最上层 */
}

.overlay {
  position: absolute; /* 遮罩层 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
}

.toast-content {
  position: relative; /* 使内容相对定位 */
  background-color: white;
  padding: 20px;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 80px 33px;
}

.toast-title {
  font-size: 16px;
  margin-bottom: 10px;
  text-align: center;
}
.product_list {
  column-count: 2;
  max-height: 420px; /* 设置最大高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  padding-right: 10px; /* 如果有滚动条，留出空间 */
}
.radio-image {
  width: 135px; /* 设置图片宽度 */
  height: 135px; /* 设置图片高度 */
  margin-right: 10px; /* 图片与文本之间的间距 */
}
.radio-label {
  font-size: 16px; /* 设置文字大小 */
  color: #333; /* 设置文字颜色 */
}
.logs_box {
  display: grid; /* 使用 CSS Grid 布局 */
  grid-template-columns: repeat(2, 1fr); /* 两列排布 */
  max-height: 450px; /* 最大高度450px */
  overflow-y: auto; /* 允许垂直滚动 */
  gap: 10px; /* 列之间的间距 */
  margin-top: 26px;
}
/* 自定义滚动条样式（只在 WebKit 浏览器有效） */
.logs_box::-webkit-scrollbar {
  width: 0; /* 隐藏竖向滚动条 */
  background: transparent; /* 设置滚动条背景透明 */
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
.logo_tit {
  display: grid;
  justify-items: center;
  gap: 12px;
}
.custom-radio {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.custom-radio input[type="radio"] {
  display: none;
}

.custom-radio input[type="radio"]:checked + .radio-button {
  background-color: #4caf50;
}

.radio-button {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: #fff;
}

.radio-button::after {
  content: "";
  position: absolute;
  display: none;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
}

.custom-radio input[type="radio"]:checked + .radio-button::after {
  display: block;
}
</style>
