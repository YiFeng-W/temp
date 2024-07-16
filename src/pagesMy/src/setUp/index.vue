<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getAuthInfo,
  getFontSize,
  getToken,
  getUserInfo,
  removeAuthInfo,
  removeToken,
  removeUserInfo,
} from '@/utils/local-storage'

// 根字体大小
const baseFontSize = ref<number>(1)

// 不用用户页面
const userContent = ref<any>({
  btn: '',
  tcbtna: '',
  tcbtnb: '',
})
const getUserType = () => {
  if (getUserInfo().buyerOrSeller === 1) {
    userContent.value.btn = 'btn1'
    userContent.value.tcbtna = 'tcbtna1'
    userContent.value.tcbtnb = 'tcbtna2'
  }
  else {
    userContent.value.btn = 'btn2'
    userContent.value.tcbtna = 'tcbtnb1'
    userContent.value.tcbtnb = 'tcbtnb2'
  }
}

// 判断是否有值
const have = (value: any) => {
  return value !== undefined && value !== null && value !== ''
}

// 修改密码
const goxgmm = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url: '/pagesMy/src/changePassword/index',
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 跳转商户信息
const goStore = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url: '/pagesMy/src/stationInfo/index',
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}

// 显示弹窗
const show = ref<boolean>(false)
// 退出登录
const loginOut = () => {
  removeToken()
  removeUserInfo()
  removeAuthInfo()
  show.value = false
  uni.reLaunch({
    url: '/pages/index/index',
  })
}

onLoad(() => {
  baseFontSize.value = getFontSize()
  getUserType()
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="padbg">
    <view class="pd">
      <view class="box">
        <view class="row flex-row justify-between items-center" @click="goStore">
          <view>胶站信息</view>
          <up-icon name="arrow-right" color="#A0A0A0" size="36rpx" />
        </view>
        <view class="row flex-row justify-between items-center" @click="goxgmm">
          <view>修改密码</view>
          <up-icon name="arrow-right" color="#A0A0A0" size="36rpx" />
        </view>
      </view>
      <view v-show="have(getToken())" class="justify-center items-center" :class="userContent.btn" @click="show = true">
        退出登录
      </view>
    </view>
    <up-popup :show="show" mode="center" bg-color="transparent">
      <view class="flex-col items-center popup">
        <view>确定退出当前登录账号吗？</view>
        <view class="flex-row justify-around tcbtn">
          <view class="justify-center items-center" :class="userContent.tcbtna" @click="show = false">
            暂不退出
          </view>
          <view class="justify-center items-center" :class="userContent.tcbtna" @click="loginOut">
            确定
          </view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<style lang="scss" scoped>
.pd {
  padding: 24rpx;

  .box {
    padding: 0 24rpx;
    background: #ffffff;
    border-radius: $radius1;

    .row {
      padding: 24rpx 0;
      border-bottom: 2rpx solid $sbgcolor7;
      font-size: $text2;
      color: $sbgcolor4;
      line-height: $text2;
    }
  }

  .btn1 {
    background-color: $sbgcolor11;
    padding: 24rpx 0;
    margin: 60rpx 0;
    border-radius: $radius2;
    font-size: $text3;
    color: #ffffff;
    line-height: $text3;
  }

  .btn2 {
    background-color: $sbgcolor8;
    padding: 24rpx 0;
    margin: 60rpx 0;
    border-radius: $radius2;
    font-size: $text3;
    color: #ffffff;
    line-height: $text3;
  }
}

.popup {
  padding: 60rpx 52rpx;
  margin: 0 72rpx;
  background-color: #fff;
  width: 502rpx;
  border-radius: 16rpx;

  .tcbtn {
    margin-top: 48rpx;
    width: 100%;
  }

  .tcbtna1 {
    width: 224rpx;
    height: 72rpx;
    border-radius: 36rpx;
    border: 2rpx solid $sbgcolor11;
    font-weight: 500;
    font-size: $text4;
    color: $sbgcolor11;
  }

  .tcbtna2 {
    width: 224rpx;
    height: 72rpx;
    border-radius: 36rpx;
    background-color: $sbgcolor11;
    font-weight: 500;
    font-size: $text4;
    color: #fff;
  }

  .tcbtnb1 {
    width: 224rpx;
    height: 72rpx;
    border-radius: 36rpx;
    border: 2rpx solid $sbgcolor8;
    font-weight: 500;
    font-size: $text4;
    color: $sbgcolor8;
  }

  .tcbtnb2 {
    width: 224rpx;
    height: 72rpx;
    border-radius: 36rpx;
    background-color: $sbgcolor8;
    font-weight: 500;
    font-size: $text4;
    color: #fff;
  }
}
</style>
