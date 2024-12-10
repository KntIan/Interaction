<template>
  <view class="container">
    <view class="information_box">
      <view class="info-item">
        <text>姓名</text>
        <input placeholder="请输入姓名" type="text">
      </view>
      <view class="info-item">
        <text>电话</text>
        <input placeholder="请输入姓名" type="text">
      </view>
      <view placeholder="请输入姓名" class="info-item">
        <text>名</text>
        <input placeholder="请输入姓名" type="text">
      </view>
      <view class="info-item">
        <text>姓</text>
        <input placeholder="请输入姓名" type="text">
      </view>
      <view class="info-item">
        <text>姓名</text>
        <input placeholder="请输入姓名" type="text">
      </view>
    </view>
  </view>
</template>

<script setup>
	
</script>

<style scoped>
body {
  overflow: hidden;
}
.container {
  background: #ccc;
  padding: 20px;
  height: 100vh;
}
.information_box {
  padding: 20px;
  background: white;
  border-radius: 20px;
}
.info-item {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.info-item input {
  flex: 1;
  text-align: right;
}
</style>
