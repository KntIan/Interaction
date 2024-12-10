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
import { ref, onBeforeUnmount, computed, watch } from "vue";
import eventBus from "@/utils/eventBus.js";
import { onShow } from "@dcloudio/uni-app";
import { checkPunchStatus, punchIn } from "@/utils/api";

const isPunched = ref(false);
const currentTimestamp = ref("");
const buttonBackground = ref("url('/h5/static/images/Ellipse 1.png')");
const buttonBackground1 = ref("url('/h5/static/images/Ellipse 2.png')");
const locationText = ref("杭州余杭");

const buttonStyle = computed(() => ({
  backgroundImage: buttonBackground.value,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

let timer = null;

// 定时更新当前时间戳
function updateCurrentTimestamp() {
  currentTimestamp.value = new Date().toLocaleTimeString();
}

// 检测登录状态的函数
const isLoggedIn = () => !!uni.getStorageSync("token");

// 监视登录状态变化
watch(isLoggedIn, (newVal) => {
  if (!newVal) {
    console.warn("用户已注销，重定向到登录页面");
    uni.navigateTo({ url: "/pages/login/login" });
  }
});

// 获取URL参数的函数
function getUrlParameter(paramName) {
  const href = window.location.href;
  const paramMatch = href.match(
    new RegExp(`[?&]${paramName}=([^&#]*)|(?:#|\/).*?[?&]${paramName}=([^&#]*)`)
  );
  return paramMatch ? paramMatch[1] || paramMatch[2] : null;
}

onShow(async () => {
  if (!isLoggedIn()) {
    console.error("用户未登录");
    uni.navigateTo({ url: "/pages/login/login" });
    return;
  }

  updateCurrentTimestamp();
  timer = setInterval(updateCurrentTimestamp, 1000);

  const param = getUrlParameter("param");
  if (param) {
    try {
      await uni.setStorage({ key: "param", data: param });
      console.log("param存储成功");
    } catch (err) {
      console.error("param存储失败:", err);
    }
  }

  try {
    const punchStatus = await checkPunchStatus({
      param: uni.getStorageSync("param"),
    });
    isPunched.value = Boolean(punchStatus.is_clock);
    locationText.value = punchStatus.point;

    // 更新背景为已打卡状态
    if (isPunched.value) {
      buttonBackground.value = buttonBackground1.value;
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
  buttonBackground.value = buttonBackground1.value;

  const punchTime = new Date().toLocaleString();

  try {
    const param = uni.getStorageSync("param");
    const response = await punchIn({ param });

    if (response.code === 0) {
      uni.showToast({ title: response.msg, icon: "error", duration: 2000 });
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
    eventBus.emit("punchData", { isPunched: true, time: punchTime });
    console.log("发送打卡数据:", { isPunched: true, punchTime });
  } catch (error) {
    console.error("发送打卡数据失败:", error);
  }
}
</script>

<style scoped>
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
</style>
