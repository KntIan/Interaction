<template>
  <view class="my_box">
    <view class="title">我的</view>
    <view class="my_content" v-if="prize">
      <image style="width: 256px; height: 256px" :src="prize.thumb" mode="scaleToFill" />
      <text style="margin-top: 30px;font-size: 18px;font-weight: bold;color: #333333;">{{ prize.title }}</text>
      <text class="address" style="margin-top: 70px;font-size: 20px;">{{ prize.tips }}</text>
      <text class="address" style="font-size: 14px;">{{ prize.address }}</text>
    </view>
    <view v-else>
      <text>加载奖品信息中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPrizeList, getUrlParameter } from '@/utils/api'

const prize = ref(null)

const fetchPrizeData = async (param) => {
  try {
    const response = await getPrizeList({ param })
    prize.value = response.data
  } catch (error) {
    console.error('打卡失败:', error)
    // 根据业务需要可以在这里增加用户友好的错误提示
  }
}

onMounted(() => {
  const param = getUrlParameter('param')
  if (param) {
    uni.setStorage({
      key: 'param',
      data: param,
      success: () => console.log('param存储成功'),
      fail: (err) => console.error('param存储失败', err),
    })
    fetchPrizeData(param)
  } else {
    console.warn('参数未提供')
  }
})
</script>

<style scoped>
.my_box {
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
.my_content {
  padding: 44px;
  background: #ffffff;
  display: grid;
  justify-items: center;
  margin: 15px;
  border-radius: 15px;
  padding-bottom: 27px;
}
.address {
  background: linear-gradient(0deg, #005cb9 0%, #56b7e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
