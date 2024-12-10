<template>
  <view class="prize_box">
    <view class="title">奖品</view>
    <view class="prize_content">
      <image src="" mode="scaleToFill" />
      <text>恭喜你获得奖品！</text>
      <text class="address">奖品地址</text>
    </view>
  </view>
</template>

<script setup>
import {onMounted, ref}	from 'vue'
import { getPrizeList, getUrlParameter } from '@/util/api'
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
    const { is_point, product } = response.data; // 提取is_point和产品信息
    // 更新打卡状态
    isCheckedIn.value = is_point;
    // 更新产品信息
    productInfo.value = product;
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