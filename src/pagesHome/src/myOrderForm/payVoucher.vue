<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getFontSize, getUserInfo } from '@/utils/local-storage'
import SmtUpload from '@/components/smt-upload/index.vue'
import { uploadPayImage } from '@/api/pagesHome/iWantToSellGoods/index'

// 根字体大小
const baseFontSize = ref<number>(1)
// 上传的宽高
const upStyle = ref({
  width: '140rpx',
  height: '140rpx',
})
// 订单id
const orderId = ref<string>()
// 上传文件内容
const fileList = ref<any>([])
// 接口支付凭证
const productImage = ref<any>([])
// 返回的文件内容
const newFileList = (a: any, b: any) => {
  console.log('newFileList', a, b);
  
  productImage.value = []
  a.forEach((e: any) => {
    productImage.value.push(e.url)
  })
}

const pay = async () => {
  if (productImage.value.length == 0) {
    uni.showToast({
      title: '请上传凭证',
      icon: 'none',
    })
    return
  }
  const res: any = await uploadPayImage({
    orderId: orderId.value,
    payImage: productImage.value,
    sourceType: 1,
    status: 2
  })
  if (res.success) {
    uni.navigateBack()
  } else {
    uni.showToast({
      title: res.msg,
      icon: 'none',
    })
  }
}

onLoad((e: any) => {
  baseFontSize.value = getFontSize()
  orderId.value = e.orderId
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="padbg">
    <view class="pd">
      <view class="box">
        <view class="tit">
          请上传支付凭证
        </view>
        <SmtUpload :file-list="fileList" :max-count="10" :up-style="upStyle" @new-file-list="newFileList" />
      </view>
    </view>
    <view class="btn" @click="pay">
      提交
    </view>
  </view>
</template>

<style lang="scss" scoped>
.pd {
  padding: 24rpx;

  .box {
    padding: 24rpx;
    background: #ffffff;
    border-radius: $radius2;

    .tit {
      font-size: $text2;
      color: $sbgcolor4;
      line-height: $text2;
      margin-bottom: 24rpx;
    }
  }
}

.btn {
  padding: 24rpx 0;
  width: calc(100% - 48rpx);
  text-align: center;
  background-color: #FFA020;
  margin-left: 24rpx;
  border-radius: 60rpx;
  color: #ffffff;
}
</style>
