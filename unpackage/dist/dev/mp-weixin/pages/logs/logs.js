"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../utils/eventBus.js");
const utils_api = require("../../utils/api.js");
if (!Math) {
  locationItem();
}
const locationItem = () => "../../components/locationItem.js";
const _sfc_main = {
  __name: "logs",
  setup(__props) {
    const punchLogs = common_vendor.ref({ list: [] });
    const completedCount = common_vendor.ref(0);
    const pendingCount = common_vendor.ref(0);
    const updateCounts = () => {
      completedCount.value = punchLogs.value.is_point || 0;
      pendingCount.value = punchLogs.value.no_point || 0;
    };
    const fetchPunchLogs = async () => {
      try {
        const logs = await utils_api.getPunchLogs();
        console.log("获取打卡记录成功:", logs);
        punchLogs.value = logs.data;
        updateCounts();
      } catch (error) {
        console.error("获取打卡记录错误:", error);
        common_vendor.index.showToast({ title: "获取失败，请稍后重试", icon: "none" });
      }
    };
    common_vendor.onMounted(() => {
      utils_api.checkLoginAndRedirect();
    });
    common_vendor.onShow(() => {
      fetchPunchLogs();
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$1,
        b: common_vendor.t(completedCount.value),
        c: common_assets._imports_1,
        d: common_vendor.t(pendingCount.value),
        e: common_vendor.f(punchLogs.value.list, (location, index, i0) => {
          return {
            a: index,
            b: "85735d8e-0-" + i0,
            c: common_vendor.p({
              location,
              isLastItem: index === punchLogs.value.list.length - 1
            })
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-85735d8e"]]);
wx.createPage(MiniProgramPage);
