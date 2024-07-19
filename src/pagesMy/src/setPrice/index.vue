<template>
  <page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
  <view class="box padbg">
    <view class="info">
      <view class="info_item">
        <view>今日收胶价(元/公斤)</view>
        <input placeholder="请输入收胶价格" @blur="blurPrice" v-model="stationPrice" />
      </view>
      <text class="tips">收胶价范围{{ min }} ~ {{ max }}</text>
      <view class="sure">
        <view class="lock" @click="initSure">提交</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getFontSize, getUserInfo } from "@/utils/local-storage";
import { getSetPrice, getSetPriceJC } from "@/api/pages/index";
const stationId = ref<any>();
const stationPrice = ref<any>();
const roleFlag = ref<any>();
const min = ref<any>();
const max = ref<any>();
// 根字体大小
const baseFontSize = ref<number>(1);
onLoad((option: any) => {
	console.log(1,option);
  stationId.value = option.id;
	stationPrice.value = option.amt
  if (option.price) {
    const price = (Number(option.price) - 2000) / 1000
    min.value = (price * 0.75).toFixed(2)
    max.value = (price * 1.25).toFixed(2)
  }
});
onShow(() => {
  baseFontSize.value = getFontSize();
  roleFlag.value = uni.getStorageSync('userInfo').buyerOrSeller;
});
// 胶价发生改变
const blurPrice = () => {
	
}
// 设置价格
const initSure = async () => {
  if (Number(stationPrice.value) < min.value || Number(stationPrice.value) > max.value) {
    uni.showToast({
      title: '请输入范围的收胶价',
      icon: "none",
    });
    return
  }
  try {
    let res: any;
    if (roleFlag.value == 1) { // 胶厂
      res = await getSetPriceJC({
        id: stationId.value,
        rubberPrice: stationPrice.value,
      });
    } else {
      res = await getSetPrice({
        id: stationId.value,
        rubberPrice: stationPrice.value,
      });
    }
    
    if (res.success) {
      uni.showToast({
        title: "操作成功！",
        icon: "success",
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 500);
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none",
      });
    }
  } catch (e) {
    //TODO handle the exception
  }
};
</script>

<style lang="scss" scoped>
.box {
  padding: 24rpx 24rpx 0 24rpx;
  box-sizing: border-box;
  .info {
    background-color: #fff;
    border-radius: 10rpx;
    padding: 24rpx;
    box-sizing: border-box;

    .info_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24rpx 0;
      box-sizing: border-box;
      font-size: $text2;
      font-family: PingFang SC-Medium;
      color: #0d0d0d;
    }
  }
  .tips {
    font-size: 24rpx;
    color: #ccc;
  }
  .sure {
    display: flex;
    justify-content: center;
    .lock {
      width: 700rpx;
      height: 80rpx;
      background-color: #3478f7;
      color: #fff;
      border-radius: 36rpx;
      text-align: center;
      line-height: 80rpx;
      position: absolute;
      bottom: 100rpx;
    }
  }
}
</style>