"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/api.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const showToast = (title, icon = "none") => {
      common_vendor.index.showToast({ title, icon });
    };
    const weChatLogin = async () => {
      common_vendor.index.showLoading({ title: "登录中..." });
      try {
        const loginResult = await common_vendor.index.login();
        console.log(loginResult);
      } catch (error) {
        showToast("登录失败，请重试", "error");
        console.error("登录错误:", error);
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(weChatLogin)
      };
    };
  }
};
wx.createPage(_sfc_main);
