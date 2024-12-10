// api.js
import axios from "axios";

// 创建一个axios实例
const axiosInstance = axios.create({
  baseURL: "http://touch.yunpeng.chat/api",
  timeout: 10000,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
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
      if (error.response.status === 401) {
        console.error("未授权，Token可能已失效");
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        uni.navigateTo({ url: "/pages/login/login" });
      } else {
        console.error("API错误:", error.response.data);
      }
    } else {
      console.error("请求失败:", error.message);
    }
    return Promise.reject(error);
  }
);

// 封装请求函数
const request = async (method, url, data) => {
  try {
    const response = await axiosInstance[method](url, data);
    return response;
  } catch (error) {
    console.error(`${method.toUpperCase()}请求错误:`, error);
    throw error;
  }
};

// 封装常用请求方法
export const get = (url, params) => request("get", url, { params });
export const post = (url, data) => request("post", url, data);
export const put = (url, data) => request("put", url, data);
export const del = (url) => request("delete", url);

// 登录函数
export const login = async (credentials) => {
  const response = await post("/user/mobilelogin", credentials);
  console.log(response);
  const token = response.data.userinfo.token;
  console.log(token);
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(response.data.userinfo));
  } else {
    throw new Error("未能获取token");
  }
  return token;
};

// 发送验证码请求
export const sendVerificationCode = (mobile) => {
  return post("/sms/send", { mobile, event: "mobilelogin" });
};

// 检测打卡状态的请求
export const checkPunchStatus = (params) => {
  return post("/index/check", params);
};

// 打卡请求
export const punchIn = (params) => {
  return post("/index/point", params);
};

// 获取打卡记录的请求
export const getPunchLogs = () => {
  return post("/index/record");
};
