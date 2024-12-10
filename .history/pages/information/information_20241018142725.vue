<template>
  <view class="container">
    <view class="information_box">
      <view class="info-item">
        <text>姓名</text>
        <input type="text">
      </view>
      <view class="info-item">
        <text>年龄</text>
        <input type="text">
      </view>
      <view class="info-item">
        <text>名</text>
        <input type="text">
      </view>
      <view class="info-item">
        <text>姓</text>
        <input type="text">
      </view>
      <view class="info-item">
        <text>姓名</text>
        <input type="text">
      </view>
    </view>
  </view>
</template>

<script setup>
	
</script>

<style scoped>
.container {
  background: #ccc;
  padding: 20px;
  height: 100vh;
  overflow-y: auto; /* 添加滚动条使内容可滚动 */
}
.information_box {
  padding: 20px;
  background: white;
  border-radius: 20px;
}
</style>
