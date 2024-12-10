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
        <view
          @click.stop="sendVerificationCode"
          :disabled="isCodeSent"
          class="code-button"
        >
          {{ isCodeSent ? `${countdown}秒` : "获取" }}
        </view>
      </view>
    </view>
    <button @click="login1" class="login-button">登录</button>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { login, sendVerificationCode as sendCode } from "@/utils/api"; // 导入封装的登录和发送验证码函数

const phone = ref("");
const verificationCode = ref("");
const isCodeSent = ref(false);
const countdown = ref(60);
let timer = null;

const showToast = (title, icon = "none") => {
  uni.showToast({ title, icon });
};

const sendVerificationCode = async () => {
  const phonePattern = /^[1][3-9][0-9]{9}$/;

  if (!phonePattern.test(phone.value)) {
    return showToast("手机号格式不正确");
  }

  uni.showLoading({ title: "发送中..." });

  try {
    // 调用封装的发送验证码函数，传入手机号
    await sendCode(phone.value);

    isCodeSent.value = true;
    startCountdown();
    showToast("验证码发送成功", "success");
  } catch (error) {
    showToast("发送验证码失败，请重试", "error");
    console.error("发送验证码错误:", error);
  } finally {
    uni.hideLoading(); // 确保在请求结束后隐藏加载提示
  }
};

const startCountdown = () => {
  countdown.value = 60;
  clearInterval(timer);
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      isCodeSent.value = false;
    }
  }, 1000);
};

const login1 = async () => {
  if (!verificationCode.value) {
    return showToast("请输入验证码");
  }

  uni.showLoading({ title: "登录中..." });

  try {
    // 调用封装的登录函数，传入手机号和验证码
    const response = await login({
      mobile: phone.value,
      captcha: verificationCode.value,
    });
    console.log("登录响应：", response); // 可选：记录登录响应

    const token = response; // 存储token
    if (token) {
      localStorage.setItem("token", token); // 存储token到localStorage
      localStorage.setItem("mobile", phone.value); // 存储手机号
      // 如果有其他用户信息，可以在这里存储
    }
    showToast("登录成功", "success");
    uni.switchTab({ url: "/pages/index/index" }); // 登录成功后导航
  } catch (error) {
    showToast("登录失败，请重试", "error");
    console.error("登录错误:", error); // 可选：记录错误
  } finally {
    uni.hideLoading(); // 确保在请求结束后隐藏加载提示
  }
};
onMounted(() => {
  // 获取当前页面的URL
  const url = new URL(window.location.href);
  console.log(url); // 可选：记录当前页面的查询参数

  // 使用URLSearchParams获取查询参数
  const params = new URLSearchParams(url.search);
  console.log(params);
  // 获取特定的参数，例如'id'
  const param = params.get("param");
  console.log(param);
  localStorage.setItem("param", param);
}),
  watch(isCodeSent, (newVal) => {
    if (!newVal) {
      clearInterval(timer);
    }
  });
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden; /* 禁止页面滚动 */
}
.login-container {
  height: 100vh;
  padding: 24px;
  color: white;
  display: flex;
  flex-direction: column;
  background: url("@/static/images/Mask group.png") no-repeat;
  background-size: cover;
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
  border-radius: 64px;
  margin-top: 128px;
}

.code-button {
  width: 56px;
  height: 32px;
  border-radius: 100px;
  border: 1px solid #ffffff;
  background: none;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
}
</style>
