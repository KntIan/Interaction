<template>
  <view class="my_box">
    <view class="title">我的</view>
    <view class="my_content">
      <image style="width: 87px;height: 12px;" src="@/static/images/Frame.png" mode="scaleToFill" />
      <view class="user">
        <text>1111</text>
        <text>1234156798</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyPage, getUrlParameter } from '@/utils/api'

const info = ref(null)

const fetchGetMyPage = async (param) => {
  try {
    const response = await getMyPage({ param })
    info.value = response.data
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
    fetchGetMyPage(param)
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
  padding: 20px;
  background: #ffffff;
  display: grid;
}
.address {
  background: linear-gradient(0deg, #005cb9 0%, #56b7e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
