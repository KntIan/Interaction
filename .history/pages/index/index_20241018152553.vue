<template>
  <view class="container">
    <view class="info_img">
      <image style="width: 100%;" src="https://tse2-mm.cn.bing.net/th/id/OIP-C.YKoZzgmubNBxQ8j-mmoTKAHaEK?rs=1&pid=ImgDetMain" mode="aspectFill" />
    </view>
    <view class="info_text">
      <text>名字</text>
      <text>规格</text>
      <text>打卡状态</text>
    </view>
  </view>
</template>

<script setup>

</script>

<style scoped>
.container {
  background: #ccc;
  padding: 20px;
}
.info_img {
  background: white;
  border-radius: 20px;
  padding: 50px;
}
.info_text {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: grid;
  justify-content: center;
  gap: 10px;
}
</style>