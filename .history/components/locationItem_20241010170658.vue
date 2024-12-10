<template>
  <view class="location-item">
    <view class="location-name-box">
      <image
        src="/static/images/Ellipse 3.png"
        style="width: 10px; height: 10px"
      />
      <text class="location-name">{{ location.title || "未知位置" }}</text>
    </view>
    <view class="status_box">
      <image
        :style="{ opacity: isLastItem ? 0 : 1 }"
        src="/static/images/Vector 2.png"
        style="width: 2px; height: 68px; padding-left: 4px"
      />
      <view
        class="status"
        :class="{ completed: location.is_clock, pending: !location.is_clock }"
      >
        <text>{{ location.is_clock ? "已打卡" : "未打卡" }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
// 定义接收的属性
const props = defineProps({
  location: {
    type: Object,
    required: true,
    validator: (value) => {
      // 增加简单的验证机制
      return (
        value &&
        typeof value.name === "string" &&
        typeof value.is_clock === "boolean"
      );
    },
  },
  isLastItem: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.location-name-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status_box {
  display: grid;
  grid-template-columns: 1fr 95%;
  align-items: start;
}

.completed {
  color: #ffffff;
}

.pending {
  color: #333333;
}

.location-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.status {
  padding: 8px;
  border-radius: 4px;
  margin-top: 5px;
}

.status.completed {
  background: linear-gradient(90deg, #e4bde4 0%, #f384f4 100%);
}

.status.pending {
  background: linear-gradient(90deg, #e9e9e9 0%, #c8c8c8 100%);
}
</style>
