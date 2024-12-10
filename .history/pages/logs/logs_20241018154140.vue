<template>
  <view class="logs_box">
    <view class="item" v-for="item in 6" :key="item">
      {{ item }}
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
}
.item {
  background: white;
}
</style>