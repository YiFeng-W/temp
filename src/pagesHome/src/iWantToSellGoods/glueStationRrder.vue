<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { Decimal } from 'decimal.js'
import {
  getRubberFactoryList,
  getStatisticsByType,
  rubberStationGenOrder,
} from '@/api/pagesHome/iWantToSellGoods/index'
import { getFontSize, getUserInfo, setQRCode } from '@/utils/local-storage'
import SmtUpload from '@/components/smt-upload/index.vue'

// 根字体大小
const baseFontSize = ref<number>(1)
// 获取个人信息
const userInfo = getUserInfo()
// 选中的多选框
const checkboxValue = ref<any>([])

// 上传证明时的表单
const form = ref<any>({
  dryWater: null,
  factoryId: null,
  productImage: [],
  productName: '',
  productNumber: null,
  productTotalPrice: null,
  productUnitPrice: null,
  remark: '',
  rubberType: null,
})
// 胶厂名称
const rubberFactoryName = ref<string>()
// 剩余数量
const remainingQuantity = ref<number>(0)

// 判断是否为空
const have = (e: any) => {
  return e !== null && e !== undefined && e !== ''
}

// 计算总价
const totalPrice = computed(() => {
  if (have(form.value.productNumber) && have(form.value.productUnitPrice) && have(form.value.dryWater)) {
    const zj = new Decimal(form.value.productNumber).mul(new Decimal(form.value.productUnitPrice))
    form.value.productTotalPrice = (new Decimal(zj).mul(new Decimal(form.value.dryWater / 100))).toFixed(2)
    console.log(form.value.productTotalPrice)
    return form.value.productTotalPrice
  }
  else {
    return null
  }
})

// 显示胶厂名称
const showName = ref<boolean>(false)
// 胶厂名称列表
const nameList = ref<any>([[]])
// 取消
const cancelName = () => {
  showName.value = false
}
// 确认
const confirmName = (e: any) => {
  form.value.factoryId = e.value[0].id
  rubberFactoryName.value = e.value[0].name
  form.value.productUnitPrice = e.value[0].rubberPrice
  showName.value = false
}
// 获取胶厂
const getRubberFactory = async () => {
  try {
    const res: any = await getRubberFactoryList()
    if (res.success) {
      nameList.value[0] = res.data
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

// 橡胶类型选择器
const pickerType = ref<boolean>(false)
// 橡胶类型内容
const typeColumns = ref<any>([
  [
    {
      id: 1,
      name: '胶水',
    },
    {
      id: 2,
      name: '胶块',
    },
  ],
])
// 选中的橡胶类型
const typeIndex = ref<any>([])
// 取消
const cancelType = () => {
  pickerType.value = false
}
// 确认
const confirmType = (e: any) => {
  typeIndex.value = e.indexs
  form.value.rubberType = e.value[0].id
  pickerType.value = false
  getNumber()
  if (e.value[0].id == 2) {
    form.value.dryWater = 100
  }
  else {
    form.value.dryWater = ''
  }
}

// 获取剩余数量
const getNumber = async () => {
  try {
    const res: any = await getStatisticsByType({
      type: form.value.rubberType,
    })
    if (res.success) {
      remainingQuantity.value = res.data.remainWeight.toFixed(2)
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

// 单价开始价格
const unitPrice = ref<any>(0)
// 单价处理
const blurdj = () => {
  const maxPrice = Number(new Decimal(unitPrice.value).mul(new Decimal(1.25)))
  const minPrice = Number(new Decimal(unitPrice.value).mul(new Decimal(0.75)))
  if (form.value.productUnitPrice > maxPrice || form.value.productUnitPrice < minPrice) {
    form.value.productUnitPrice = unitPrice.value
    uni.showToast({
      title: `单价不能大于${maxPrice}或小于${minPrice}`,
      icon: 'none',
    })
  }
}

// 上传的宽高
const upStyle = ref({
  width: '140rpx',
  height: '140rpx',
})
// 货物图片集
const goodsFileList = ref<any>([])
// 货物商品图片集
const newGoodsFileList = (a: any, b: any) => {
  form.value.productImage = []
  a.forEach((e: any) => {
    form.value.productImage.push(e.url)
  })
}

// 提交时禁用按钮？
const forbidden = ref<boolean>(false)
// 提交
const submit = async () => {
  console.log('remainingQuantity.value < form.value.productNumber', remainingQuantity.value, form.value.productNumber)

  if (Number(remainingQuantity.value) < Number(form.value.productNumber)) {
    uni.showToast({
      title: '重量不能超过剩余数量',
      icon: 'none',
    })
  }
  else {
    if (checkboxValue.value[0]) {
      uni.showLoading({
        title: '订单提交中',
        mask: true,
      })
      forbidden.value = true
      form.value.productUnitPrice = Number(form.value.productUnitPrice).toFixed(2)
      const res: any = await rubberStationGenOrder({ ...form.value, productNumber: form.value.productNumber * 1000 })
      if (res.success) {
        uni.hideLoading()
        forbidden.value = false
        uni.redirectTo({
          url: '/pagesHome/src/myOrderForm/index?type=1',
        })
      }
      else {
        uni.hideLoading()
        forbidden.value = false
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
}

// 跳转协议
const goProtocol = (num: number) => {
  uni.navigateTo({
    url: `/pagesOther/src/protocol/index?id=${num}`,
  })
}

onLoad((e: any) => {
  unitPrice.value = (e.amt - 2000).toFixed(2)
  getRubberFactory()
})
onShow(() => {
  baseFontSize.value = getFontSize()
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="padbg">
    <view class="pd">
      <view class="box">
        <view class="row">
          <view class="flex-row items-center justify-between">
            <view class="tit">
              胶厂名称
            </view>
            <view class="rinput flex-row items-center justify-end" @click="showName = true">
              <text v-if="have(rubberFactoryName)">
                {{ rubberFactoryName }}
              </text>
              <text v-else class="tip">
                请选择胶厂名称
              </text>
              <up-icon name="arrow-right" color="#A0A0A0" size="32rpx" />
            </view>
          </view>
          <up-picker
            :show="showName" :columns="nameList" key-name="name"
            @cancel="cancelName" @confirm="confirmName"
          />
        </view>
        <view class="row flex-row items-center justify-between">
          <view class="tit">
            胶厂收胶价
          </view>
          <view class="rinput flex-row items-center justify-end">
            <input
              v-model="form.productUnitPrice"
              disabled
              class="tend"
              placeholder="请输入胶厂收胶价"
              placeholder-class="placeholder"
              type="digit" @blur="blurdj"
            >
            <text style="width: 120rpx;text-align: end;">
              元/公斤
            </text>
          </view>
        </view>
        <view class="row">
          <view class="flex-row items-center justify-between">
            <view class="tit">
              橡胶类型
            </view>
            <view class="rinput flex-row items-center justify-end" @click="pickerType = true">
              <text v-if="have(form.rubberType)">
                {{ form.rubberType === 1 ? '胶水' : '胶块' }}
              </text>
              <text v-else class="tip">
                请选择橡胶类型
              </text>
              <up-icon name="arrow-right" color="#A0A0A0" size="32rpx" />
            </view>
          </view>
          <up-picker
            v-model="form.rubberType" :show="pickerType" :columns="typeColumns" key-name="name"
            @cancel="cancelType" @confirm="confirmType"
          />
        </view>
        <view v-if="form.rubberType === 1" class="row flex-row items-center justify-between">
          <view class="tit">
            干含比
          </view>
          <view class="rinput flex-row items-center justify-end">
            <input
              v-model="form.dryWater" class="tend" placeholder="请输入干含比" placeholder-class="placeholder"
              type="digit"
            >
            <text style="width: 60rpx;text-align: end;">
              %
            </text>
          </view>
        </view>
        <view class="row flex-row items-center justify-between">
          <view class="tit">
            剩余数量
          </view>
          <view class="rinput justify-end">
            <text>{{ remainingQuantity }}公斤</text>
          </view>
        </view>
        <view class="row flex-row items-center justify-between">
          <view class="tit">
            重量
          </view>
          <view class="rinput flex-row items-center justify-end">
            <input
              v-model="form.productNumber" class="tend" placeholder="请输入重量" placeholder-class="placeholder"
              type="digit"
            >
            <text style="width: 60rpx;text-align: end;">
              公斤
            </text>
          </view>
        </view>
        <view class="row flex-row items-center justify-between">
          <view class="tit">
            橡胶金额
          </view>
          <view class="rinput flex-row items-center justify-end">
            <text>{{ totalPrice }}</text>
            <text style="width: 60rpx;text-align: end;">
              元
            </text>
          </view>
        </view>
        <view class="row">
          <view class="tit">
            货物照片
          </view>
        </view>
        <SmtUpload :file-list="goodsFileList" :max-count="10" :up-style="upStyle" @new-file-list="newGoodsFileList" />
      </view>
      <view class="protocol flex-row items-center justify-center">
        <up-checkbox-group v-model="checkboxValue" shape="circle">
          <up-checkbox :name="true" />
        </up-checkbox-group>
        <view>
          阅读并同意<text @click="goProtocol(3)">
            《璟橡农产品交易协议》
          </text>
        </view>
      </view>
      <view class="btn items-center justify-center" :class="forbidden ? 'forbidden' : ''" @click="submit">
        提交订单信息
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.pd {
  padding: 24rpx;

  .box {
    background-color: #fff;
    border-radius: $radius1;
    padding: 0 24rpx;

    .row {
      padding: 24rpx 0;
      border-bottom: 2rpx solid $sbgcolor7;
      font-weight: 500;
      font-size: $text2;

      .tit {
        color: $sbgcolor5;
        width: 180rpx;
      }

      .rinput {
        width: 464rpx;
        color: $sbgcolor4;

        .tend {
          text-align: end;
        }

        :deep(.u-radio__icon-wrap) {
          margin-right: 16rpx !important;
        }
      }

      .tip {
        color: $sbgcolor5 !important;
      }

      :deep(.u-radio-group, .u-radio-row) {
        justify-content: flex-end !important;
      }
    }
  }

  .protocol {
    margin: 50rpx 0;

    view {
      font-size: $text2;
      color: $sbgcolor5;

      text {
        color: $sbgcolor4;
        font-weight: bold;
      }
    }
  }

  .btn {
    background-color: $sbgcolor8;
    border-radius: $radius2;
    padding: 24rpx 0;
    line-height: $text5;
    font-weight: 500;
    font-size: $text3;
    color: #ffffff;
  }
}
</style>
