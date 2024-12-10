<template>
  <view class="container">
    <view class="summary">
      <view class="summary-item completed">
        <image
          src="/static/images/Frame65.png"
          style="width: 24px; height: 24px"
        />
        <text> 已打卡{{ completedCount }}个</text>
      </view>
      <view class="summary-item pending" style="color: white">
        <image
          src="/static/images/Frame56.png"
          style="width: 24px; height: 24px"
        />
        <text> 未打卡{{ pendingCount }}个</text>
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
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { onShow } from "@dcloudio/uni-app";
import eventBus from "@/utils/eventBus";
import locationItem from "@/components/locationItem.vue";
import { getPunchLogs } from "@/utils/api";

const punchLogs = ref({ list: [] });
const completedCount = ref(0);
const pendingCount = ref(0);

// 更新打卡统计
const updateCounts = () => {
  console.log(punchLogs);
  completedCount.value = punchLogs.value;
  pendingCount.value = punchLogs.value.list.length - completedCount.value;
};

// 检查是否已登录
const isLoggedIn = () => {
  const token = uni.getStorageSync("token");
  return !!token;
};

// 请求打卡记录
const fetchPunchLogs = async () => {
  if (!isLoggedIn()) {
    console.error("用户未登录");
    uni.navigateTo({ url: "/pages/login/login" });
    return;
  }

  try {
    const logs = await getPunchLogs();
    punchLogs.value = logs;
    updateCounts();
  } catch (error) {
    console.error("获取打卡记录错误:", error);
    uni.showToast({ title: "获取失败，请稍后重试", icon: "none" }); // 错误提示
  }
};

onMounted(() => {
  onShow(() => {
    fetchPunchLogs();
  });
});

onBeforeUnmount(() => {
  eventBus.off("punchData", receivePunchData);
});
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: auto;
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
