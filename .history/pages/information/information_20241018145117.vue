<template>
  <view class="container">
    <view class="information_box">
      <view class="info-item" v-for="(item, index) in infoArray" :key="index">
        <text>{{ item.label }}</text>
        <input v-model="item.value" :placeholder="item.placeholder" type="text" @input="handleInput">
      </view>
    </view>
    <view class="footer">
      <button @click="saveInfo">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const infoArray = ref([
  { label: '姓名', value: '', placeholder: '请输入' },
  { label: '电话', value: '', placeholder: '请输入' },
  { label: '公司', value: '', placeholder: '请输入' },
  { label: '职位', value: '', placeholder: '请输入' },
  { label: '地址', value: '', placeholder: '请输入' },
]);

const handleInput = (event) => {
  // 处理输入事件，如果需要特定逻辑可以在这里添加
};

const saveInfo = () => {
  try {
    // 此处可以加入保存逻辑，确保所有输入项都已填入
    const allFilled = infoArray.value.every(item => item.value.trim() !== '');
    if (!allFilled) {
      throw new Error('请填写所有字段');
    }
    // 保存信息的逻辑（例如发送请求）
    console.log('信息已保存', infoArray.value);
  } catch (error) {
    console.error(error.message);
    alert(error.message); // 简单的错误提示
  }
};
</script>

<style scoped>
body {
  overflow: hidden;
}
.container {
  background: #ccc;
  padding: 20px;
  height: 100vh;
}
.information_box {
  padding: 20px;
  background: white;
  border-radius: 20px;
}
.info-item {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.info-item input {
  flex: 1;
  text-align: right;
}
.footer {
  padding: 20px 0;
  border-radius: 20px;
  margin-top: 200px;
}
.footer button {
  width: 100%;
  height: 40px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
}
</style>
