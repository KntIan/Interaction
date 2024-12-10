<template>
  <view class="prize_box">
    <view class="title">奖品</view>
    <view class="prize_content" v-if="prize">
      <image style="width: 256px; height: 256px" :src="prize.thumb" mode="scaleToFill" />
      <text style="margin-top: 30px;font-size: 18px;font-weight: bold;color: #333333;">{{ prize.title }}</text>
      <text class="address" style="margin-top: 70px;font-size: 20px;">{{ prize.tips }}</text>
      <text class="address" style="font-size: 14px;">领奖地址：{{ prize.address }}</text>
    </view>
    <view v-else>
      <text>加载奖品信息中...</text>
    </view>
    <view style="text-align: left;color: #cccccc;font-size: 28px;">
      领奖流程：<br />
      1.全部产品打卡完成<br />
      2.自主去往上方领奖地点找相关工作人员兑换奖品<br />
      3.找到相关工作人员后，点击我的-》领奖记录，展示给工作人员看<br />
      4.由工作人员操作点击删除领奖记录后发放奖品
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
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

onShow(() => {
  const param = getUrlParameter('param') || uni.getStorageSync("param");
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
body {
  /* overflow: hidden; */
}
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
  padding-bottom: 27px;
}
.address {
  background: linear-gradient(0deg, #005cb9 0%, #56b7e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
