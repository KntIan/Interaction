<template>
  <view class="container">
    <view class="information_box">
      <view class="info-item" v-for="(item, index) in infoArray" :key="index" :class="{ 'last-item': index === infoArray.length - 1 }">
        <text>{{ item.label }}</text>
        <input v-model="item.value" :placeholder="item.placeholder" type="text" @input="(event) => handleInput(event, item)" :disabled="item.key === 'mobile'" />
      </view>
    </view>
    <view class="footer">
      <button @click="saveInfo">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { submitInfo } from '@/utils/api';

const infoArray = ref([
  { label: '姓名', key: 'nickname', value: '', placeholder: '请输入' },
  { label: '电话', key: 'mobile', value: '', placeholder: '请输入' },
  { label: '公司', key: 'company', value: '', placeholder: '请输入' },
  { label: '职位', key: 'position', value: '', placeholder: '请输入' },
  { label: '地址', key: 'address', value: '', placeholder: '请输入' },
]);

const handleInput = (event, item) => {
  const value = event.target.value;
  let isValid = false;

  switch (item.key) {
    case 'nickname':
      // 验证姓名：最少2个字，最多4个字，必须为汉字
      isValid = /^[\u4e00-\u9fa5]{2,4}$/.test(value);
      break;
    case 'company':
      // 验证公司：最少4个字，最多15个字，不能填写符号
      isValid = /^[\u4e00-\u9fa5]{4,15}$/.test(value);
      break;
    case 'address':
      // 验证地址：不得少于6个字，不能填写符号
      isValid = /^[\u4e00-\u9fa5]{6,}$/.test(value);
      break;
    case 'position':
      // 验证职务：不得低于2个字，不能高于5个字，不能填写符号
      isValid = /^[\u4e00-\u9fa5]{2,5}$/.test(value);
      break;
    default:
      isValid = true; // 其他情况默认为有效
  }

  // 如果不合法，则恢复输入框的值
  if (!isValid) {
    uni.showToast({
      title: '输入格式不正确',
      icon: 'error',
      mask: true
    });
    item.value = ''; // 可以选择清空输入框
  } else {
    item.value = value; // 否则正常更新值
  }
};

const saveInfo = async () => {
  try {
    // 检查所有字段是否填写完整
    const allFilled = infoArray.value.every(item => item.value.trim() !== '');
    if (!allFilled) {
      uni.showToast({
        title: '请填写所有字段',
        icon: 'error',
        mask: true
      });
      return;  // 如果未填写完整，则提前返回
    }

    // 构建请求数据
    const requestData = Object.fromEntries(
      infoArray.value.map(item => [item.key, item.value])
    );

    // 使用封装的方法提交信息
    const result = await submitInfo(requestData);
    console.log('信息已保存', result);
    uni.switchTab({ url: '/pages/index/index' });

  } catch (error) {
    console.error('提交信息时发生错误:', error.message);
    uni.showToast({
      title: '提交失败，请稍后重试',
      icon: 'error',
      mask: true
    });
  }
};

// 页面加载时获取并填充手机号码
onMounted(() => {
  uni.getStorage({
    key: 'userInfo',
    success: (res) => {
      const { mobile } = JSON.parse(res.data);
      const phoneItem = infoArray.value.find(item => item.label === '电话');
      if (phoneItem) {
        phoneItem.value = mobile || '';
      }
    },
    fail: () => {
      console.log('未找到用户信息');
    }
  });
});
</script>

<style scoped>
body {
  overflow: hidden;
}
.container {
  background: #f7f8fa;
  padding: 20px;
  height: 100vh;
}
.information_box {
  padding: 0 20px;
  background: white;
  border-radius: 20px;
}
.info-item {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 14px 0;
  color: #333333;
}
.info-item.last-item {
  border-bottom: none;
}
.info-item input {
  flex: 1;
  text-align: right;
}
.footer {
  padding: 20px 0;
  border-radius: 20px;
  margin-top: 230px;
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
</style>
