// api.js
import axios from "axios";

// 创建一个axios实例
const axiosInstance = axios.create({
  baseURL: "http://touch.yunpeng.chat/api", // 测试地址
  timeout: 10000, // 请求超时设置
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = uni.getStorageSync("token");
    if (token) {
      config.headers.token = token; // 添加Authorization头
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.error("未授权，Token可能已失效");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        uni.navigateTo({ url: "/pages/login/login" });
      } else {
        console.error("API错误:", data);
      }
    } else {
      console.error("网络错误:", error.message);
    }
    return Promise.reject(error);
  }
);

// 封装请求函数
const requestWrapper = async (method, url, data) => {
  try {
    const response = await axiosInstance[method](url, data);
    return response.data; // 返回响应数据
  } catch (error) {
    console.error(`${method.toUpperCase()}请求错误:`, error); // 打印错误信息
    throw error; // 重新抛出错误以供调用者处理
  }
};

// 封装HTTP请求方法
export const get = (url, params) => requestWrapper("get", url, { params });
export const post = (url, data) => requestWrapper("post", url, data);
export const put = (url, data) => requestWrapper("put", url, data);
export const del = (url) => requestWrapper("delete", url);

// 登录函数
export const login = async (credentials) => {
  const response = await post("/user/mobilelogin", credentials);
  const { token, ...userInfo } = response.userinfo || {};

  if (!token) throw new Error("未能获取token");

  await Promise.all([
    uni.setStorage({ key: "token", data: token }),
    uni.setStorage({ key: "userInfo", data: JSON.stringify(userInfo) }),
  ]);

  return token; // 返回token
};

// 发送验证码请求
export const sendVerificationCode = (mobile) =>
  requestWrapper("post", "/sms/send", { mobile, event: "mobilelogin" });

// 检测打卡状态的请求
export const checkPunchStatus = (params) =>
  requestWrapper("post", "/index/check", params);

// 打卡请求
export const punchIn = (params) =>
  requestWrapper("post", "/index/point", params);

// 获取打卡记录的请求
export const getPunchLogs = () => requestWrapper("post", "/index/record");
