<template>
  <view class="login-container">
    <text style="font-size: 30px; padding: 186px 0px 52px; font-weight: bold"
      >登录</text
    >
    <view class="input-group">
      <view style="display: flex; align-items: center; gap: 5px">
        <image
          src="@/static/images/Frame 2218.png"
          style="width: 24px; height: 24px"
        ></image>
        <text>手机号</text>
      </view>
      <view
        style="
          display: flex;
          align-items: center;
          border-bottom: 1px solid #999999;
        "
      >
        <text>+86</text>
        <input
          type="text"
          placeholder="请输入手机号"
          v-model="phone"
          class="phone-input"
        />
      </view>
      <view style="display: flex; align-items: center; gap: 5px">
        <image
          src="@/static/images/vuesaxlinearshield-tick.png"
          style="width: 24px; height: 24px"
        ></image>
        <text>验证码</text>
      </view>
      <view class="code-group" style="border-bottom: 1px solid #999999">
        <input
          type="text"
          placeholder="请输入验证码"
          v-model="verificationCode"
          class="code-input"
        />
        <button
          @click="sendVerificationCode"
          :disabled="isCodeSent"
          class="code-button"
        >
          {{ isCodeSent ? `${countdown}秒` : "获取" }}
        </button>
      </view>
    </view>
    <button @click="login" class="login-button">登录</button>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";

const phone = ref("");
const verificationCode = ref("");
const isCodeSent = ref(false);
const countdown = ref(60);
let timer = null;

const showToast = (title, icon = "none") => {
  uni.showToast({ title, icon });
};

const sendVerificationCode = () => {
  if (!/^[1][3-9][0-9]{9}$/.test(phone.value)) {
    return showToast("手机号格式不正确");
  }

  uni.showLoading({ title: "发送中..." });

  setTimeout(() => {
    uni.hideLoading();
    isCodeSent.value = true;
    startCountdown();
    showToast("验证码发送成功", "success");
  }, 1000);
};

const startCountdown = () => {
  countdown.value = 60;
  clearInterval(timer); // 确保旧定时器被清除
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      isCodeSent.value = false;
    }
  }, 1000);
};

const login = () => {
  if (!verificationCode.value) {
    return showToast("请输入验证码");
  }

  uni.showLoading({ title: "登录中..." });

  setTimeout(() => {
    uni.hideLoading();

    showToast("登录成功", "success");
    uni.switchTab({ url: "/pages/index/index" });

    showToast("登录失败，请重试", "error");
  }, 1000);
};

watch(isCodeSent, (newVal) => {
  if (!newVal) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style>
.login-container {
  height: 100vh; /* 将高度改为 100vh */
  padding: 24px;
  color: white;
  display: flex;
  flex-direction: column;
  background: url("@/static/images/Mask group.png") no-repeat;
  background-size: 100% 100%;
}

.input-group {
  display: grid;
  margin-bottom: 15px;
  gap: 30rpx;
}

.code-group {
  display: flex;
}

.phone-input,
.code-input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 5px;
  font-weight: 400;
  font-size: 14px;
  color: #aaaaaa;
  line-height: 16px;
}

.code-button,
.login-button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 5px;
}
.login-button {
  width: 100%;
  background: linear-gradient(90deg, #e4bde4 0%, #f384f4 100%);
  border-radius: 64px 64px 64px 64px;
  margin-top: 128px;
}
.code-button {
  width: 56px;
  height: 32px;
  border-radius: 100px 100px 100px 100px;
  border: 1px solid #ffffff;
  background: none;
  font-size: 14px;
  padding: 0;
  line-height: 32px;
}
</style>
