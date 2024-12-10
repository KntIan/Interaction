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
      <view style="display: flex; justify-content: space-between;" class="item">
        <label>领奖记录</label>
        <text style="text-align: right;">></text>
      </view>
    </view>

    <!-- 蒙版 -->
    <view v-if="isModalVisible" class="modal-mask" @click="hidePrizeModal"></view>

    <!-- 弹窗 -->
    <view v-if="isModalVisible" class="modal">
      <view class="modal-content">
        <view class="modal-body">
          <view class="item_" v-for="(item) in prizeRecords" :key="item.value">
            <image class="log-image" :src="item.award_thumb" />
            <view style="padding: 10px 0;" class="product-name">{{ item.activity_title }}</view>
            <view style="padding-bottom: 10px;" class="award_title">
              <text class="text_">删除</text>
            </view>
            <view></view>
          </view>
        </view>
        <view class="footer">
          <button @click="deletePrize(item.id)">关闭</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyPage, getPrizeRecord, deletePrizeRecord } from '@/utils/api'

const info = ref(null)
const prizeRecords = ref(null) // 添加用于存放奖品记录的变量
const isModalVisible = ref(false) // 控制弹窗显示的变量

const fetchGetMyPage = async () => {
  try {
    const response = await getMyPage()
    info.value = response.data
  } catch (error) {
    console.error('打卡失败:', error)
    // 根据业务需要可以在这里增加用户友好的错误提示
  }
}

const fetchGetPrizeRecord = async () => {
  try {
    const response = await getPrizeRecord()
    console.log('获取奖品记录成功:', response)
    prizeRecords.value = response.data // 将获取的奖品记录赋值给 prizeRecords
    console.log('获取奖品记录成功:', prizeRecords.value)
  } catch (error) {
    console.error('获取奖品记录失败:', error)
    // 可以增加用户友好的错误提示
  }
}
const deletePrize = async (id) => {
  try {
    await deletePrizeRecord(id); // 调用后端接口删除奖品记录
    prizeRecords.value = prizeRecords.value.filter(item => item.id !== id); // 从列表中移除已删除的记录
    console.log('删除记录成功:', prizeRecords.value);
  } catch (error) {
    console.error('删除记录失败:', error);
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
.my_box {
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
.card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  padding: 20px;
  border-radius: 15px;
  margin: 15px;
  gap: 54px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(78, 136, 255, 0.1);
}

.logo {
  grid-column: 2;
}

.user-info {
  grid-column: 1;
}
.name {
  font-weight: 600;
  color: #333333;
  text-align: left;
}

.phone {
  color: #333333;

  text-align: left;
}
.info {
  display: grid;
  padding: 0 20px;
  border-radius: 15px;
  margin: 15px;
  text-align: left;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(78, 136, 255, 0.1);
}
.item {
  width: 100%;
  border-bottom: 1px solid #f7f8fa;
  line-height: 51px;
}
.item label {
  padding-right: 15px;
  color: #808080;
}
.item text {
  color: #333333;
}
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 20;
  width: 80%;
}

.modal-header {
  font-weight: bold;
  margin-bottom: 10px;
}

.modal-body {
  max-height: 450px;
  overflow-y: auto;
  gap: 10px;
  margin-top: 26px;
  column-count: 2; /* 设置列数为2，形成瀑布流布局 */
  column-gap: 10px; /* 列之间的间距 */
}
.item_ {
  display: inline-block; /* 使用 inline-block 使得瀑布流效果更流畅 */
  break-inside: avoid; /* 防止在列内断裂 */
  width: 100%; /* 宽度设置为100%以适应不同列 */
  margin-bottom: 10px;
  border-radius: 20px;
  transition: transform 0.3s;
  box-shadow: 0 0 20px rgba(0, 92, 185, 0.1);
  background: #fff;
}
.log-image {
  width: 135px;
  height: 135px;
  border-radius: 20px;
}
.footer {
  padding: 20px 0;
  border-radius: 20px;
}
.footer button {
  width: 100%;
  height: 44px;
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}
.text_ {
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
  box-shadow: 0px 8px 10px 0px rgba(2, 118, 255, 0.2);
  color: white;
  padding: 2px 10px;
}
</style>
