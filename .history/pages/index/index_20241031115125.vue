<template>
  <view class="container">
    <view v-if="showToast" class="custom-toast">
      <!-- <view class="overlay" @click="closeToast"></view> -->
      <view class="overlay"></view>
      <view class="toast-content">
        <view class="logo_tit">
          <image src="@/static/images/Frame.png" style="width: 145px; height: 20px;" />
          <text style="font-size: 14px; color: #000000;">请选择感兴趣的产品</text>
        </view>
        <view class="logs_box">
          <view class="item" v-for="(item, index) in radioOptions" :key="item.value">
            <image class="log-image" :src="item.image" />
            <view class="product-name">{{ item.label }}</view>
            <view style="text-align: center; margin: auto;" @click="handleRadioChange(item.value, index)">
              <image style="width: 24px; height: 24px;" :src="icons[index]" mode="scaleToFill" />
            </view>
          </view>
        </view>
        <view class="footer">
          <button @click="submitProduct">提交</button>
        </view>
      </view>
    </view>

    <view class="info_img">
      <image style="width: 100%;height: 100%;" :src="productInfo.thumb" />
    </view>
    <view class="info_text">
      <text>{{ productInfo.title }}</text>
      <div class="content" style="width: 295px;overflow: hidden;" v-html="productInfo.content"></div>
      <!-- <text>{{ productInfo.content }}</text> -->
      <view class="status" :class="{ 'checked-in': isCheckedIn, 'not-checked-in': !isCheckedIn }">
        <image v-if="isCheckedIn" style="width: 16px; height: 16px;" src="@/static/images/Fram1e.png" />
        <text>{{ isCheckedIn ? '已打卡' : '未打卡' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue';
import {
  onShow
} from '@dcloudio/uni-app';
import {
  punchIn,
  getRecordList,
  getUrlParameter,
  submitInterestedProduct,
  checkLoginAndRedirect
} from '@/utils/api';
import {
  useAttendanceStore
} from '@/store/store';

const attendanceStore = useAttendanceStore();
const isCheckedIn = ref(false);
const productInfo = ref({});
const showToast = ref(false);
const selectedValue = ref('');
const ids = ref([]);
const icons = ref([]);

const radioOptions = computed(() =>
  attendanceStore.logs.map(log => ({
    value: String(log.id),
    label: log.title,
    image: log.thumb,
  }))
);

const updateIcons = () => {
  icons.value = attendanceStore.logs.map(() => '/static/images/iconno.png');
};

const closeToast = () => {
  showToast.value = false;
};

const openToast = () => {
  showToast.value = true;
};

const changeIcon = (index) => {
  icons.value[index] = icons.value[index] === '/static/images/iconno.png' ?
    '/static/images/iconis.png' : '/static/images/iconno.png';
};

const onRadioChange = (value) => {
  const numericValue = Number(value);
  const index = ids.value.indexOf(numericValue);
  if (index > -1) {
    ids.value.splice(index, 1);
  } else {
    ids.value.push(numericValue);
  }
  selectedValue.value = numericValue;
};

const handleRadioChange = (value, index) => {
  selectedValue.value = value;
  onRadioChange(value);
  changeIcon(index);
};

const submitProduct = async () => {
  try {
    const param = getUrlParameter("param") || uni.getStorageSync("param");
    const idsString = ids.value.join(',');

    const response = await submitInterestedProduct({
      param,
      ids: idsString
    });

    if (response.code === 1) {
      uni.showToast({
        title: response.msg,
        icon: 'none',
        duration: 2000,
      });
      closeToast();
      updateIcons();

    } else {
      console.error('提交失败:', response.message || '未知错误');
    }
  } catch (error) {
    console.error('提交发生错误:', error.message || '未知错误');
  }
};

onShow(async () => {
  const param = uni.getStorageSync("param") || getUrlParameter("param");
  console.log(param)
  if (param) {
    try {
      uni.setStorageSync("param", param);
      const punchResponse = await punchIn({
        param
      });
      isCheckedIn.value = punchResponse.data.is_point;
      productInfo.value = punchResponse.data.product;
      if (punchResponse.data.is_all && !punchResponse.data.is_like) {
        openToast();
      }


      attendanceStore.setLogs([...attendanceStore.logs, {
        is_point: isCheckedIn.value,
        product: productInfo.value
      }]);

      const recordResponse = await getRecordList({
        param
      });
      attendanceStore.setLogs(recordResponse.data || []);
      updateIcons();



      // if (attendanceStore.logs.every(log => log.is_point)) {
      //   openToast();
      // }
    } catch (error) {
      console.error('操作失败:', error.message || '未知错误');
    }
  } else {
    console.warn('没有有效的参数');
  }
});
onMounted(() => {
  checkLoginAndRedirect();
});
</script>

<style scoped>
body {
  height: 100%;
  margin: 0;
  background: #f7f8fa;
}

.container {
  background: #f7f8fa;
  padding: 20px;
  padding-top: 0;
  height: 100vh;
}

.info_img {
  border-radius: 20px;
  padding: 50px;
  height: 260px;
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

.logs_box {
  max-height: 450px;
  overflow-y: auto;
  gap: 10px;
  margin-top: 26px;
  column-count: 2;
  /* 设置列数为2，形成瀑布流布局 */
  column-gap: 10px;
  /* 列之间的间距 */
  display: flex;
  /* 使用 Flexbox */
  flex-wrap: wrap;
  /* 允许换行 */
  gap: 10px;
  /* 设置列间隔 */
  padding: 10px;
}

.item {
  flex: 1 1 calc(50% - 10px);
  /* 设置为两列 */
  margin-bottom: 10px;
  /* 每个 item 之间的间距 */
  border-radius: 20px;
  transition: transform 0.3s;
  box-shadow: 0 0 20px rgba(0, 92, 185, 0.1);
  background: #fff;
  display: inline-block;
  /* 使用 inline-block 使得瀑布流效果更流畅 */
  break-inside: avoid;
  /* 防止在列内断裂 */
  width: 100%;
  /* 宽度设置为100%以适应不同列 */
  margin-bottom: 10px;
  border-radius: 20px;
  transition: transform 0.3s;
  box-shadow: 0 0 20px rgba(0, 92, 185, 0.1);
  background: #fff;
}
/* 如果是单数个数，最后一个 item 的宽度保持在单列 */
.item:last-child {
  flex: 0 1 calc(50% - 10px); /* 保持最后一个 item 在两列宽度 */
}

.logo_tit {
  display: grid;
  justify-items: center;
  gap: 12px;
}

.log-image {
  width: 100%;
  height: 135px;
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
.content img {
  width: 100%;
  height: auto;
}
</style>