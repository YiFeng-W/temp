<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { cancelQrOrder, getOrderQrcode, getQrOrderList } from '@/api/pagesMy/myOrderForm'
import { getFontSize, getUserInfo, setQRCode } from '@/utils/local-storage'
import voidPrompt from '@/components/void-prompt/index.vue'
// 根字体大小
const baseFontSize = ref<number>(1)
// 用户类型
const userType = getUserInfo().buyerOrSeller
// 订单类型
const orderType = ref<any>()
// 关键字
const keyWord = ref<string>()
// tab列表
const tabList = ref<any>([])
// 用户使用内容
const userContent = ref<any>({
  screen: '',
  themeColor: '',
  smbtn: '',
  czBtn: '',
  qdBtn: '',
})
const placeholder = ref<string>('')

// 订单表单
const form = ref<any>([])
// 判断用户使用内容
const judgeUser = () => {
  if (userType === 2) {
    userContent.value.screen = '../../../static/image/screen1.png'
    userContent.value.themeColor = '#2BAE85'
    userContent.value.smbtn = 'smbtn1'
    userContent.value.czBtn = 'btna1'
    userContent.value.qdBtn = 'btna2'
    tabList.value = [{ name: '全部', value: '' }, { name: '待支付', value: 1 }, { name: '待收款', value: 2 }, { name: '已取消', value: 4 }]
  }
  else if (userType === 3) {
    userContent.value.screen = '../../../static/image/screen2.png'
    userContent.value.themeColor = '#3578f7'
    userContent.value.smbtn = 'smbtn2'
    userContent.value.czBtn = 'btnb1'
    userContent.value.qdBtn = 'btnb2'
    if (orderType.value === '1') {
      tabList.value = [{ name: '全部', value: '' }, { name: '待确认', value: -1 }, { name: '待收款', value: 2 }, { name: '已取消', value: 4 }]
    }
    else {
      tabList.value = [{ name: '全部', value: '' }, { name: '待付款', value: 1 }, { name: '已支付', value: 2 }, { name: '已取消', value: 4 }]
    }
    uni.setNavigationBarTitle({
      title: orderType.value === '1' ? '售胶订单' : '收胶订单',
    })
  }
  else if (userType === 1) {
    userContent.value.screen = '../../../static/image/screen3.png'
    userContent.value.themeColor = '#FFA020'
    userContent.value.smbtn = 'smbtn3'
    userContent.value.czBtn = 'btnc1'
    userContent.value.qdBtn = 'btnc2'
    tabList.value = [{ name: '全部', value: '' }, { name: '待交易', value: -2 }, { name: '待支付', value: 1 }, { name: '已取消', value: 4 }]
    uni.setNavigationBarTitle({
      title: orderType.value === '1' ? '售胶订单' : '收胶订单',
    })
  }
}

// 判断是否有值
const have = (value: any) => {
  return value !== undefined && value !== null && value !== ''
}

// 返回对应订单状态
const retType = (xj: any) => {
  if (xj === 1) {
    if (userType.value === 3) {
      return '待胶厂支付'
    }
    else {
      return tabList.value[1].name
    }
  }
  else if (xj === 2) {
    return tabList.value[2].name
  }
  else if (xj === 3) {
    return '已完成'
  }
  else if (xj === -1) {
    return '待确认'
  }
  else if (xj === -2) {
    return '待交易'
  }
  else {
    return '已取消'
  }
}
// 返回对应订单颜色
const retColor = (xj: any) => {
  if (xj === 1) {
    return '#F04E51'
  }
  else if (xj === 2) {
    return '#F88D02'
  }
  else if (xj === 3) {
    return '#2BAE85'
  }
  else if (xj === -1) {
    return '#F04E51'
  }
  else if (xj === -2) {
    return '#F04E51'
  }
  else {
    return '#A0A0A0'
  }
}
// tab选中项
const tabIndex = ref<number | null>(null)
// 订单类型
const type = ref<number>(1)
// 订单类型
const page = ref<number>(1)
// 订单类型
const pageSize = ref<number>(10)
// 订单类型
const totalPage = ref<number>(0)
// 加载状态
const moreStatus = ref<string>('more')
// 加载状态显示
const showMore = ref<boolean>(false)
// 获取订单列表
const getOrderList = async () => {
  const data = {
    page: page.value,
    pageSize: pageSize.value,
    isGlue: 1,
    tradeStatus: tabIndex.value,
    buyerOrSeller: orderType.value === '1' ? 2 : 1,
    type: type.value,
    startDate: startDate.value,
    endDate: endDate.value,
    keywords: keyWord.value,
  }
  try {
    const res: any = await getQrOrderList(data)
    if (res.success) {
      totalPage.value = Math.ceil(res.data.total / pageSize.value)
      res.data.records.forEach((item: any) => {
        form.value.push(item)
      })
    }
    else {
      uni.showToast({
        title: res.msg,
        icon: 'none',
      })
      page.value--
    }
    if (totalPage.value === page.value) {
      moreStatus.value = 'noMore'
      showMore.value = true
    }
    else {
      moreStatus.value = 'more'
      showMore.value = false
    }
  }
  catch (e) {
    page.value--
    moreStatus.value = 'more'
    showMore.value = false
  }
}
const enterSearchitect = () => {
  form.value = []
  page.value = 1
  getOrderList()
}
// tab改变时
const changeTab = (e: any) => {
  if (e.index === 1) {
    tabIndex.value = 1
  }
  else if (e.index === 2) {
    tabIndex.value = 2
  }
  else if (e.index === 3) {
    tabIndex.value = 4
  }
  else {
    tabIndex.value = null
  }
  if (userType == 1) {
    tabIndex.value = e.value
  }
  // tabIndex.value = e.value
  form.value = []
  page.value = 1
  getOrderList()
}

// 页面触底触发
const scrolltolower = (e: any) => {
  if (totalPage.value <= page.value) {
    moreStatus.value = 'noMore'
    showMore.value = true
  }
  else {
    page.value++
    moreStatus.value = 'loading'
    showMore.value = true
    getOrderList()
  }
}

// 取消订单
const cancelOrder = async (id: number | string) => {
  try {
    const res: any = await cancelQrOrder({ id })
    if (res.success) {
      uni.showToast({
        title: '取消订单成功',
      })
      form.value = []
      getOrderList()
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

// 查看订单二维码
const goQRCode = async (item: any) => {
  try {
    const res: any = await getOrderQrcode({
      orderNumber: item.number,
    })
    if (res.success) {
      setQRCode(res.data)
      uni.navigateTo({
        url: `/pagesHome/src/iWantToSellGoods/displayQRCode?id=${item.id}&amt=${item.productTotalPrice}`,
      })
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

// 筛选弹窗
const showPopup = ref<boolean>(false)
// 关闭弹窗
const closePopup = () => {
  showPopup.value = false
}

// 按月选择
const isMonthly = ref<any>()
// 月选择列表
const monthlyList = ref<any>([
  {
    code: 0,
    name: '1个月内',
  },
  {
    code: 1,
    name: '3个月内',
  },
  {
    code: 2,
    name: '6个月内',
  },
])
// 按月选择
const quickChooseParams = ref<any>()
const quickChooseOptions = ref<any>([
  {
    code: 'today',
    name: '当日',
  },
  {
    code: 'yesterday',
    name: '昨日',
  },
  {
    code: 'week',
    name: '本周',
  },
  {
    code: 'lastWeek',
    name: '上周',
  },
  {
    code: 'month',
    name: '本月',
  },
  {
    code: 'year',
    name: '今年',
  },
],
)

const changeQuickParams = (id: any) => {
  // 根据传入值，设置开始时间和结束时间
  if (id === 'today') {
    startDate.value = dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 'yesterday') {
    startDate.value = dayjs(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 'week') {
    startDate.value = dayjs(new Date(new Date().getTime() - (new Date().getDay() - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date(new Date().getTime() + (7 - new Date().getDay()) * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 'lastWeek') {
    startDate.value = dayjs(new Date(new Date().getTime() - (new Date().getDay() + 6) * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date(new Date().getTime() - (new Date().getDay()) * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 'month') {
    startDate.value = dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 'year') {
    startDate.value = dayjs(new Date(new Date().getFullYear(), 0, 1).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date(new Date().getFullYear(), 11, 31).toLocaleDateString()).format('YYYY-MM-DD')
  }
  quickChooseParams.value = id
  isMonthly.value = null
}
// 选中月
const changeMonthly = (id: any) => {
  // 根据传入值，设置开始时间和结束时间，格式化时间yyyy-MM-dd
  if (id === 0) {
    startDate.value = dayjs(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 1) {
    startDate.value = dayjs(new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD')
  }
  else if (id === 2) {
    startDate.value = dayjs(new Date(new Date().getTime() - 180 * 24 * 60 * 60 * 1000).toLocaleDateString()).format('YYYY-MM-DD')
    endDate.value = dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD')
  }
  isMonthly.value = id
  quickChooseParams.value = null
}

// 开始时间
const startDate = ref<any>('')
// 结束时间
const endDate = ref<any>('')
// 选择时间
const showCalendar = ref<boolean>(false)
// 开始选择时间
const selectDate = (id: any, date: any) => {
  showCalendar.value = true
}
const confirmDateRange = (e: any) => {
  startDate.value = e[0]
  endDate.value = e[e.length - 1]
  isMonthly.value = null
  quickChooseParams.value = null
  showCalendar.value = false
}
// 重置时间参数
const resetDateParams = () => {
  startDate.value = ''
  endDate.value = ''
  isMonthly.value = null
  quickChooseParams.value = null
}
// 确定搜索
const confirDateParams = () => {
  getOrderList()
  showPopup.value = false
}
// 跳转详情
const goDetails = (id: any) => {
  console.log(123, userType, orderType.value)
  if (userType === 2) {
    uni.navigateTo({
      url: `/pagesHome/src/iWantToSellGoods/orderInfoConfirm?orderId=${id}&orderType=${orderType.value}`,
    })
  }
  else if (userType === 3) {
    if (orderType.value === '1') {
      uni.navigateTo({
        url: `/pagesHome/src/myOrderForm/generateTrade?orderId=${id}`,
      })
    }
    else {
      uni.navigateTo({
        url: `/pagesHome/src/iWantToSellGoods/orderInfoConfirm?orderId=${id}&orderType=${orderType.value}`,
      })
    }
  }
  else {
    uni.navigateTo({
      url: `/pagesHome/src/myOrderForm/generateTrade?orderId=${id}`,
    })
  }
}
// 确认支付
const goPayment = (id: any) => {
  uni.navigateTo({
    url: `/pagesHome/src/myOrderForm/payVoucher?orderId=${id}`,
  })
}
// goInvoice去开票
const goInvoice = () => {
  uni.navigateTo({
    url: '/pagesHome/src/invoicing/index',
  })
}

onLoad((e: any) => {
  orderType.value = e.type
  keyWord.value = ''
  if (userType == 1) {
    placeholder.value = '请输入胶站名称'
  }
  else if (userType == 2) {
    placeholder.value = '请输入胶站名称'
  }
  else {
    if (e.type == 2) {
      placeholder.value = '请输入胶农名称'
    }
    else {
      placeholder.value = '请输入胶厂名称'
    }
  }
  judgeUser()
})

onShow(() => {
  baseFontSize.value = getFontSize()
  form.value = []
  getOrderList()
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="padbg">
    <view class="top">
      <view class="spd flex-row justify-between">
        <view class="screen flex-row justify-between items-center">
          <up-icon name="search" color="#A0A0A0" size="48rpx" />
          <input v-model="keyWord" :placeholder="placeholder" confirm-type="search" @confirm="enterSearchitect">
        </view>
        <image :src="userContent.screen" mode="scaleToFill" @click="showPopup = true" />
      </view>
      <view class="tabs">
        <up-tabs
          :list="tabList" :line-color="userContent.themeColor" line-width="78rpx" :active-style="{ color: '#0D0D0D', fontSize: '32rpx' }"
          :inactive-style="{ color: '#A0A0A0', fontSize: '32rpx' }"
          :item-style="{ width: 'calc(25% - 22px)', marginBottom: '16rpx' }"
          @click="changeTab"
        />
      </view>
    </view>
    <view v-if="form.length !== 0" class="pd">
      <scroll-view>
        <view
          v-if="form.length !== 0" scroll-y :lower-threshold="10"
          :style="{ height: 'calc(100vh - 250rpx)' }" @scrolltolower="scrolltolower"
        >
          <view v-for="(item, id) in form" :key="id" class="box" @click="goDetails(item.id)">
            <view class="tit flex-row justify-between items-center">
              <view v-if="orderType === '1'" style="font-weight: bold;">
                {{ item.buyerName }}
              </view>
              <view v-else style="font-weight: bold;">
                {{ item.sellerName }}
              </view>
              <view :style="{ color: retColor(item.checkStatus) }">
                {{ retType(item.checkStatus) }}
              </view>
            </view>
            <view class="content">
              <view class="flex-row">
                <image :src="have(item.thumbnail) ? item.thumbnail : '../../../static/image/defaultImg.png'" mode="" />
                <view class="rt">
                  <view class="text1">
                    类型：{{ item.rubberType === 1 ? '胶水' : '胶块' }}
                  </view>
                  <view class="mt flex-row justify-between items-center">
                    <view class="text1">
                      干含比：{{ item.dryWater }}
                    </view>
                    <view class="text2">
                      %
                    </view>
                  </view>
                  <view class="mt flex-row justify-between items-center">
                    <view class="text1">
                      重量：{{ item.productCount }}
                    </view>
                    <view class="text2">
                      kg
                    </view>
                  </view>
                  <view class="mt flex-row justify-between items-center">
                    <view class="text1">
                      收胶价：{{ item.productUnitPrice }}
                    </view>
                    <!--   <view v-if="userType === 2" class="text2">
                    元/公斤
                  </view>
                  <view v-else class="text2">
                    元/吨
                  </view> -->
                    <view class="text2">
                      元/kg
                    </view>
                  </view>
                  <view class="text3">
                    订单金额 ¥ {{ item.productTotalPrice }} 元
                  </view>
                </view>
              </view>
              <view v-if="userType === 2" class="function flex-row justify-end">
                <view v-if="item.checkStatus === 1" class="btn1" @click.stop="goQRCode(item)">
                  查看二维码
                </view>
                <view v-if="item.checkStatus === 2" class="btn2" @click.stop="goDetails(item.id)">
                  确认收款
                </view>
              </view>
              <view v-if="userType === 3" class="function flex-row justify-end">
                <view v-if="item.checkStatus === 1" class="btn1" @click.stop="cancelOrder(item.id)">
                  取消订单
                </view>
                <view v-if="item.checkStatus === 1" class="btn1" @click.stop="goQRCode(item)">
                  查看二维码
                </view>
                <view v-if="item.checkStatus === 1 && orderType === '1'" class="btn3" @click.stop="goDetails(item.id)">
                  确认交易
                </view>
                <view v-if="item.checkStatus === 2 && orderType === '1'" class="btn3" @click.stop="goDetails(item.id)">
                  确认收款
                </view>
                <view v-if="item.checkStatus === 1 && orderType === '2'" class="btn3" @click.stop="goDetails(item.id)">
                  支付订单
                </view>
              </view>
              <view v-if="userType === 1" class="function flex-row justify-end">
                <view v-if="item.checkStatus === 1" class="btn1" @click.stop="cancelOrder(item.id)">
                  取消订单
                </view>
                <view v-if="item.checkStatus === 1" class="btn1 jc_color-border" @click.stop="goQRCode(item)">
                  查看二维码
                </view>
                <view v-if="item.checkStatus === 1" class="btn4" @click.stop="goDetails(item.id)">
                  生成交易
                </view>
                <view v-if="item.checkStatus === 2" class="btn4" @click.stop="goPayment(item.id)">
                  确认支付
                </view>
                <view v-if="item.checkStatus === 3" class="btn4" @click.stop="goInvoice()">
                  申请开票
                </view>
              </view>
            </view>
          </view>
          <view v-if="showMore">
            <uni-load-more :status="moreStatus" />
          </view>
        </view>
      </scroll-view>
    </view>
    <voidPrompt v-else />
    <up-popup :show="showPopup" bg-color="transparent">
      <view class="popup">
        <view class="flex-row justify-between items-center">
          <view style="width: 50rpx;" />
          <view class="tit">
            订单筛选
          </view>
          <view style="width: 50rpx;" @click="closePopup">
            <up-icon name="close" color="#A0A0A0" size="42rpx" />
          </view>
        </view>
        <view class="type">
          按时间
        </view>
        <view class="monthly flex-row justify-between items-center">
          <view
            v-for="(item, id) in monthlyList" :key="id" :class="isMonthly === item.code ? userContent.smbtn : 'mbtn'"
            @click="changeMonthly(item.code)"
          >
            {{ item.name }}
          </view>
        </view>
        <view class="monthly" style="display: flex;align-items: center;justify-content: flex-start;flex-wrap: wrap;">
          <view
            v-for="item in quickChooseOptions" :key="item.code" :class="quickChooseParams === item.code ? userContent.smbtn : 'mbtn'"
            @click="changeQuickParams(item.code)"
          >
            {{ item.name }}
          </view>
        </view>
        <view class="custom flex-row justify-between items-center noswap">
          <view class="date" @click="selectDate(1, startDate)">
            {{ startDate || '起始时间' }}
          </view>
          <view class="to" />
          <view class="date" @click="selectDate(2, startDate)">
            {{ endDate || '结束时间' }}
          </view>
        </view>
        <up-calendar :min-date="new Date('2024-01-01')" :max-date="new Date()" :month-num="12" :show="showCalendar" mode="range" @confirm="confirmDateRange" @close="showCalendar = false" />
        <view class="function flex-row justify-between items-center">
          <view class="justify-center items-center" :class="userContent.czBtn" @click="resetDateParams">
            重置
          </view>
          <view class="justify-center items-center" :class="userContent.qdBtn" @click="confirDateParams">
            确定
          </view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<style lang="scss" scoped>
.top {
  background-color: #fff;
  position: sticky;
  left: 0;
  top: 0;

  .spd {
    padding: 12rpx 24rpx;
  }

  .screen {
    background-color: $sbgcolor7;
    border-radius: 100rpx;
    font-size: $text2;
    width: calc(100% - 138rpx);
    padding: 0 24rpx;

    input {
      width: calc(100% - 66rpx);
    }
  }

  image {
    width: 66rpx;
    height: 66rpx;
  }

  .tabs {
    padding: 24rpx 0;
  }
}

.pd {
  padding: 24rpx;

  .box {
    background: #ffffff;
    border-radius: $radius1;
    padding: 24rpx;
    margin-bottom: 24rpx;

    .tit {
      padding-bottom: 24rpx;
      border-bottom: 2rpx solid $sbgcolor7;
      font-size: $text2;
      color: $sbgcolor4;
      line-height: $text3;
    }

    .content {
      margin-top: 24rpx;

      image {
        width: 186rpx;
        height: 186rpx;
        margin-right: 24rpx;
      }

      .rt {
        width: 444rpx;

        .mt {
          margin-top: 24rpx;
        }

        .text1 {
          font-size: $text2;
          color: $sbgcolor4;
          line-height: $text2;
        }

        .text2 {
          font-size: $text2;
          color: $sbgcolor5;
          line-height: $text2;
        }

        .text3 {
          font-size: $text2;
          color: $sbgcolor4;
          line-height: $text2;
          text-align: end;
          margin-top: 36rpx;
        }
      }

      .function {
        margin-top: 24rpx;

        .btn1 {
          padding: 12rpx 32rpx;
          border-radius: $radius6;
          border: 2rpx solid $sbgcolor5;
          font-size: $text2;
          color: $sbgcolor5;
          line-height: $text2;
        }

        .btn2 {
          padding: 12rpx 32rpx;
          border-radius: $radius6;
          background-color: $sbgcolor1;
          font-size: $text2;
          color: #fff;
          line-height: $text2;
          margin-left: 24rpx;
        }

        .btn3 {
          padding: 12rpx 32rpx;
          border-radius: $radius6;
          background-color: $sbgcolor8;
          font-size: $text2;
          color: #fff;
          line-height: $text2;
          margin-left: 24rpx;
        }

        .btn4 {
          padding: 12rpx 32rpx;
          border-radius: $radius6;
          background-color: $sbgcolor11;
          font-size: $text2;
          color: #fff;
          line-height: $text2;
          margin-left: 24rpx;
        }
      }
    }
  }
}

.popup {
  background-color: #fff;
  border-radius: $radius1 $radius1 0 0;
  padding: 24rpx;

  .tit {
    font-weight: bold;
    font-size: $text3;
    color: $sbgcolor4;
    line-height: $text2;
  }

  .type {
    margin-top: 36rpx;
    font-size: $text2;
    color: #000000;
    line-height: $text2;
  }

  .monthly {
    margin-top: 60rpx;

    .smbtn1 {
      padding: 18rpx 52rpx;
      background-color: $sbgcolor1;
      border-radius: $radius7;
      font-size: $text2;
      color: #ffffff;
      line-height: $text2;
    }

    .smbtn2 {
      padding: 18rpx 52rpx;
      background-color: $sbgcolor8;
      border-radius: $radius7;
      font-size: $text2;
      color: #ffffff;
      line-height: $text2;
    }

    .smbtn3 {
      padding: 18rpx 52rpx;
      background-color: $sbgcolor11;
      border-radius: $radius7;
      font-size: $text2;
      color: #ffffff;
      line-height: $text2;
    }

    .mbtn {
      padding: 18rpx 52rpx;
      background-color: $sbgcolor7;
      border: 2rpx dashed $sbgcolor5;
      border-radius: $radius7;
      font-size: $text2;
      color: $sbgcolor5;
      line-height: $text2;
    }
  }

  .custom {
    margin-top: 60rpx;

    .date {
      padding: 18rpx 40rpx;
      border-radius: $radius7;
      border: 2rpx solid $sbgcolor5;
      font-size: $text2;
      color: #000000;
      line-height: $text2;
    }

    .to {
      width: 60rpx;
      height: 4rpx;
      background-color: $sbgcolor5;
    }
  }

  .function {
    margin-top: 80rpx;
    margin-bottom: 56rpx;

    .btna1 {
      padding: 24rpx 0;
      width: 338rpx;
      border-radius: $radius3;
      border: 2rpx solid $sbgcolor1;
      font-size: $text2;
      color: $sbgcolor1;
      line-height: $text2;
    }

    .btna2 {
      padding: 24rpx 0;
      width: 338rpx;
      border-radius: $radius3;
      background-color: $sbgcolor1;
      font-size: $text2;
      color: #fff;
      line-height: $text2;
    }

    .btnb1 {
      padding: 24rpx 0;
      width: 338rpx;
      border-radius: $radius3;
      border: 2rpx solid $sbgcolor8;
      font-size: $text2;
      color: $sbgcolor8;
      line-height: $text2;
    }

    .btnb2 {
      padding: 24rpx 0;
      width: 338rpx;
      border-radius: $radius3;
      background-color: $sbgcolor8;
      font-size: $text2;
      color: #fff;
      line-height: $text2;
    }

    .btnc1 {
      padding: 24rpx 0;
      width: 338rpx;
      border-radius: $radius3;
      border: 2rpx solid $sbgcolor11;
      font-size: $text2;
      color: $sbgcolor11;
      line-height: $text2;
    }

    .btnc2 {
      padding: 24rpx 0;
      width: 338rpx;
      border-radius: $radius3;
      background-color: $sbgcolor11;
      font-size: $text2;
      color: #fff;
      line-height: $text2;
    }
  }
}
</style>
