"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_eventBus = require("../../utils/eventBus.js");
const utils_api = require("../../utils/api.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const isPunched = common_vendor.ref(false);
    const currentTimestamp = common_vendor.ref("");
    const buttonBackground = common_vendor.ref("url('/h5/static/images/Ellipse 1.png')");
    const buttonBackground1 = common_vendor.ref("url('/h5/static/images/Ellipse 2.png')");
    const locationText = common_vendor.ref("杭州余杭");
    const buttonStyle = common_vendor.computed(() => ({
      backgroundImage: buttonBackground.value,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }));
    let timer = null;
    function updateCurrentTimestamp() {
      currentTimestamp.value = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }
    common_vendor.onMounted(() => {
      utils_api.checkLoginAndRedirect();
      updateCurrentTimestamp();
      timer = setInterval(updateCurrentTimestamp, 1e3);
      const param = utils_api.getUrlParameter("param");
      if (param) {
        common_vendor.index.setStorage({ key: "param", data: param }).then(() => console.log("param存储成功")).catch((err) => console.error("param存储失败:", err));
      }
      utils_api.checkPunchStatus({ param: common_vendor.index.getStorageSync("param") }).then((punchStatus) => {
        console.log("获取打卡状态成功:", punchStatus);
        isPunched.value = Boolean(punchStatus.data.is_clock);
        locationText.value = punchStatus.data.point;
        if (isPunched.value) {
          buttonBackground.value = buttonBackground1.value;
        }
      }).catch((error) => {
        console.error("获取打卡状态错误:", error);
      });
    });
    common_vendor.onBeforeUnmount(() => {
      clearInterval(timer);
    });
    async function punch() {
      isPunched.value = true;
      buttonBackground.value = buttonBackground1.value;
      const punchTime = (/* @__PURE__ */ new Date()).toLocaleString();
      try {
        const param = common_vendor.index.getStorageSync("param");
        const response = await utils_api.punchIn({ param });
        if (response.code === 0) {
          common_vendor.index.showToast({ title: response.msg, icon: "error", duration: 2e3 });
        } else {
          common_vendor.index.showToast({ title: "打卡成功", icon: "success", duration: 2e3 });
          sendPunchData(punchTime);
        }
      } catch (error) {
        console.error("打卡失败:", error);
        common_vendor.index.showToast({
          title: error.message || "打卡失败，请重试。",
          icon: "error",
          duration: 2e3
        });
      }
    }
    function sendPunchData(punchTime) {
      try {
        utils_eventBus.eventBus.emit("punchData", { isPunched: true, time: punchTime });
        console.log("发送打卡数据:", { isPunched: true, punchTime });
      } catch (error) {
        console.error("发送打卡数据失败:", error);
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.t(locationText.value),
        c: common_vendor.t(isPunched.value ? "已打卡" : "打卡"),
        d: common_vendor.t(currentTimestamp.value),
        e: common_vendor.o(punch),
        f: common_vendor.s(buttonStyle.value),
        g: isPunched.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
