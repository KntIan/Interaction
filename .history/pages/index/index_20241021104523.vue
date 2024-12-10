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
          <view class="item" v-for="item in radioOptions" :key="item.value">
            <image style="width: 135px;height: 135px;border-radius: 20px;" class="log-image" :src="item.image" mode="" />
            <text style="padding: 10px;text-align: center;" class="product-name">{{ item.label }}</text>
            <input type="radio" :value="item.value" v-model="selectedValue" @click="onRadioChange(item.value)" />
          </view>
        </view>
        <button @click="submitProduct">提交</button>
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
import { onShow } from '@dcloudio/uni-app';
import { punchIn, getRecordList, getUrlParameter, submitInterestedProduct } from '@/utils/api';
import { useAttendanceStore } from '@/store/store';

const attendanceStore = useAttendanceStore();

const isCheckedIn = ref(false);
const productInfo = ref({});
const showToast = ref(false);
const selectedValue = ref('');
const ids = ref([]);

const radioOptions = computed(() =>
  attendanceStore.logs.map(log => ({
    value: String(log.id),
    label: log.title,
    image: log.thumb
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
  if (ids.value.includes(numericValue)) {
    ids.value = ids.value.filter(id => id !== numericValue);
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

      const allCheckedIn = attendanceStore.logs.every(log => log.is_point);
      if (allCheckedIn) {
        toastMessage.value = '恭喜您，全部打卡已完成！';
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
  background: url(@/static/images/Scan-code.png) no-repeat center;
  border-radius: 20px;
  padding: 50px;
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
  box-shadow: 0px 8px 10px rgba(2, 118, 255, 0.2);
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

/*弹窗*/
.custom-toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.toast-content {
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 80px 33px;
}

.product_list {
  column-count: 2;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 10px;
}
.logs_box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  max-height: 450px;
  overflow-y: auto;
  gap: 10px;
  margin-top: 26px;
}

/* 自定义滚动条样式 */
.logs_box::-webkit-scrollbar {
  width: 0;
  background: transparent;
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

.radio-button {
  position: absolute;
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
.item .checked + .log-image {
  border: 2px solid #4caf50 !important;
}
</style>
