<template>
  <view class="login-container">
    <text style="font-size: 30px; padding: 186px 0px 52px; font-weight: bold"
      >登录</text
    >
    <button @click="weChatLogin" class="login-button">微信授权登录</button>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { login as apiLogin } from "@/utils/api";

const showToast = (title, icon = "none") => {
  uni.showToast({ title, icon });
};

const weChatLogin = async () => {
  uni.showLoading({ title: "登录中..." });

  try {
    // 第一步：调用微信登录接口
    const loginResult = await uni.login();

    if (loginResult.code) {
      // 第二步：将登录凭证发送到后台，获取用户信息
      const { token } = await apiLogin({ code: loginResult.code });

      if (token) {
        uni.setStorage({
          key: "token",
          data: token,
          success: () => {
            console.log("Token存储成功");
            showToast("登录成功", "success");
            uni.switchTab({ url: "/pages/index/index" });
          },
          fail: (err) => {
            console.error("Token存储失败", err);
          },
        });
      }
    }
  } catch (error) {
    showToast("登录失败，请重试", "error");
    console.error("登录错误:", error);
  } finally {
    uni.hideLoading();
  }
};
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
.login-button {
  width: 100%;
  background: linear-gradient(90deg, #e4bde4 0%, #f384f4 100%);
  border-radius: 64px;
  margin-top: 128px;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
}
</style>
