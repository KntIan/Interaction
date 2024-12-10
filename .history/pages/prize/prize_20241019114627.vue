<template>
  <view class="prize_box">
    <view class="title">{{prize.title}}</view>
    <view class="prize_content">
      <image :src="prize.thumb" mode="scaleToFill" />
      <text>恭喜你获得奖品！</text>
      <text class="address">奖品地址</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getPrizeList, getUrlParameter } from '@/utils/api'; // 引入punchIn方法
const prize = ref();
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
    const response = await getPrizeList({ param }); // 调用接口
    console.log('打卡结果:', response);
    prize.value = response.data; // 提取is_point和产品信息
    console.log(prize.value);

  } catch (error) {
    console.error('打卡失败:', error);
  }
});
</script>

<style scoped>
.prize_box {
  background: #f7f8fa;
  display: grid;
  justify-items: center;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 44px;
}
.prize_content {
}
</style>