<template>
  <div class="custom-tabbar">
    <div
      class="tab-item"
      v-for="(item, index) in tabs"
      :key="index"
      :class="{ active: currentTab === index }"
      @click="navigateTo(item.pagePath)"
    >
      <img
        :src="currentTab === index ? item.selectedIconPath : item.iconPath"
      />
      <span class="tab-text" :class="{ 'active-text': currentTab === index }">
        {{ item.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, toRefs } from "vue";
const props = defineProps({
  currentTab: {
    type: Number,
    required: true,
  },
  // tabs: {
  //   type: Array,
  //   required: true,
  // },
});
const currentTab = ref(0); // 当前选中的 tab
const tabs = ref([
  {
    pagePath: "/pages/index/index", // 直接指向 index 页面
    text: "打卡",
    iconPath: "/static/images/no_sel.png",
    selectedIconPath: "/static/images/index.png",
    color: "#909090", // 未选中颜色
    selectedColor: "linear-gradient(360deg, #E4BDE4 0%, #F384F4 100%)", // 选中渐变颜色
  },
  {
    pagePath: "/pages/logs/logs", // 直接指向 logs 页面
    text: "记录",
    iconPath: "/static/images/Frame.png",
    selectedIconPath: "/static/images/Frame9.png",
    color: "#909090",
    selectedColor: "linear-gradient(360deg, #E4BDE4 0%, #F384F4 100%)",
  },
  // 添加更多的 Tab
]);

const navigateTo = (pagePath) => {
  console.log("navigateTo", pagePath);
  currentTab.value = tabs.value.findIndex((tab) => tab.pagePath === pagePath);
  // 使用 uni.navigateTo 进行页面跳转
  uni.navigateTo({ url: pagePath });
};
</script>

<style>
.custom-tabbar {
  display: flex;
  justify-content: space-around;
  background-color: #000000; /* TabBar 背景颜色 */
  height: 83px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-weight: 500;
  font-size: 12px;
}

.tab-item {
  padding: 18px 0;
  display: grid;
  justify-items: center;
}

.tab-item img {
  width: 24px;
  height: 24px;
}

.tab-text {
  color: #909090; /* 未选中颜色 */
  text-align: center;
}

.tab-text.active-text {
  background: linear-gradient(360deg, #e4bde4 0%, #f384f4 100%);
  -webkit-background-clip: text; /* Safari 支持 */
  -webkit-text-fill-color: transparent; /* Safari 支持 */
  font-weight: bold; /* 选中项加粗 */
}
</style>
