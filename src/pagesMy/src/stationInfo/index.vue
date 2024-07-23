<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getAuthInfo, getFontSize, getUserInfo } from '@/utils/local-storage'
import { getRubberStationDetail } from '@/api/pages/index'

// 根字体大小
const baseFontSize = ref<number>(1)
const stationInfo = ref<any>()
const roleFlag = ref<any>()

// 获取胶站详情
const getStationDetail = async () => {
  try {
    const res: any = await getRubberStationDetail()
    if (res.success) {
      stationInfo.value = res.data
    }
    else {
      uni.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  }
  catch (e) {
    // TODO handle the exception
  }
}
// 确认返回
const returnBack = async () => {
  uni.navigateBack()
}

onLoad(() => {
  getStationDetail()
  roleFlag.value = uni.getStorageSync('userInfo').buyerOrSeller
})
onShow(() => {
  baseFontSize.value = getFontSize()
  roleFlag.value = uni.getStorageSync('userInfo').buyerOrSeller
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="box padbg">
    <view class="info">
      <view class="info_item">
        <view>站点名称</view>
        <view>{{ stationInfo && stationInfo.name }}</view>
      </view>
      <view class="info_item">
        <view>站点类型</view>
        <view v-if="stationInfo && stationInfo.type == 1">
          国营
        </view>
        <view v-else-if="stationInfo && stationInfo.type == 2">
          私营
        </view>
        <view v-else>
          代理
        </view>
      </view>
      <view class="info_item">
        <view>站点编号</view>
        <view>{{ stationInfo && stationInfo.code }}</view>
      </view>
      <view class="info_item">
        <view>联系人</view>
        <view>{{ stationInfo && stationInfo.userName }}</view>
      </view>
      <view class="info_item">
        <view>联系电话</view>
        <view>{{ stationInfo && stationInfo.phoneNumber }}</view>
      </view>
      <view class="info_item">
        <view class="title">
          详细地址
        </view>
        <view class="tip">
          {{ stationInfo && stationInfo.detailAddress }}
        </view>
      </view>
    </view>
    <view class="sure">
      <view
        v-if="roleFlag === 1"
        class="lock chang" @click="returnBack"
      >
        确认
      </view>
      <view
        v-else class="lock" @click="returnBack"
      >
        确认
      </view>
    </view>
  </view>
</template>

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
      height: 100%;
      border-bottom: 1px solid #f5f5f5;
      .title {
        width: 30%;
      }
      .tip {
        width: 70%;
        text-align: end;
      }
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
    .chang {
      background-color: #ffa020;
    }
  }
}
</style>
