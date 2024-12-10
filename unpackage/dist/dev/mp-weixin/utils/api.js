"use strict";
const common_vendor = require("../common/vendor.js");
const axiosInstance = common_vendor.axios.create({
  baseURL: "http://touch.yunpeng.chat/api",
  // 替换为您的API基础URL
  timeout: 1e4
  // 请求超时设置
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response.data,
  // 返回data部分
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("未授权，Token可能已失效");
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    } else {
      console.error(
        "API错误:",
        error.response ? error.response.data : error.message
      );
    }
    return Promise.reject(error);
  }
);
const httpRequest = (method) => async (url, data) => {
  try {
    const response = await axiosInstance[method](url, data);
    return response;
  } catch (error) {
    console.error(`请求 ${method.toUpperCase()} ${url} 时出错:`, error);
    throw error;
  }
};
const post = httpRequest("post");
const getUrlParameter = (paramName) => {
  const href = window.location.href;
  const paramMatch = href.match(new RegExp(`[?&]${paramName}=([^&#]*)`));
  return paramMatch ? paramMatch[1] : null;
};
const checkLoginAndRedirect = () => {
  const token = common_vendor.index.getStorageSync("token");
  if (token) {
    common_vendor.index.switchTab({ url: "/pages/index/index" });
  }
};
const checkPunchStatus = async (params) => {
  return await post("/index/check", params);
};
const punchIn = async (params) => {
  return await post("/index/point", params);
};
const getPunchLogs = async () => {
  return await post("/index/record");
};
exports.checkLoginAndRedirect = checkLoginAndRedirect;
exports.checkPunchStatus = checkPunchStatus;
exports.getPunchLogs = getPunchLogs;
exports.getUrlParameter = getUrlParameter;
exports.punchIn = punchIn;
