<template>
  <view class="container">
    <view class="info_img">
      <image style="width: 100%;" src="https://tse2-mm.cn.bing.net/th/id/OIP-C.YKoZzgmubNBxQ8j-mmoTKAHaEK?rs=1&pid=ImgDetMain" mode="aspectFill" />
    </view>
    <view class="info_text">
      <text>名字</text>
      <text>规格</text>
      <text class="status">
        <image style="width: 20px; height: 20px;" src="@/static/images/Fram1e.png" mode="aspectFill" />
        {{ isCheckedIn ? '已打卡' : '未打卡' }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const isCheckedIn = ref(false) // 初始化打卡状态，可以根据实际情况更新这个值

// 这里可以添加方法来更新打卡状态，例如在用户打卡时调用
const checkIn = () => {
  isCheckedIn.value = true; // 更新打卡状态
}

// 可以在合适的地方调用 checkIn() 方法，例如在按钮点击事件中
</script>

<style scoped>
body {
  overflow: hidden;
}
.container {
  background: #f7f8fa;
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
  justify-items: center;
  gap: 10px;
  margin: 20px 0;
}
.status {
  width: 140px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: white;
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  border-radius: 100px 100px 100px 100px;
}
</style>
