<template>
  <view class="content">
    <view class="address">
      <image
        style="width: 24px; height: 24px"
        src="/static/images/Frame(1).png"
        mode="aspectFill"
      />
      <text>{{ locationText }}</text>
    </view>
    <view
      @click="punch"
      class="punch-button"
      :style="buttonStyle"
      :disabled="isPunched"
    >
      <view style="display: grid; justify-items: center">
        <text>{{ isPunched ? "已打卡" : "打卡" }}</text>
        <text class="time-text">{{ currentTimestamp }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import eventBus from "@/utils/eventBus.js";
import { checkPunchStatus, punchIn } from "@/utils/api"; // 导入检查打卡状态的函数

const isPunched = ref(false);
const currentTimestamp = ref("");
const buttonBackground = ref("url('@/static/images/Ellipse 1.png')");
const buttonBackground1 = ref("url('@/static/images/Ellipse 2.png')");
const locationText = ref("杭州西湖");

// 计算属性用于响应式风格
const buttonStyle = computed(() => ({
  backgroundImage: buttonBackground.value,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

let timer = null;

// 更新当前时间戳的函数
function updateCurrentTimestamp() {
  currentTimestamp.value = new Date().toLocaleTimeString();
}
// 检测登录状态
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  console.log("从local中获取", token);
  return !!token; // 如果token存在，则返回true，表示已登录
};
// 初始化
onMounted(async () => {
  console.log(!isLoggedIn());
  // 检测是否已登录
  if (!isLoggedIn()) {
    console.error("用户未登录");
    // 可以在这里提示用户未登录，或者引导浏览到登录页面
    return;
  }
  updateCurrentTimestamp();
  timer = setInterval(updateCurrentTimestamp, 1000);
  // 请求打卡状态
  try {
    const punchStatus = await checkPunchStatus({
      param: localStorage.getItem("param"),
    }); // 调用检查打卡状态的函数
    console.log("Punched status", punchStatus);
    isPunched.value = Boolean(punchStatus.is_clock); // 将 is_clock 转换为布尔值
    locationText.value = punchStatus.point;
    console.log("Punched status", "已登录");
    console.log("Punched status", punchStatus.is_clock);
    console.log("Punched status", isPunched.value);
    // 在获取状态后更新背景图
    if (isPunched.value) {
      buttonBackground.value = buttonBackground1.value; // 更新背景为已打卡状态
    }
  } catch (error) {
    console.error("获取打卡状态错误:", error);
  }
});

// 清理定时器
onBeforeUnmount(() => {
  clearInterval(timer);
});

// 打卡函数
async function punch() {
  if (isPunched.value) {
    console.warn("已经打卡，无法重复打卡。");
    return;
  }

  isPunched.value = true;
  buttonBackground.value = "url('@/static/images/Ellipse 2.png')"; // 更新按钮样式相应
  console.log("-------", buttonBackground.value);

  const punchTime = new Date().toLocaleString();
  // 请求打卡接口
  try {
    const response = await punchIn({
      param: `localStorage.getItem("param", param)`,
    }); // 传入参数
    console.log("打卡响应:", response);
    showToast("打卡成功", "success");
  } catch (error) {
    console.error("打卡失败:", error);
    showToast("打卡失败，请重试", "error");
  }
  console.log(`打卡成功，时间为: ${punchTime}`);

  sendPunchData(punchTime);
}

// 发送打卡数据的函数
function sendPunchData(punchTime) {
  try {
    eventBus.emit("punchData", {
      isPunched: true,
      time: punchTime,
    });
    console.log("发送打卡数据:", { isPunched: true, punchTime });
  } catch (error) {
    console.error("发送打卡数据失败:", error);
  }
}
</script>

<style>
.content {
  height: 91.1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  justify-content: center;
  background: url("@/static/images/Frame 2219.png") no-repeat center center;
  background-size: cover;
}
.address {
  background: rgba(0, 0, 0, 0.5);
  width: 90%;
  height: 90px;
  border-radius: 15px;
  position: fixed;
  top: 70px;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.punch-button {
  margin-top: 0.625rem;
  width: 156px;
  height: 156px;
  color: #fff;
  border: none;
  border-radius: 50%;
  align-items: center;
  display: grid;
  justify-items: center;
}
.time-text {
  font-size: 24rpx;
  margin: 8rpx;
}
</style>
