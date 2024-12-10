<template>
  <view class="my_box" v-if="info">
    <view class="title">我的</view>
    <view class="card">
      <image class="logo" style="width: 87px; height: 12px;" src="@/static/images/Frame.png" mode="scaleToFill" />
      <view class="user-info">
        <view class="name">{{ info.nickname }}</view>
        <view class="phone">{{ info.mobile }}</view>
      </view>
    </view>
    <view class="info">
      <view class="item"><label>公司</label><text>{{ info.company }}</text></view>
      <view class="item"><label>职位</label><text>{{ info.position }}</text></view>
      <view class="item"><label>地址</label><text>{{ info.address }}</text></view>
    </view>
    <view class="info prize" @click="showPrizeModal">
      <view style="display: flex; justify-content: space-between;" class="item">
        <label>领奖记录</label>
        <text style="color: #808080;">></text>
      </view>
    </view>

    <!-- 蒙版 -->
    <view v-if="isModalVisible" class="modal-mask" @click="hidePrizeModal"></view>

    <!-- 弹窗 -->
    <view v-if="isModalVisible" class="modal">
      <button class="close-btn" @click="hidePrizeModal">✖</button> <!-- 关闭按钮 -->
      <view class="modal-content">
        <view class="modal-body" :style="{ columnCount: columnCount }">
          <view class="item_" v-for="(item) in prizeRecords" :key="item.id">
            <image class="log-image" :src="item.award_thumb" />
            <view style="padding: 10px 0;" class="product-name">{{ item.activity_title }}</view>

            <text class="footer" @click.stop="deletePrize(item.id)">删除</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getMyPage, getPrizeRecord, deletePrizeRecord } from '@/utils/api'

const info = ref(null)
const prizeRecords = ref([]) // 默认初始化为空数组
const isModalVisible = ref(false)

const columnCount = computed(() => (prizeRecords.value.length > 1 ? 2 : 1))

const fetchGetMyPage = async () => {
  try {
    const response = await getMyPage()
    info.value = response.data
  } catch (error) {
    console.error('打卡失败:', error)
  }
}

const fetchGetPrizeRecord = async () => {
  try {
    const response = await getPrizeRecord()
    prizeRecords.value = response.data || [] // 确保有数据
  } catch (error) {
    console.error('获取奖品记录失败:', error)
  }
}

const deletePrize = async (id) => {
  try {
    await deletePrizeRecord({ id: String(id) }); // 确保 ID 为字符串类型
    prizeRecords.value = prizeRecords.value.filter(item => item.id !== id); // 从列表中移除已删除的记录
    console.log('删除记录成功:', prizeRecords.value)
  } catch (error) {
    console.error('删除记录失败:', error)
  }
}

const showPrizeModal = () => {
  isModalVisible.value = true
}

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
  box-shadow: 0 0 10px rgba(78, 136, 255, 0.1);
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
  box-shadow: 0 0 10px rgba(78, 136, 255, 0.1);
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
.modal-body {
  max-height: 450px;
  overflow-y: auto;
  margin-top: 26px;
}
.item_ {
  display: inline-block;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 20px;
  transition: transform 0.3s;
}
.log-image {
  width: 135px;
  height: 135px;
  border-radius: 20px;
}

/* 新增关闭按钮样式 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.footer {
  padding: 3px 15px;
  background: linear-gradient(90deg, #005cb9 0%, #56b7e6 100%);
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}
</style>
