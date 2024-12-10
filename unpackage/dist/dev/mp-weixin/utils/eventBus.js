"use strict";
const common_vendor = require("../common/vendor.js");
const eventBus = common_vendor.reactive({});
const eventBus$1 = {
  emit(event, data) {
    if (!event) {
      console.error("事件名称不能为空");
      return;
    }
    eventBus[event] = data;
  },
  on(event, callback) {
    if (!event || typeof callback !== "function") {
      console.error("事件名称不能为空且回调必须为函数");
      return;
    }
    common_vendor.watch(
      () => eventBus[event],
      (newData) => {
        if (newData !== void 0) {
          callback(newData);
        }
      },
      { immediate: true }
    );
  }
};
exports.eventBus = eventBus$1;
