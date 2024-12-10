// api.js
import axios from 'axios'

// 创建一个axios实例
const axiosInstance = axios.create({
  baseURL: 'http://touch.yunpeng.chat/api', // 替换为您的API基础URL
  timeout: 10000, // 请求超时设置
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = uni.getStorageSync('token')
    if (token) {
      config.headers['token'] = token // 添加Authorization头
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response.data, // 返回data部分
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('未授权，Token可能已失效')
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
      uni.navigateTo({ url: '/pages/login/login' })
    } else {
      console.error(
        'API错误:',
        error.response ? error.response.data : error.message
      )
    }
    return Promise.reject(error)
  }
)

// 封装HTTP请求函数
const httpRequest = (method) => async (url, data) => {
  try {
    const response = await axiosInstance[method](url, data)
    return response // 返回响应数据
  } catch (error) {
    console.error(`请求 ${method.toUpperCase()} ${url} 时出错:`, error)
    throw error // 重新抛出错误以供调用者处理
  }
}

// 封装GET、POST、PUT、DELETE请求
export const get = httpRequest('get')
export const post = httpRequest('post')
export const put = httpRequest('put')
export const del = httpRequest('delete')

// 提取的存储方法
const storeData = (key, data) => {
  try {
    uni.setStorageSync(key, data)
    console.log(`${key} 存储成功`)
  } catch (err) {
    console.error(`${key} 存储失败`, err)
  }
}
// 提取的获取URL参数的方法
export const getUrlParameter = (paramName) => {
  const href = window.location.href
  const paramMatch = href.match(new RegExp(`[?&]${paramName}=([^&#]*)`))
  return paramMatch ? paramMatch[1] : null
}

// 检查用户是否登录并重定向
export const checkLoginAndRedirect = () => {
  const token = uni.getStorageSync('token')
  if (token) {
    uni.switchTab({ url: '/pages/index/index' })
  }
}
// 登录函数
export const login = async (credentials) => {
  const response = await post('/user/mobilelogin', credentials)
  const { token, ...userInfo } = response.data.userinfo || {}

  if (!token) {
    throw new Error('未能获取token') // 如果没有token，抛出错误
  }

  // 使用提取的存储方法
  storeData('token', token)
  storeData('userInfo', JSON.stringify(userInfo))

  return token // 返回token
}

// 发送验证码请求
export const sendVerificationCode = async (mobile) => {
  return await post('/sms/send', { mobile, event: 'mobilelogin' })
}

// 检测打卡状态的请求
export const checkPunchStatus = async (params) => {
  return await post('/index/check', params)
}

// 打卡请求
export const punchIn = async (params) => {
  return await post('/index/point', params)
}

// 获取打卡记录的请求
export const getPunchLogs = async () => {
  return await post('/index/record')
}

// 保存个人信息的请求
export const submitInfo = async (params) => {
  return await post('/index/record', params)
}
