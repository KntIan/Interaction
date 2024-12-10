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
      <view class="item"><label>公司</label><text>公司</text></view>
      <view class="item"><label>职位</label><text>公司</text></view>
      <view class="item"><label>地址</label><text>公司</text></view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyPage } from '@/utils/api'

const info = ref(null)

const fetchGetMyPage = async () => {
  try {
    const response = await getMyPage()
    info.value = response.data
  } catch (error) {
    console.error('打卡失败:', error)
    // 根据业务需要可以在这里增加用户友好的错误提示
  }
}

onMounted(() => {
  fetchGetMyPage()
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
  padding: 0 20px;
  border-radius: 15px;
  margin: 15px;
  text-align: left;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(78, 136, 255, 0.1);
}
.item {
  width: 100%;
  border-bottom: 1px solid #f7f8fa;
  line-height: 51px;
}
.item label {
  padding-right: 15px;
  color: #808080;
}
.item text {
  color: #333333;
}
</style>
