<template>
  <view class="prize_box">
    <view class="title">奖品</view>
    <view class="prize_content">
      <image src="" mode="scaleToFill" />
      <text>恭喜你获得奖品！</text>
      <text class="address">奖品地址</text>
    </view>
  </view>
</template>

<script setup>

</script>

<style scoped>
.prize_box {
  background: #f7f8fa;
  display: flex;
  justify-content: center;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 44px;
}
.prize_content {
}
</style>