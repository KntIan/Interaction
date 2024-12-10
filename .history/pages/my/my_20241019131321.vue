<template>
  <view class="my_box">
    <view class="title">我的</view>
    <view class="card">
      <image class="logo" style="width: 87px;height: 12px;" src="@/static/images/Frame.png" mode="scaleToFill" />
      <view class="user-info">
        <view class="name">1111</view>
        <view class="phone">1234156798</view>
      </view>
    </view>
    <view class="info">
      <view><label>公司</label><text>公司</text></view>
      <view><label>职位</label><text>公司</text></view>
      <view><label>地址</label><text>公司</text></view>
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
.card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  padding: 20px;
  border-radius: 15px;
  margin: 15px;
  gap: 54px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(78, 136, 255, 0.1);
}

.logo {
  grid-column: 2;
}

.user-info {
  grid-column: 1;
}
.name {
  font-weight: 600;
  color: #333333;
  text-align: left;
}

.phone {
  color: #333333;

  text-align: left;
}
.info {
  display: grid;
  padding: 20px;
  border-radius: 15px;
  margin: 15px;
  gap: 54px;
  justify-items: baseline;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(78, 136, 255, 0.1);
}
</style>
