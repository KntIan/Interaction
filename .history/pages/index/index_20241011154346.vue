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
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import eventBus from "@/utils/eventBus.js";
import { checkPunchStatus, punchIn } from "@/utils/api"; // 导入检查打卡状态的函数

const isPunched = ref(false);
const currentTimestamp = ref("");
const buttonBackground = ref("url('/h5/static/images/Ellipse 1.png')");
const buttonBackground1 = ref("url('/h5/static/images/Ellipse 2.png')");
const locationText = ref("杭州宇航");

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

  return !!token; // 如果token存在，则返回true，表示已登录
};
// 监视登录状态变化
watch(
  () => isLoggedIn(),
  (newVal) => {
    if (!newVal) {
      console.warn("用户已注销，重定向到登录页面");
      uni.navigateTo({ url: "/pages/login/login" });
    }
  }
);
// 初始化
onMounted(async () => {
  // 检测是否已登录
  if (!isLoggedIn()) {
    console.error("用户未登录");
    uni.navigateTo({ url: "/pages/login/login" });
    // 可以在这里提示用户未登录，或者引导浏览到登录页面
    return;
  }
  updateCurrentTimestamp();
  timer = setInterval(updateCurrentTimestamp, 1000);

  // 请求打卡状态

  // 获取当前页面的URL

  const hash = window.location.hash;
  console.log(hash);

  // 使用URLSearchParams获取hash中的查询参数
  const params = new URLSearchParams(hash.split("?")[1]); // 只获取'? '后面的部分
  console.log(params);
  // 获取特定的参数，例如'param'
  const param = params.get("param");
  console.log(param);

  // 如果param存在，则存储到localStorage
  if (param) {
    localStorage.setItem("param", param);
  }
  try {
    const punchStatus = await checkPunchStatus({
      param: localStorage.getItem("param"),
    }); // 调用检查打卡状态的函数

    isPunched.value = Boolean(punchStatus.is_clock); // 将 is_clock 转换为布尔值
    locationText.value = punchStatus.point;

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
  // if (isPunched.value) {
  //   console.warn("已经打卡，无法重复打卡。");
  //   return;
  // }

  isPunched.value = true;
  buttonBackground.value = "url('/h5/static/images/Ellipse 2.png')"; // 更新按钮样式相应
  console.log("-------", buttonBackground.value);

  const punchTime = new Date().toLocaleString();
  // 请求打卡接口
  try {
    const param = localStorage.getItem("param");
    const response = await punchIn({ param }); // 传入参数
    console.log("打卡响应:", response);

    // 处理打卡响应
    if (response.code === 0) {
      uni.showToast({
        title: response.msg,
        icon: "error",
        duration: 2000,
        className: "uni-toast",
      });
    }
  } catch (error) {
    console.error("打卡失败:", error);
    uni.showToast({
      title: error.message || "打卡失败，请重试。",
      icon: "error",
      duration: 2000,
    });
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
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden; /* 禁止页面滚动 */
}
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
.uni-toast {
  width: 300px;
  height: 120px;
}
</style>
