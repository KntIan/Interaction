<template>
  <view>
    <uni-popup ref="tipPopup" type="center" :is-mask-click="true">
      <view class="pop">
        <view class="title">
          温馨提示
        </view>
        <!-- 提示icon -->
        <view class="tip-img">
          <image src="../../static/image/tip/tip-icon.png" mode=""></image>
        </view>
        <view class="tip-info">
          {{title}}
        </view>
        <view class="sure" @click="sure">
          确定
        </view>
      </view>
    </uni-popup>
  </view>
</template>
 
<script>
  export default {
    name:"showTip",
    props:["title"],
    data() {
      return {
        
      };
    },
    methods: {
      open() {
        this.$refs.tipPopup.open()
      },
      sure() {
        this.$refs.tipPopup.close()
      }
    }
  }
</script>
 
<style scoped>
.pop {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    border-radius: 16rpx;
    height: 576rpx;
    z-index: 99;
    width: 640rpx;
    padding: 30rpx 0;
  }
  .title {
    text-align: center;
    font-size: 34rpx;
    font-weight: 500;
    margin-top: 38rpx;
  }
  .tip-img {
    margin: 0 auto;
    width: 296rpx;
    height: 204rpx;
    margin-top: 64rpx;
  }
  .tip-img image {
    width: 100%;
    height: 100%;
  }
  .tip-info {
    padding: 0 30rpx;
    font-size: 34rpx;
    color: #666;
    margin-top: 32rpx;
    margin-bottom: 64rpx;
    text-align: center;
  }
  .sure {
    width: 100%;
    border-top: 1rpx solid #d1d1d1;
    height: 112rpx;
    text-align: center;
    line-height: 112rpx;
    color: #02A53C;
    font-size: 34rpx;
    font-weight: 500;
  }
</style>