<template>
  <view class="login-container">
    <view class="logo">
      <image src="@/static/images/bg.png" mode="a" />
    </view>
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
          {{ isCodeSent ? `${countdown}秒` : '获取' }}
        </view>
      </view>
    </view>
    <button @click="login" class="login-button">登录</button>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  login as apiLogin,
  sendVerificationCode as apiSendCode,
  getUrlParameter,
  checkLoginAndRedirect,
} from '@/utils/api'

const phone = ref('')
const verificationCode = ref('')
const isCodeSent = ref(false)
const countdown = ref(60)
let timer = null

const showToast = (title, icon = 'none') => {
  uni.showToast({
    title,
    icon,
  })
}

const sendVerificationCode = async () => {
  const phonePattern = /^[1][3-9][0-9]{9}$/

  if (!phonePattern.test(phone.value)) {
    return showToast('手机号格式不正确')
  }

  uni.showLoading({
    title: '发送中...',
  })

  try {
    await apiSendCode(phone.value)
    isCodeSent.value = true
    startCountdown()
    showToast('验证码发送成功', 'success')
  } catch (error) {
    showToast('发送验证码失败，请重试', 'error')
    console.error('发送验证码错误:', error)
  } finally {
    uni.hideLoading()
  }
}

const startCountdown = () => {
  countdown.value = 60
  clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCodeSent.value = false
    }
  }, 1000)
}

const login = async () => {
  if (!verificationCode.value) {
    return showToast('请输入验证码')
  }

  uni.showLoading({
    title: '登录中...',
  })

  try {
    const { token } = await apiLogin({
      mobile: phone.value,
      captcha: verificationCode.value,
    })
    if (token) {
      uni.setStorage({
        key: 'token',
        data: token,
        success: () => {
          console.log('Token存储成功')
          // 在这里进行跳转
          showToast('登录成功', 'success')
          uni.switchTab({
            url: '/pages/index/index',
          })
        },
        fail: (err) => {
          console.error('Token存储失败', err)
        },
      })
      // showToast("登录成功", "success");
      // uni.switchTab({ url: "/pages/index/index" });
    }
  } catch (error) {
    showToast('登录失败，请重试', 'error')
    console.error('登录错误:', error)
  } finally {
    uni.hideLoading()
  }
}

onMounted(() => {
  const param = getUrlParameter('param')
  if (param) {
    uni.setStorage({
      key: 'param',
      data: param,
      success: () => console.log('param存储成功'),
      fail: (err) => console.error('param存储失败', err),
    })
  }

  checkLoginAndRedirect()
})

watch(isCodeSent, (newVal) => {
  if (!newVal) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background: #f1f1f1;
}

.login-container {
  height: 100vh;
  padding: 24px;
  color: white;
  display: flex;
  flex-direction: column;
}
.logo {
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
