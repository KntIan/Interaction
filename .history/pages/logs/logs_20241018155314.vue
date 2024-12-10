<template>
  <view class="logs_box">
    <view class="item" v-for="item in 6" :key="item">
      <image style="width: 100%;" src="https://img.zcool.cn/community/01129957723f4b0000018c1b6692bb.jpg@2o.jpg" mode="aspectFill" />
      <text>产品</text>
      <text>打卡状态</text>
    </view>
  </view>
</template>

<script setup>

</script>

<style scoped>
.logs_box {
  background: #ccc;
  display: grid;
  gap: 10px;
  grid-template-columns: 50% 50%;
  justify-items: center;
  align-items: center;
  padding: 20px;
}
.item {
  background: white;
  border: 1px solid #ccc;
  display: grid;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  row-gap: 5px;
}
</style>