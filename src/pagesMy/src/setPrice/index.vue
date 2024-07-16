<template>
  <page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
  <view class="box padbg">
    <view class="info">
      <view class="info_item">
        <view>今日收胶价(元/公斤)</view>
        <input placeholder="请输入收胶价格" @blur="blurPrice" v-model="stationPrice" />
      </view>
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
import { getSetPrice } from "@/api/pages/index";
const stationId = ref<any>();
const stationPrice = ref<any>();
// 根字体大小
const baseFontSize = ref<number>(1);
onLoad((option: any) => {
	console.log(1,option);
  stationId.value = option.id;
	stationPrice.value = option.amt
});
onShow(() => {
  baseFontSize.value = getFontSize();
});
// 胶价发生改变
const blurPrice = () => {
	
}
// 设置价格
const initSure = async () => {
  try {
    const res: any = await getSetPrice({
      id: stationId.value,
      rubberPrice: stationPrice.value,
    });
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