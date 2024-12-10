<template>
  <view class="prize_box">
    <view class="title">奖品</view>
    <view class="prize_content">
      <image style="width: 256px; height: 256px" :src="prize?.thumb" mode="scaleToFill" />
      <text style="margin-top: 30px;">{{ prize?.title }}</text>
      <text class="address" style="margin-top: 70px;font-size: 20px;">{{ prize?.tips }}</text>
      <text class="address" style="font-size: 14px;">{{ prize?.address }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getPrizeList, getUrlParameter } from '@/utils/api' // 引入punchIn方法
const prize = ref(null)
onMounted(async () => {
  const param = getUrlParameter('param')
  console.log(param)
  if (param) {
    uni.setStorage({
      key: 'param',
      data: param,
      success: () => console.log('param存储成功'),
      fail: (err) => console.error('param存储失败', err),
    })
  }
  try {
    const response = await getPrizeList({ param }) // 调用接口
    console.log('打卡结果:', response)
    prize.value = response.data
    console.log(prize.value)
  } catch (error) {
    console.error('打卡失败:', error)
  }
})
</script>

<style scoped>
.prize_box {
  background: #f7f8fa;
  height: 100vh;
  text-align: center;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 44px;
}
.prize_content {
  padding: 44px;
  background: #ffffff;
  display: grid;
  justify-items: center;
  margin: 15px;
  border-radius: 15px;
}
.address {
  background: linear-gradient(0deg, #005cb9 0%, #56b7e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
