// api.js
import axios from "axios";

// 创建一个axios实例
const axiosInstance = axios.create({
  // baseURL: "https://future.dskb.cn/api", // 替换为您的API基础URL
  baseURL: "http://touch.yunpeng.chat/api", // 测试地址
  timeout: 10000, // 请求超时设置
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = `${token}`; // 添加Authorization头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // 返回data部分
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("未授权，Token可能已失效");
      // 清除无效的Token和用户信息
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      // 重定向到登录页面
      uni.navigateTo({ url: "/pages/login/login" });
    } else {
      console.error(
        "API错误:",
        error.response ? error.response.data : error.message
      );
    }
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params) => {
  return axiosInstance.get(url, { params });
};

// 封装POST请求
export const post = (url, data) => {
  return axiosInstance.post(url, data);
};

// 封装PUT请求
export const put = (url, data) => {
  return axiosInstance.put(url, data);
};

// 封装DELETE请求
export const del = (url) => {
  return axiosInstance.delete(url);
};

// 登录函数
export const login = async (credentials) => {
  try {
    const response = await post("/user/mobilelogin", credentials); // 发送请求并获取响应

    // 打印响应以确认结构
    console.log("API响应:", response);

    // 从响应中获取token，假设token在data属性中
    const token = response.data.userinfo.token; // 访问嵌套属性
    const userInfo = response.data.userinfo; // 获取用户信息
    // 检查token是否存在并存储
    if (token) {
      localStorage.setItem("token", token); // 存储token到localStorage
      // 存储用户信息，比如手机号等
      localStorage.setItem("userInfo", JSON.stringify(userInfo)); // 存储用户信息
    } else {
      throw new Error("未能获取token"); // 如果没有token，抛出错误
    }

    return token; // 返回token
  } catch (error) {
    console.error("登录错误:", error); // 打印错误信息
    throw error; // 重新抛出错误以便后续处理
  }
};

// 发送验证码请求
export const sendVerificationCode = async (mobile) => {
  try {
    const response = await axiosInstance.post("/sms/send", {
      mobile,
      event: "mobilelogin", // 增加固定值
    });
    return response.data; // 返回响应数据
  } catch (error) {
    throw error; // 重新抛出错误以供调用者处理
  }
};
// 检测打卡状态的请求
export const checkPunchStatus = async (params) => {
  try {
    const response = await axiosInstance.post("/index/check", params); // 假设这是检测打卡状态的API
    return response.data; // 返回响应数据
  } catch (error) {
    throw error; // 重新抛出错误以供调用者处理
  }
};
// 打卡请求
export const punchIn = async (params) => {
  try {
    const response = await axiosInstance.post("/index/point", params); //
    return response; // 返回响应数据
  } catch (error) {
    throw error; // 重新抛出错误以供调用者处理
  }
};

// 获取打卡记录的请求
export const getPunchLogs = async () => {
  try {
    const response = await axiosInstance.post("/index/record"); // 假设这是获取打卡记录的API
    return response.data; // 返回响应数据
  } catch (error) {
    throw error; // 重新抛出错误以供调用者处理
  }
};
