"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
const _sfc_main = {
  __name: "locationItem",
  props: {
    location: {
      type: Object,
      required: true
    },
    isLastItem: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$2,
        b: common_vendor.t(__props.location.title || "未知位置"),
        c: __props.isLastItem ? 0 : 1,
        d: common_assets._imports_1$1,
        e: common_vendor.t(__props.location.is_clock ? "已打卡" : "未打卡"),
        f: __props.location.is_clock ? 1 : "",
        g: !__props.location.is_clock ? 1 : ""
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ad7cf5a6"]]);
wx.createComponent(Component);
