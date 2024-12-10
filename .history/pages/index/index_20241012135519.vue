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
import { onShow } from "@dcloudio/uni-app";
import { checkPunchStatus, punchIn } from "@/utils/api";

const isPunched = ref(false);
const currentTimestamp = ref("");
const buttonBackgrounds = {
  default: "url('/h5/static/images/Ellipse 1.png')",
  punched: "url('/h5/static/images/Ellipse 2.png')",
};
const buttonBackground = ref(buttonBackgrounds.default);
const locationText = ref("杭州余杭");

// 计算属性用于响应式风格
const buttonStyle = computed(() => ({
  backgroundImage: buttonBackground.value,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

let timer = null;

function updateCurrentTimestamp() {
  currentTimestamp.value = new Date().toLocaleTimeString();
}

const isLoggedIn = () => !!uni.getStorageSync("token");

watch(
  () => isLoggedIn(),
  (newVal) => {
    if (!newVal) {
      console.warn("用户已注销，重定向到登录页面");
      uni.navigateTo({ url: "/pages/login/login" });
    }
  }
);

function getUrlParameter(paramName) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

onShow(async () => {
  if (!isLoggedIn()) {
    uni.navigateTo({ url: "/pages/login/login" });
    return;
  }

  updateCurrentTimestamp();
  timer = setInterval(updateCurrentTimestamp, 1000);

  const param = getUrlParameter("param");
  if (param) {
    try {
      await uni.setStorage({ key: "param", data: param });
    } catch (err) {
      console.error("param存储失败:", err);
    }
  }

  try {
    const punchStatus = await checkPunchStatus({
      param: uni.getStorageSync("param"),
    });
    if (punchStatus) {
      isPunched.value = Boolean(punchStatus.is_clock);
      locationText.value = punchStatus.point;

      buttonBackground.value = isPunched.value
        ? buttonBackgrounds.punched
        : buttonBackgrounds.default;
    }
  } catch (error) {
    console.error("获取打卡状态错误:", error);
  }
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

async function punch() {
  if (isPunched.value) {
    console.warn("已经打卡，无法重复打卡。");
    return;
  }

  isPunched.value = true;
  buttonBackground.value = buttonBackgrounds.punched;

  const punchTime = new Date().toLocaleString();

  try {
    const param = uni.getStorageSync("param");
    const response = await punchIn({ param });

    console.log("打卡响应:", response);

    if (response.code !== 0) {
      throw new Error(response.msg || "打卡失败，请重试。");
    }
    uni.showToast({ title: response.msg, icon: "success", duration: 2000 });
  } catch (error) {
    console.error("打卡失败:", error);
    uni.showToast({
      title: error.message || "打卡失败，请重试。",
      icon: "error",
      duration: 2000,
    });
  }

  sendPunchData(punchTime);
}

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
  overflow: hidden;
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
