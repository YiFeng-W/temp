<script lang="ts" setup>
import { sendCode, userLogin } from '@/api/pagesOther/login'
import { encrypt } from '@/utils/jsencrypt'
import { getFontSize, setToken, setUserInfo } from '@/utils/local-storage'
import getProveInfo from '@/hooks/proveInfo'

// 根字体大小
const baseFontSize = ref<number>(1)
// 导航栏高度
const barHeight = ref<any>(0)
uni.getSystemInfo({
  success(info) {
    barHeight.value = info.statusBarHeight
  },
})
const loginMethod = ref<boolean>(true)
const userInfo = ref<{ code: string, password: string, phoneNumber: string }>({
  code: '',
  password: '',
  phoneNumber: '',
})
const form = ref<any>()

// 验证手机号码
const correctTel = (e: string) => {
  const reg = /^(?:(?:\+|00)86)?1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[1589])\d{8}$/
  if (reg.test(e)) {
    return true
  }
  else {
    return false
  }
}

// 切换登录方式
const changeMethod = (e: boolean) => {
  if (e !== loginMethod.value) {
    loginMethod.value = e
  }
}

// 验证码
const countDown = ref<number>(60)
const tips = ref<string>('获取验证码')
const disabled = ref<boolean>(false)
const timer = ref<any>(null)

const changeTel = (e: any) => {
  disabled.value = correctTel(e)
}

const restGetCode = () => {
  clearInterval(timer.value)
  timer.value = null
  countDown.value = 60
  tips.value = '获取验证码'
  disabled.value = correctTel(userInfo.value.phoneNumber)
}

const getCode = async () => {
  if (disabled.value) {
    uni.showLoading({
      title: '正在获取验证码',
    })
    await sendCode({
      phoneNumber: userInfo.value.phoneNumber,
    }).then(() => {
      uni.hideLoading()
      uni.$u.toast('验证码已发送')
      if (timer.value)
        return
      timer.value = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value--
          tips.value = `${countDown.value}秒后重新获取`
          disabled.value = false
        }
        else {
          restGetCode()
        }
      }, 1000)
    }).catch(() => {
      uni.hideLoading()
    })
  }
}

// 显示隐藏密码
const showPass = ref<boolean>(false)
const passState = ref<string>('password')
const passImg = ref<string>('../pagesOther/static/hide.png')
const changePassState = () => {
  showPass.value = !showPass.value
  if (showPass.value) {
    passState.value = 'text'
    passImg.value = '../pagesOther/static/show.png'
  }
  else {
    passState.value = 'password'
    passImg.value = '../pagesOther/static/hide.png'
  }
}

// 登录
const login = async () => {
  if (!correctTel(userInfo.value.phoneNumber))
    return uni.$u.toast('请输入正确的手机号码')
  if (loginMethod.value && userInfo.value.code === '')
    return uni.$u.toast('请输入验证码')
  if (!loginMethod.value && userInfo.value.password === '')
    return uni.$u.toast('请输入密码')
  uni.showLoading({
    title: '登录中',
    mask: true,
  })
  const res: any = await userLogin({
    code: loginMethod.value ? userInfo.value.code : '',
    password: loginMethod.value ? '' : encrypt(userInfo.value.password),
    phoneNumber: userInfo.value.phoneNumber,
  })
  if (res.success) {
    uni.hideLoading()
    setToken(res.data.authentication)
    setUserInfo(res.data)
    getProveInfo(false)
    uni.showToast({
      title: '登录成功',
      mask: true,
    })
    uni.switchTab({
      url: '/pages/index/index',
    })
  }
  else {
    uni.hideLoading()
    uni.$u.toast(res.msg)
  }
}

// 返回上一页
const goLastPage = () => {
  uni.navigateBack({
    delta: 1,
  })
}

// 注册
const goRegister = () => {
  uni.navigateTo({
    url: '/pagesOther/src/login/login?buyerOrSeller=2&userType=3',
  })
}

onShow(() => {
  baseFontSize.value = getFontSize()
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <up-navbar title="" left-icon="close" :auto-back="true" bg-color="#2BAE85" left-icon-color="#fff" />
  <view class="box">
    <view class="flex-row justify-between hy" :style="{ marginTop: `${barHeight + 10}px` }">
      <view class="flex-col justify-center hy-text">
        <view class="text1">
          Hello！
        </view>
        <view class="text2">
          欢迎来到璟橡
        </view>
      </view>
      <view>
        <image class="logo" src="@/pagesOther/static/Bglogo.png" mode="scaleToFill" />
      </view>
    </view>
    <view class="form">
      <view class="flex-row justify-center items-center loginMethod">
        <view class="flex-col isa">
          <view class="flex-col justify-end" :class="loginMethod ? 'is-yzm' : 'not-yzm'" @click="changeMethod(true)">
            验证码登录
          </view>
        </view>
        <view class="flex-col items-center items-end isb">
          <view
            class="flex-col justify-end items-end" :class="!loginMethod ? 'is-mm' : 'not-mm'"
            @click="changeMethod(false)"
          >
            密码登录
          </view>
        </view>
      </view>
      <view class="items-center" :class="loginMethod ? 'underlinea justify-start' : 'underlineb justify-end'">
        <view />
      </view>
      <view class="list">
        <u-form ref="form" :model="userInfo">
          <div v-show="loginMethod">
            <u-form-item prop="phoneNumber">
              <view class="flex-row items-center input">
                <u-input
                  v-model="userInfo.phoneNumber" type="number" placeholder="请输入您的手机号码" border="none" class="inp"
                  @change="changeTel"
                />
              </view>
            </u-form-item>
            <u-form-item prop="code">
              <view class="flex-row items-center input">
                <u-input
                  v-model="userInfo.code" type="number" placeholder="请输入验证码" border="none" maxlength="4"
                  class="inp"
                />
                <text class="justify-center" :class="disabled ? 'codeBtna' : 'codeBtnb'" @tap="getCode">
                  {{ tips
                  }}
                </text>
              </view>
            </u-form-item>
          </div>
          <div v-show="!loginMethod">
            <u-form-item prop="phoneNumber">
              <view class="flex-row items-center input">
                <u-input v-model="userInfo.phoneNumber" type="number" placeholder="请输入您的手机号码" border="none" class="inp" />
              </view>
            </u-form-item>
            <u-form-item prop="password">
              <view class="flex-row items-center input">
                <view v-show="passState === 'password'" style="width: 100%;">
                  <u-input v-model="userInfo.password" type="password" placeholder="请再次输入密码" border="none" class="inp">
                    <template #suffix>
                      <up-icon name="eye" size="20" @click="changePassState" />
                    </template>
                  </u-input>
                </view>
                <view v-show="passState === 'text'" style="width: 100%;">
                  <u-input v-model="userInfo.password" type="text" placeholder="请再次输入密码" border="none" class="inp">
                    <template #suffix>
                      <up-icon name="eye-fill" size="20" @click="changePassState" />
                    </template>
                  </u-input>
                </view>
                <!-- <u-input :type="passState" placeholder="请输入登录密码" v-model="userInfo.password" border="none" class="inp"
                  clearable></u-input> -->
                <!-- <image :src="passImg" mode="scaleToFill" class="showHide" @click="changePassState" /> -->
              </view>
            </u-form-item>
          </div>
          <view class="justify-center items-center login" @click="login">
            登录
          </view>
        </u-form>
        <view class="other" :class="loginMethod ? '' : 'justify-between items-center'">
          <view class="zc" @click="goRegister">
            注册账号
          </view>
          <view v-show="!loginMethod" @click="goRegister">
            忘记密码？
          </view>
        </view>
        <view class="justify-center Strolling" @click="goLastPage">
          暂不注册，去逛逛
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.box {
  padding: 32rpx 24rpx;
  background-color: $sbgcolor1;
  min-height: calc(100vh - 64rpx);

  .hy {
    &-text {
      margin-left: 20rpx;
      color: #ffffff;

      .text1 {
        font-size: 72rpx;
      }

      .text2 {
        font-size: 40rpx;
      }
    }

    .logo {
      width: 320rpx;
      height: 320rpx;
    }
  }

  .form {
    border-radius: 40rpx;
    // background-color: #fff;

    .loginMethod {
      width: 100%;
      height: 83rpx;
      font-size: $text5;
      position: relative;

      .isa {
        position: absolute;
        left: 0;
        top: 0;
      }

      .isb {
        position: absolute;
        right: 0;
        top: 0;
      }

      .is-yzm {
        width: 348rpx;
        height: 74rpx;
        background-image: url('@/pagesOther/static/isyzm.png');
        background-size: 100% 100%;
        padding-left: 74rpx;
        padding-bottom: 10rpx;
        color: $sbgcolor1;
        z-index: 20;
      }

      .not-mm {
        width: 272rpx;
        height: 60rpx;
        margin-top: 14rpx;
        background-image: url('@/pagesOther/static/nomm.png');
        background-size: 100% 100%;
        padding-right: 98rpx;
        padding-bottom: 10rpx;
        color: #ffffff;
        z-index: 10;
      }

      .not-yzm {
        width: 272rpx;
        height: 60rpx;
        margin-top: 14rpx;
        background-image: url('@/pagesOther/static/noyzm.png');
        background-size: 100% 100%;
        padding-left: 98rpx;
        padding-bottom: 10rpx;
        color: #ffffff;
        z-index: 10;
      }

      .is-mm {
        width: 348rpx;
        height: 74rpx;
        background-image: url('@/pagesOther/static/ismm.png');
        background-size: 100% 100%;
        padding-right: 92rpx;
        padding-bottom: 10rpx;
        color: $sbgcolor1;
        z-index: 20;
      }
    }

    .underlinea {
      background-color: #fff;
      width: 100%;
      height: 14rpx;

      view {
        width: 40rpx;
        height: 10rpx;
        border-radius: 24rpx;
        background-color: $sbgcolor1;
        margin-left: 144rpx;
      }
    }

    .underlineb {
      background-color: #fff;
      width: 100%;
      height: 14rpx;

      view {
        width: 40rpx;
        height: 10rpx;
        border-radius: 24rpx;
        background-color: $sbgcolor1;
        margin-right: 144rpx;
      }
    }

    .list {
      background-color: #fff;
      margin-top: -1rpx;
      padding: 60rpx 56rpx;
      border-radius: 0 0 40rpx 40rpx;

      .input {
        width: 100%;
        border-bottom: 4rpx solid $sbgcolor7;
        padding: 12rpx 0;
        margin-top: 14rpx;

        .inp {
          height: 56rpx;
          font-size: $text4;
        }

        .showHide {
          width: 44rpx;
          height: 44rpx;
        }
      }

      .codeBtna {
        padding: 8rpx 16rpx;
        border: 2rpx solid $sbgcolor1;
        border-radius: 40rpx;
        font-size: $text2;
        color: $sbgcolor1;
      }

      .codeBtnb {
        padding: 8rpx 16rpx;
        border: 2rpx solid $sbgcolor5;
        border-radius: 40rpx;
        font-size: $text2;
        color: $sbgcolor5;
      }

      .login {
        width: 100%;
        height: 84rpx;
        color: #fff;
        background-color: $sbgcolor1;
        border-radius: 76rpx;
        font-size: $text5;
        margin-top: 152rpx;
      }

      .other {
        margin-top: 48rpx;
        font-size: $text2;
        font-weight: bold;

        .zc {
          color: $sbgcolor1;
        }
      }

      .Strolling {
        margin-top: 130rpx;
        font-size: $text2;
        color: $sbgcolor5;
      }
    }
  }
}
</style>
