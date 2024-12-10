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
          :class="{ 'code-button': true, 'disabled-button': isCodeSent }"
        >
          {{ isCodeSent ? `${countdown}秒` : "获取" }}
        </view>
      </view>
    </view>
    <button @click="login" class="login-button">登录</button>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import {
  login as apiLogin,
  sendVerificationCode as apiSendCode,
} from "@/utils/api";

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
    await apiSendCode(phone.value);
    isCodeSent.value = true;
    startCountdown();
    showToast("验证码发送成功", "success");
  } catch (error) {
    showToast("发送验证码失败，请重试", "error");
    console.error("发送验证码错误:", error);
  } finally {
    uni.hideLoading();
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

const login = async () => {
  if (!verificationCode.value) {
    return showToast("请输入验证码");
  }

  uni.showLoading({ title: "登录中..." });

  try {
    const response = await apiLogin({
      mobile: phone.value,
      captcha: verificationCode.value,
    });
    const token = response; // 假设响应直接返回token
    console.log(token);
    if (token) {
      // 使用uniapp与支付宝互通的本地存储API存储token
      uni.setStorage({
        key: "token",
        data: token,
        success: (res) => {
          console.log("Token存储成功", res);
        },
        fail: (err) => {
          console.error("Token存储失败", err);
        },
      });
      showToast("登录成功", "success");
      uni.switchTab({ url: "/pages/index/index" });
    }
  } catch (error) {
    showToast("登录失败，请重试", "error");
    console.error("登录错误:", error);
  } finally {
    uni.hideLoading();
  }
};
// 封装获取URL参数的函数
function getUrlParameter(paramName) {
  // 获取当前页面的URL
  const href = window.location.href;
  console.log(href);

  // 使用正则表达式提取指定参数
  const paramMatch = href.match(
    new RegExp(`[?&]${paramName}=([^&#]*)|(?:#|\/).*?[?&]${paramName}=([^&#]*)`)
  );

  // 如果找到了param，则提取它的值
  return paramMatch ? paramMatch[1] || paramMatch[2] : null;
}
onMounted(() => {
  // 使用封装的函数获取指定参数
  const param = getUrlParameter("param"); // 这里可以替换成任何参数名
  console.log(param);
  // 如果param存在，则存储到localStorage
  if (param) {
    // 使用uniapp与支付宝互通的本地存储API存储token
    uni.setStorage({
      key: "param",
      data: param,
      success: (res) => {
        console.log("param存储成功", res);
      },
      fail: (err) => {
        console.error("param存储失败", err);
      },
    });
  }
  // 检查token是否存在
  console.log(uni.getStorageSync({ key: "token" }));
  const token = uni.getStorageSync({ key: "token" }).data;
  console.log("获取Token成功", token);
  if (token) {
    // 如果token存在，则直接跳转到index页面
    uni.switchTab({ url: "/pages/index/index" });
  }
});

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
  overflow: hidden;
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
.disabled-button {
  pointer-events: none;
}
</style>
