<template>
  <view class="container">
    <view class="info_img">
      <image style="width: 100%;" src="https://tse2-mm.cn.bing.net/th/id/OIP-C.YKoZzgmubNBxQ8j-mmoTKAHaEK?rs=1&pid=ImgDetMain" mode="aspectFill" />
    </view>
    <view class="info_text">
      <text>名字</text>
      <text>规格</text>
      <view class="status" :class="{ 'checked-in': isCheckedIn, 'not-checked-in': !isCheckedIn }">
        <image v-if="isCheckedIn" style="width: 16px; height: 16px;" src=" @/static/images/Fram1e.png " mode="aspectFill" />
        <text>{{ isCheckedIn ? '已打卡' : '未打卡' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { punchIn, getUrlParameter } from '@/utils/api'; // 引入punchIn方法

const isCheckedIn = ref(false) // 初始化打卡状态，可以根据实际情况更新这个值

// 这里可以添加方法来更新打卡状态，例如在用户打卡时调用
const checkIn = () => {
  isCheckedIn.value = true; // 更新打卡状态
}

// 页面加载时调用punchIn方法
onMounted(async () => {
  const param = getUrlParameter("param");
  console.log(param)
  if (param) {
    uni.setStorage({
      key: "param",
      data: param,
      success: () => console.log("param存储成功"),
      fail: (err) => console.error("param存储失败", err),
    });
  }
  try {
    const response = await punchIn(param); // 调用接口
    console.log('打卡结果:', response);
    isCheckedIn.value = true; // 更新打卡状态为已打卡
  } catch (error) {
    console.error('打卡失败:', error);
  }
});
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
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  border-radius: 100px 100px 100px 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checked-in {
  background: linear-gradient(
    90deg,
    #005cb9 0%,
    #56b7e6 100%
  ); /* 打卡已完成背景颜色 */
}

.not-checked-in {
  background-color: #b3b3b3; /* 打卡未完成背景颜色 */
}
</style>
