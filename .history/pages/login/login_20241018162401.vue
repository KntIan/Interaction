<template>
  <view class="login-container">
    <view class="logo">
      <image src="@/static/images/Frame.png" mode="aspectFit" />
    </view>
    <view class="input-group">

      <view class="input-container">
        <image src="@/static/images/phone.png" class="icon" mode="aspectFit"></image>
        <text class="country-code">+86</text>
        <input class="input-field" v-model="phone" type="text" placeholder="请输入手机号" />
      </view>

      <view class="input-container">
        <image src="@/static/images/code.png" class="icon" mode="aspectFit"></image>
        <input class="input-field" v-model="verificationCode" type="text" placeholder="请输入验证码" />
        <view @click.stop="sendVerificationCode" :disabled="isCodeSent" :class="{ 'code-button': true, 'disabled-button': isCodeSent }">
          {{ isCodeSent ? `${countdown}秒` : '获取验证码' }}
        </view>
      </view>
    </view>
    <button @click="login" class="login-button">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
  </view>
</template>

<script setup>
// import { ref, watch, onMounted } from 'vue'
// import {
//   login as apiLogin,
//   sendVerificationCode as apiSendCode,
//   getUrlParameter,
//   checkLoginAndRedirect,
// } from '@/utils/api'

// const phone = ref('')
// const verificationCode = ref('')
// const isCodeSent = ref(false)
// const countdown = ref(60)
// let timer = null

// const showToast = (title, icon = 'none') => {
//   uni.showToast({
//     title,
//     icon,
//   })
// }

// const sendVerificationCode = async () => {
//   const phonePattern = /^[1][3-9][0-9]{9}$/

//   if (!phonePattern.test(phone.value)) {
//     return showToast('手机号格式不正确')
//   }

//   uni.showLoading({
//     title: '发送中...',
//   })

//   try {
//     await apiSendCode(phone.value)
//     isCodeSent.value = true
//     startCountdown()
//     showToast('验证码发送成功', 'success')
//   } catch (error) {
//     showToast('发送验证码失败，请重试', 'error')
//     console.error('发送验证码错误:', error)
//   } finally {
//     uni.hideLoading()
//   }
// }

// const startCountdown = () => {
//   countdown.value = 60
//   clearInterval(timer)
//   timer = setInterval(() => {
//     countdown.value--
//     if (countdown.value <= 0) {
//       clearInterval(timer)
//       isCodeSent.value = false
//     }
//   }, 1000)
// }

const login = async () => {
  uni.navigateTo({ url: '/pages/information/information' })
}
// const login = async () => {
//   if (!verificationCode.value) {
//     return showToast('请输入验证码')
//   }

//   uni.showLoading({
//     title: '登录中...',
//   })

//   try {
//     const { token } = await apiLogin({
//       mobile: phone.value,
//       captcha: verificationCode.value,
//     })
//     if (token) {
//       uni.setStorage({
//         key: 'token',
//         data: token,
//         success: () => {
//           console.log('Token存储成功')
//           // 在这里进行跳转
//           showToast('登录成功', 'success')
//           uni.navigateTo({ url: '/pages/information/information' })
//         },
//         fail: (err) => {
//           console.error('Token存储失败', err)
//         },
//       })
//       // showToast("登录成功", "success");
//       // uni.switchTab({ url: "/pages/index/index" });
//     }
//   } catch (error) {
//     showToast('登录失败，请重试', 'error')
//     console.error('登录错误:', error)
//   } finally {
//     uni.hideLoading()
//   }
// }

// onMounted(() => {
//   const param = getUrlParameter('param')
//   if (param) {
//     uni.setStorage({
//       key: 'param',
//       data: param,
//       success: () => console.log('param存储成功'),
//       fail: (err) => console.error('param存储失败', err),
//     })
//   }

//   checkLoginAndRedirect()
// })

// watch(isCodeSent, (newVal) => {
//   if (!newVal) {
//     clearInterval(timer)
//   }
// })
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
  display: flex;
  flex-direction: column;
}

.logo {
  width: 100%;
  text-align: center;
}
.input-group {
  display: grid;
  margin-bottom: 15px;
  gap: 30rpx;
}
.input-container {
  flex-direction: row;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 5px;
  display: flex;
  line-height: 34px;
  background: white;
}
.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.country-code {
  margin-right: 5px;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
}
.code-group {
  display: flex;
}

.code-button,
.login-button {
  background-color: #007aff;

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
  width: 110px;
  height: 32px;
  border-radius: 100px;
  border: 1px solid #394681;
  background: #394681;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
}

.disabled-button {
  pointer-events: none;
}
</style>
