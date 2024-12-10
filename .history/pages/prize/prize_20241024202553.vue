<template>
  <view class="my_box" v-if="info">
    <view class="title">我的</view>
    <view class="card">
      <image class="logo" style="width: 87px;height: 12px;" src="@/static/images/Frame.png" mode="scaleToFill" />
      <view class="user-info">
        <view class="name">{{info.nickname}}</view>
        <view class="phone">{{info.mobile}}</view>
      </view>
    </view>
    <view class="info">
      <view class="item"><label>公司</label><text>{{info.company}}</text></view>
      <view class="item"><label>职位</label><text>{{info.position}}</text></view>
      <view class="item"><label>地址</label><text>{{info.address}}</text></view>
    </view>
    <view class="info prize" @click="showPrizeModal">
      <view class="item"><label>活动标题</label><text>{{prizeRecords?.activity_title}}</text></view>
      <view class="item"><label>奖项</label><text>{{prizeRecords?.award_title}}</text></view>
      <view class="item"><label>地址</label><text>{{info.address}}</text></view>
    </view>

    <!-- 蒙版 -->
    <view v-if="isModalVisible" class="modal-mask" @click="hidePrizeModal"></view>

    <!-- 弹窗 -->
    <view v-if="isModalVisible" class="modal">
      <view class="modal-content">
        <view class="modal-header">奖品详情</view>
        <view class="modal-body">
          <view v-for="(prize, index) in prizeRecords" :key="prize.id" class="prize-item">
            <view><label>活动标题:</label><text>{{prize.activity_title}}</text></view>
            <view><label>奖项:</label><text>{{prize.award_title}}</text></view>
            <button @click="deletePrize(prize.id)">删除</button> <!-- 删除按钮 -->
          </view>
        </view>
        <button @click="hidePrizeModal">关闭</button>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getMyPage, getPrizeRecord, deletePrizeRecord } from '@/utils/api'

const info = ref(null)
const prizeRecords = ref([]) // 初始化为数组
const isModalVisible = ref(false) // 控制弹窗显示的变量

const fetchGetMyPage = async () => {
  try {
    const response = await getMyPage()
    info.value = response.data
  } catch (error) {
    console.error('获取个人信息失败:', error)
    // 可以增加用户友好的错误提示
  }
}

const fetchGetPrizeRecord = async () => {
  try {
    const response = await getPrizeRecord()
    console.log('获取奖品记录成功:', response)
    prizeRecords.value = response.data // 将获取的奖品记录赋值给 prizeRecords
  } catch (error) {
    console.error('获取奖品记录失败:', error)
    // 可以增加用户友好的错误提示
  }
}

// 删除奖项
const deletePrize = async (id) => {
  try {
    await deletePrizeRecord(id) // 调用删除接口
    prizeRecords.value = prizeRecords.value.filter(prize => prize.id !== id); // 从本地数据中移除
    console.log(`删除奖项成功，ID：${id}`);
  } catch (error) {
    console.error('删除奖项失败:', error)
    // 可以增加用户友好的错误提示
  }
}

// 显示弹窗
const showPrizeModal = () => {
  isModalVisible.value = true
}

// 隐藏弹窗
const hidePrizeModal = () => {
  isModalVisible.value = false
}

onMounted(() => {
  fetchGetMyPage()
  fetchGetPrizeRecord()
})
</script>

<style scoped>
body {
  overflow: hidden;
}
.prize_box {
  background: #f7f8fa;
  height: 100vh;
  text-align: center;
}
.title {
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 44px;
}
.prize_content {
  padding: 44px;
  background: #ffffff;
  display: grid;
  justify-items: center;
  margin: 15px;
  border-radius: 15px;
  padding-bottom: 27px;
}
.address {
  background: linear-gradient(0deg, #005cb9 0%, #56b7e6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
