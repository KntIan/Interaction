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
import { checkPunchStatus, punchIn } from "@/utils/api";

const isPunched = ref(false);
const currentTimestamp = ref("");
const locationText = ref("杭州西湖");
const buttonBackground = ref("url('/h5/static/images/Ellipse 1.png')");
const buttonBackground1 = ref("url('/h5/static/images/Ellipse 2.png')");

const buttonStyle = computed(() => ({
  backgroundImage: isPunched.value
    ? buttonBackground1.value
    : buttonBackground.value,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

let timer = null;

function updateCurrentTimestamp() {
  currentTimestamp.value = new Date().toLocaleTimeString();
}

const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

onMounted(async () => {
  if (!isLoggedIn()) {
    console.error("用户未登录");
    return;
  }

  updateCurrentTimestamp();
  timer = setInterval(updateCurrentTimestamp, 1000);

  try {
    const punchStatus = await checkPunchStatus({
      param: localStorage.getItem("param"),
    });
    isPunched.value = Boolean(punchStatus.is_clock);
    locationText.value = punchStatus.point;
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

  try {
    const response = await punchIn({
      param: localStorage.getItem("param"),
    });
    showToast("打卡成功", "success");
    sendPunchData(new Date().toLocaleString());
  } catch (error) {
    console.error("打卡失败:", error);
    showToast("打卡失败，请重试", "error");
  }
}

function sendPunchData(punchTime) {
  try {
    eventBus.emit("punchData", { isPunched: true, time: punchTime });
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
  overflow: hidden;
}
.content {
  height: 91.1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  display: grid;
  justify-items: center;
}
.time-text {
  font-size: 24rpx;
  margin: 8rpx;
}
</style>
