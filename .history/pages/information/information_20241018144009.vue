<template>
  <view class="container">
    <view class="information_box">
      <view class="info-item">
        <text>姓名</text>
        <input placeholder="请输入" type="text">
      </view>
      <view class="info-item">
        <text>电话</text>
        <input placeholder="请输入" type="text">
      </view>
      <view placeholder="请输入" class="info-item">
        <text>公司</text>
        <input placeholder="请输入" type="text">
      </view>
      <view class="info-item">
        <text>职位</text>
        <input placeholder="请输入" type="text">
      </view>
      <view class="info-item">
        <text>地址</text>
        <input placeholder="请输入" type="text">
      </view>

    </view>
    <view class="footer">
      <button>保存</button>
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
  position: relative;
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
.footer {
  position: absolute;
  /* bottom: 0; */
  left: 0;
  right: 0;
  /* width: 100%; */
  padding: 20px;
  /* background: #ccc; */
  /* text-align: center; */
  border-radius: 20px;
}
.footer button {
  width: 100%;
  height: 40px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
