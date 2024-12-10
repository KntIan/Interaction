<template>
  <view class="container">
    <view class="summary">
      <view class="summary-item completed">
        <image
          src="/static/images/Frame65.png"
          style="width: 24px; height: 24px"
        />
        <text> 已打卡{{ punchLogs.is_point }}个</text>
      </view>
      <view class="summary-item pending" style="color: white">
        <image
          src="/static/images/Frame56.png"
          style="width: 24px; height: 24px"
        />
        <text> 未打卡{{ punchLogs.no_point }}个</text>
      </view>
    </view>

    <view class="locations">
      <location-item
        v-for="(location, index) in punchLogs.list"
        :key="index"
        :location="location"
        :isLastItem="index === punchLogs.list.length - 1"
      />
      <view class="footer">
        <text>
          打卡15个点即可以位于餐厅西侧， 4号楼四四六楼梯口前的摩羯领取奖品
        </text>
      </view>
    </view>

    <!-- <tabBar /> -->
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeRouteEnter } from "vue";
import eventBus from "@/utils/eventBus";
import locationItem from "@/components/locationItem.vue"; // 调整路径
import { getPunchLogs } from "@/utils/api"; // 导入API请求函数

const punchLogs = ref([]);
const completedCount = ref(0);
const pendingCount = ref(0);

// 更新打卡统计
const updateCounts = () => {
  completedCount.value = punchLogs.value.list.filter(
    (log) => log.isPunched
  ).length;
  pendingCount.value = punchLogs.value.list.length - completedCount.value;
};

// 检查是否已登录
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // 如果token存在，表示已登录
};
const fetchPunchLogs = async () => {
  if (!isLoggedIn()) {
    console.error("用户未登录");
    router.push({ url: "/pages/login/login" });
    return; // 如果未登录，则不进行任何请求
  }

  try {
    const logs = await getPunchLogs(); // 请求打卡记录
    console.log(logs);
    punchLogs.value = logs; // 更新记录到状态
    console.log(punchLogs.value);
    updateCounts(); // 更新统计
  } catch (error) {
    console.error("获取打卡记录错误:", error);
    // 处理错误，例如：显示提示给用户
  }
};
onMounted(fetchPunchLogs); // 组件挂载时请求打卡记录
// 在组件挂载时请求打卡记录
// onMounted(async () => {
//   if (!isLoggedIn()) {
//     console.error("用户未登录");
//     uni.navigateTo({ url: "/pages/login/login" });
//     return; // 如果未登录，则不进行任何请求
//   }

//   try {
//     const logs = await getPunchLogs(); // 请求打卡记录
//     console.log(logs);
//     punchLogs.value = logs; // 更新记录到状态
//     console.log(punchLogs.value);
//     updateCounts(); // 更新统计
//   } catch (error) {
//     console.error("获取打卡记录错误:", error);
//     // 处理错误，例如：显示提示给用户
//   }
// });
// 使用路由守卫在每次进入页面时请求数据
// onBeforeRouteEnter((to, from, next) => {
//   fetchPunchLogs();
//   next();
// });
// 监听事件
onBeforeUnmount(() => {
  eventBus.off("punchData", receivePunchData);
});
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: auto; /* 允许滚动 */
  background-color: #1a1a1a;
  padding: 15px;
  color: #fff;
  background: url("@/static/images/Frame 2220.png") no-repeat center center;
  background-size: cover;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;
  margin-bottom: 16px;
}

.summary-item {
  height: 69px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.locations {
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px 0px rgba(78, 136, 255, 0.1);
  border-radius: 15px;
  padding: 27px 19px;
  margin-bottom: 20px;
}

.footer {
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  margin: 0 auto;
  padding: 0 40px;
  background: linear-gradient(359.9999994558474deg, #e4bde4 0%, #f384f4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40px;
  margin-top: 50px;
}
</style>
