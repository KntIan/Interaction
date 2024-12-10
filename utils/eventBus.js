// eventBus.js
import { reactive, watch } from "vue";

const eventBus = reactive({});

export default {
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

    // 监听事件，数据变化时调用 callback
    watch(
      () => eventBus[event],
      (newData) => {
        if (newData !== undefined) {
          callback(newData);
        }
      },
      { immediate: true }
    );
  },
};
