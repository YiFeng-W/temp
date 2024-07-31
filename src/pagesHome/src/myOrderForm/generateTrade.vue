<script lang="ts" setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getFontSize, getUserInfo } from '@/utils/local-storage'
import {
  confrimStatus,
  getQrOrderDetail,
  getStationInfoByUser,
  updateUnitPrice,
  uploadPayImage,
} from '@/api/pagesHome/iWantToSellGoods/index'

// 根字体大小
const baseFontSize = ref<number>(1)
// 用户类型
const buyerOrSeller = getUserInfo().buyerOrSeller
// 用户类型内容
const userContent = ref<any>({
  backcolor: '',
})
// 用户类型内容条件判断
const userType = () => {
  if (buyerOrSeller === 3) {
    userContent.value.backcolor = 'backcolor1'
  }
  else {
    userContent.value.backcolor = 'backcolor2'
  }
}
// 参数
const parameter = ref<any>()
// 表单
const form = ref<any>({
  buyerId: 0,
  buyerName: '',
  buyerType: 0,
  createTime: '',
  createUserId: 0,
  dryWater: 0,
  id: 0,
  invoice_id: 0,
  isGlue: true,
  number: 0,
  orderRubberExtendVO: {
    checkStatus: 0,
    dryWater: 0,
    payImage: [],
    rubberType: 0,
    stationId: 0,
  },
  payStatus: 0,
  paymentNumber: '',
  paymentTime: '',
  paymentTotalAmount: 0,
  paymentType: 0,
  productListVO: [
    {
      categoryId: 0,
      categoryIndex: '',
      categoryName: '',
      productId: 0,
      productName: '',
      productNumber: 0,
      productTotalPrice: 0,
      productUnit: 0,
      productUnitPrice: 0,
    },
  ],
  productName: '',
  productTotalPrice: 0,
  qrcodeOrderVO: {
    carImage: [],
    carNumber: '',
    carRemark: '',
    categoryCode: '',
    categoryId: 0,
    categoryName: '',
    deliveryType: 0,
    dryWater: 0,
    productId: 0,
    productImage: [],
    productUnit: 0,
    productUnitPrice: 0,
    usageQuantity: 0,
  },
  remark: '',
  sellerId: 0,
  sellerName: '',
  sellerType: 0,
  serviceTotalPrice: 0,
  serviceUnitPrice: 0,
  tradeStatus: 0,
  type: 0,
  updateTime: '',
  updateUserId: 0,
})
// 获取表单
const getForm = async () => {
  try {
    const res: any = await getQrOrderDetail(parameter.value)
    if (res.success) {
      form.value = res.data
      if (res.data.sellerId) {
        getJZInfo()
      }
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

// 判断是否有值
const have = (value: any) => {
  return value !== undefined && value !== null && value !== ''
}
// 胶站信息
const jzInfo = ref<any>()
// 查胶站信息
const getJZInfo = async () => {
  try {
    const res: any = await getStationInfoByUser({
      userId: form.value.sellerId,
    })
    if (res.success) {
      jzInfo.value = res.data
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

// 协议选中状态
const xyValue = ref<boolean>(false)
// 勾选协议
const checkboxChange = (e: any) => {
  if (e[0]) {
    xyValue.value = true
  }
  else {
    xyValue.value = false
  }
}

const orderId = ref('')
const confrim = () => {
  if (xyValue.value) {
    confrimStatus({
      orderId: orderId.value,
    }).then((res: any) => {
      console.log(res)
      if (res.success) {
        getForm()
      }
    })
  }
  else {
    uni.showToast({
      title: '请勾选并同意协议',
      icon: 'none',
    })
  }
}

const confrimPayStatus = () => {
  if (xyValue.value) {
    uploadPayImage({
      orderId: orderId.value,
    }).then((res: any) => {
      console.log(res)
      if (res.success) {
        getForm()
      }
    })
  }
  else {
    uni.showToast({
      title: '请勾选并同意协议',
      icon: 'none',
    })
  }
}

const price = ref<any>()
const createOrder = async () => {
  if (!price.value) {
    uni.showToast({
      title: '请输入修改后的收胶价',
      icon: 'none',
    })
    return
  }
  if (xyValue.value) {
    const res: any = await updateUnitPrice({
      orderId: form.value.id,
      unitPrice: price.value,
    })
    if (res.success) {
      getForm()
    }
    else {
      uni.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  }
  else {
    uni.showToast({
      title: '请勾选并同意协议',
      icon: 'none',
    })
  }
}

const goPay = () => {
  uni.navigateTo({
    url: `/pagesHome/src/myOrderForm/payVoucher?orderId=${form.value.id}`,
  })
}

onShow(() => {
  baseFontSize.value = getFontSize()
  getForm()
})

onLoad((e: any) => {
  orderId.value = e.orderId
  parameter.value = {
    orderId: e.orderId,
  }
  userType()
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="padbg">
    <view class="pd">
      <view class="box">
        <view class="row flex-row justify-between items-center">
          <view>胶厂名称</view>
          <view>{{ form.buyerName }}</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>胶厂收胶价</view>
          <view>{{ form.qrcodeOrderVO.productUnitPrice }}元/公斤</view>
        </view>
        <view v-if="buyerOrSeller == 1 && form.payStatus == 0 && form.orderRubberExtendVO.checkStatus == -2" class="row flex-row justify-between items-center">
          <view>修改胶厂收胶价(元/公斤)</view>
          <input v-model="price" class="input" placeholder="请输入收胶价格">
        </view>
        <view class="row flex-row justify-between items-center">
          <view>橡胶类型</view>
          <view>{{ form.orderRubberExtendVO.rubberType === 1 ? '胶水' : '胶块' }}</view>
        </view>
        <view v-if="form.orderRubberExtendVO.rubberType === 1" class="row flex-row justify-between items-center">
          <view>干含比</view>
          <view>{{ form.dryWater }}%</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>重量</view>
          <view>{{ form.qrcodeOrderVO.usageQuantity }}公斤</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>橡胶金额</view>
          <view>{{ form.productTotalPrice }}元</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>货物照片</view>
          <view v-if="have(form.qrcodeOrderVO.productImage)" class="flex-wrap">
            <image
              v-for="(item, id) in form.qrcodeOrderVO.productImage" :key="id" :src="item" mode="aspectFill"
              style="width: 140rpx;height: 140rpx;"
            />
          </view>
        </view>
      </view>
      <view class="tit flex-row">
        <view class="header" :class="userContent.backcolor" />
        <view>胶站信息</view>
      </view>
      <view v-if="jzInfo" class="box">
        <view class="row flex-row justify-between items-center">
          <view>胶站名称</view>
          <view>{{ jzInfo.name }}</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>收胶站长</view>
          <view>{{ jzInfo.userName }}</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>联系电话</view>
          <view>{{ jzInfo.phoneNumber }}</view>
        </view>
        <view class="row flex-row justify-between items-center">
          <view>类型</view>
          <view>{{ jzInfo.type === 1 ? '国营' : jzInfo.type === 2 ? '私人' : '代理' }}</view>
        </view>
      </view>
      <view v-if="buyerOrSeller == 3 ">
        <view v-if="form.payStatus == 0 && form.orderRubberExtendVO.checkStatus == -1" class="function">
          <view class="agreement flex-row justify-center items-center">
            <up-checkbox-group v-model="xyValue" shape="circle" @change="checkboxChange">
              <up-checkbox :name="true" />
            </up-checkbox-group>
            <view>
              阅读并同意
              <text>《智京数贸通农产品交易协议》</text>
            </view>
          </view>
          <view class="btn justify-center" :class="userContent.backcolor" @click="confrim">
            确认交易
          </view>
        </view>
        <view v-if="form.payStatus == 1 && form.orderRubberExtendVO.checkStatus == 2" class="function">
          <view class="agreement flex-row justify-center items-center">
            <up-checkbox-group v-model="xyValue" shape="circle" @change="checkboxChange">
              <up-checkbox :name="true" />
            </up-checkbox-group>
            <view>
              阅读并同意
              <text>《智京数贸通农产品交易协议》</text>
            </view>
          </view>
          <view class="btn justify-center" :class="userContent.backcolor" @click="confrimPayStatus">
            确认收款
          </view>
        </view>
      </view>

      <view v-if="buyerOrSeller == 1">
        <view v-if="form.payStatus == 0 && form.orderRubberExtendVO.checkStatus == -2" class="function">
          <view class="agreement flex-row justify-center items-center">
            <up-checkbox-group v-model="xyValue" shape="circle" @change="checkboxChange">
              <up-checkbox :name="true" />
            </up-checkbox-group>
            <view>
              阅读并同意
              <text>《智京数贸通农产品交易协议》</text>
            </view>
          </view>
          <view class="btn justify-center" :class="userContent.backcolor" @click="createOrder">
            生成交易
          </view>
        </view>
        <view v-if="form.payStatus == 0 && form.orderRubberExtendVO.checkStatus == 1" class="function">
          <view class="agreement flex-row justify-center items-center">
            <up-checkbox-group v-model="xyValue" shape="circle" @change="checkboxChange">
              <up-checkbox :name="true" />
            </up-checkbox-group>
            <view>
              阅读并同意
              <text>《智京数贸通农产品交易协议》</text>
            </view>
          </view>
          <view class="btn justify-center" :class="userContent.backcolor" @click="goPay">
            确认支付
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.backcolor1 {
  background: $sbgcolor8;
}

.backcolor2 {
  background: $sbgcolor11;
}

.pd {
  padding: 24rpx;
  height: calc(100vh - $text5 - 144rpx);

  .box {
    padding: 0 24rpx;
    background-color: #fff;
    border-radius: $radius1;

    .row {
      padding: 24rpx 0;
      border-bottom: 2rpx solid $sbgcolor7;
      font-size: $text2;
      color: $sbgcolor4;
      line-height: $text2;
      .input {
        text-align: right;
      }
    }
  }

  .tit {
    padding: 24rpx 0;
    font-weight: bold;
    font-size: $text2;
    color: $sbgcolor4;
    line-height: $text2;

    .header {
      width: 8rpx;
      height: 32rpx;
      border-radius: 10rpx;
      margin-right: 24rpx;
    }
  }

  .function {
    padding: 110rpx 0 92rpx 0;

    .agreement {
      font-size: $text2;
      color: $sbgcolor5;
      line-height: $text2;

      text {
        color: $sbgcolor4;
        font-weight: bold;
      }
    }

    .btn {
      padding: 24rpx 0;
      font-size: $text3;
      color: #ffffff;
      line-height: $text3;
      border-radius: $radius2;
      margin-top: 32rpx;
    }
  }
}
</style>
