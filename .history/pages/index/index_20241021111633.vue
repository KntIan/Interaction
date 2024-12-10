<template>
  <view class="container">
    <!-- 自定义全屏弹出框 -->
    <view v-if="showToast = true" class="custom-toast">
      <view class="overlay" @click="closeToast"></view>
      <view class="toast-content">
        <view class="logo_tit">
          <image src="@/static/images/Frame.png" style="width: 145px; height: 20px;" />
          <text style="font-size: 14px; color: #000000;">请选择感兴趣的产品</text>
        </view>
        <view class="logs_box">
          <view class="item" v-for="item in radioOptions" :key="item.value">
            <image class="log-image" :src="item.image" />
            <text class="product-name">{{ item.label }}</text>
            <view>
              <image :src="item.icon" mode="scaleToFill" />
            </view>
            <!-- <input style="padding-bottom: 10px;" type="radio" :value="item.value" v-model="selectedValue" @click="onRadioChange(item.value)" /> -->
          </view>
        </view>
        <view class="footer">
          <button @click="submitProduct">提交</button>
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
        <image v-if="isCheckedIn" style="width: 16px; height: 16px;" src="@/static/images/Fram1e.png" />
        <text>{{ isCheckedIn ? '已打卡' : '未打卡' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { punchIn, getRecordList, getUrlParameter, submitInterestedProduct } from '@/utils/api';
import { useAttendanceStore } from '@/store/store';

const attendanceStore = useAttendanceStore();
const isCheckedIn = ref(false);
const productInfo = ref({});
const showToast = ref(false);
const selectedValue = ref('');
const ids = ref([]);
const icons

const radioOptions = computed(() =>
  attendanceStore.logs.map(log => ({
    value: String(log.id),
    label: log.title,
    image: log.thumb,
    icon: icons
  }))
);

const closeToast = () => {
  showToast.value = false;
  document.body.style.overflow = '';
};

const openToast = () => {
  showToast.value = true;
  document.body.style.overflow = 'hidden';
};

const onRadioChange = (value) => {
  const numericValue = Number(value);
  console.log(numericValue);
  const index = ids.value.indexOf(numericValue);
  if (index > -1) {
    ids.value.splice(index, 1);
  } else {
    ids.value.push(numericValue);
  }
  selectedValue.value = numericValue;
};

const submitProduct = async () => {
  try {
    const param = getUrlParameter("param") || uni.getStorageSync("param");
    const idsString = ids.value.join(',');

    const response = await submitInterestedProduct({ param, ids: idsString });
    if (response.success) {
      console.log('提交成功！');
    } else {
      console.error('提交失败:', response.message);
    }
  } catch (error) {
    console.error('提交发生错误:', error);
  }
};

onShow(async () => {
  const param = getUrlParameter("param") || uni.getStorageSync("param");

  if (param) {
    try {
      uni.setStorageSync("param", param);
      const punchResponse = await punchIn({ param });
      isCheckedIn.value = punchResponse.data.is_point;
      productInfo.value = punchResponse.data.product;

      attendanceStore.setLogs([...attendanceStore.logs, { is_point: isCheckedIn.value, product: productInfo.value }]);

      const recordResponse = await getRecordList({ param });
      attendanceStore.setLogs(recordResponse.data || []);

      if (attendanceStore.logs.every(log => log.is_point)) {
        openToast();
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
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.checked-in {
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
}

.not-checked-in {
  background-color: #b3b3b3;
}

/* 弹窗 */
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
  padding-bottom: 0;
}

.logs_box {
  display: grid; /* 使用 CSS Grid 布局 */
  grid-template-columns: repeat(2, 1fr); /* 两列排布 */
  max-height: 450px; /* 最大高度450px */
  overflow-y: auto; /* 允许垂直滚动 */
  gap: 10px; /* 列之间的间距 */
  margin-top: 26px;
}

.item {
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  transition: transform 0.3s;
  box-shadow: 0 0 20px rgba(0, 92, 185, 0.1);
  background: #fff;
}

.logo_tit {
  display: grid;
  justify-items: center;
  gap: 12px;
}

.log-image {
  width: 135px; /* 设置图片宽度 */
  height: 135px; /* 设置图片高度 */
  border-radius: 20px;
}

.product-name {
  padding: 10px;
  text-align: center;
}
.footer {
  padding: 20px 0;
  border-radius: 20px;
}
.footer button {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}
</style>
