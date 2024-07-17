<script lang="ts" setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
import { getAuthInfo, getFontSize, getToken, getUserInfo } from '@/utils/local-storage'
import {
  bindSeller,
  getDetailForArticles,
  getProductPriceTrendDetail,
  getRubberStationDetail,
  getRubberStationToatl,
  getRU2409,
  getRubberPrice,
  getSetPriceJC,
} from '@/api/pages/index'

// 根字体大小
const baseFontSize = ref<number>(1)
// 导航栏高度
const barHeight = ref<any>(0)
uni.getSystemInfo({
  success(info) {
    barHeight.value = info.statusBarHeight
  },
})
// 今日期货胶价
const newPrice = ref<any>()
// 胶站名称
const stationName = ref<any>()
// 胶站编码
const stationcode = ref<any>()
// 今日胶厂价格
const stationPrice = ref<any>()
// 收胶重量
const stationNum = ref<any>()
// 胶站id
const stationId = ref<any>()
// 功能列表
const gnList = ref<any>([
  {
    name: '自产证明',
    icon: '../../static/image/pages/zczm.png',
    path: '/pagesHome/src/selfProductionRegistration/index',
  },
  {
    name: '交易订单',
    icon: '../../static/image/pages/jydd.png',
    path: '/pagesHome/src/myOrderForm/index?type=1',
  },
  {
    name: '胶站地图',
    icon: '../../static/image/pages/jzdt.png',
    path: '/pagesHome/src/map/index',
  },
  {
    name: '自产卖货',
    icon: '../../static/image/pages/zcmh.png',
    path: '/pagesHome/src/iWantToSellGoods/index?amt=',
  },
])
const roleFlag = ref<any>()
// yyyy-mm-dd时间格式
const getData = (e: any) => {
  const data = dayjs(e).format('YYYY-MM-DD')
  return data
}
// 判断是否有值
const have = (value: any) => {
  return value !== undefined && value !== null && value !== ''
}

// 获取今日胶价
const getPrice = async () => {
  try {
    const res: any = await getProductPriceTrendDetail()
    if (res.success) {
      newPrice.value = res.data.averagePrice
      gnList.value[3].path
        = `/pagesHome/src/iWantToSellGoods/index?amt=${res.data.averagePrice}`
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

// 获取胶站详情
const getStationDetail = async () => {
  try {
    const res: any = await getRubberStationDetail()
    if (res.success) {
      stationName.value = res.data.name
      stationcode.value = res.data.code
      stationPrice.value = res.data.rubberPrice
      stationId.value = res.data.id
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
// 获取站点统计
const getStationTotal = async () => {
  try {
    const res: any = await getRubberStationToatl()
    if (res.success) {
      stationNum.value = res.data.totalNumber
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

// 获取胶厂信息（收胶价）
const getDetailJC = () => {
  getRubberPrice({ id: '1811283020266663938' })
}

// 新闻列表
const newsList = ref<any>()
// 获取新闻列表
const getNewsList = async () => {
  try {
    const res: any = await getDetailForArticles({
      page: 1,
      pageSize: 3,
      status: 1,
    })
    if (res.success) {
      newsList.value = res.data.records
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

// 胶农扫码
const scanQRCode = () => {
  uni.scanCode({
    success: (res) => {
      const id = res.result.split('?')
      uni.navigateTo({
        url: `/pagesHome/src/iWantToSellGoods/orderInfoConfirm?${id[1]}`,
      })
    },
    fail: () => {
      uni.showToast({
        title: '扫描失败',
        icon: 'none',
      })
    },
  })
}

// 胶价详情
const goRubberPrice = () => {
  uni.navigateTo({
    url: '/pagesHome/src/rubberPrice/index',
  })
}

// 跳转身份码
const goIDCard = () => {
  if (getUserInfo().buyerOrSeller === 2) {
    if (have(getToken())) {
      if (getAuthInfo().authStatus !== 1) {
        uni.showToast({
          title: '请先完成身份认证',
          icon: 'none',
        })
      }
      else {
        uni.navigateTo({
          url: '/pagesMy/src/userInfo/index',
        })
      }
    }
    else {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      })
    }
  }
  else {
    if (have(getToken())) {
      uni.navigateTo({
        url: '/pagesMy/src/userInfo/index',
      })
    }
    else {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      })
    }
  }
}
// 跳转功能详情
const gogn = (item: any) => {
  if (have(getToken())) {
    uni.navigateTo({
      url: item.path,
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 跳转新闻列表
const goNews = () => {
  uni.navigateTo({
    url: '/pagesHome/src/information/index',
  })
}
// 跳转新闻详情
const goNewsDetails = (item: any) => {
  uni.navigateTo({
    url: `/pagesHome/src/information/details?id=${item.id}`,
  })
}

// 胶站扫码
const scanTheCode = () => {
  uni.scanCode({
    success: async (res: any) => {
      console.log('res', res);
      
      if (res.result.includes('userId')) {
        const obja: any = res.result.split('{')
        const objb: any = obja[1].split('}')
        const objc: any = objb[0].split(',')
        const obj: any = objc[1].split(':')
        try {
          const res: any = await bindSeller({
            sellerId: obj[1],
          })
          if (res.success) {
            uni.showToast({
              title: '绑定成功',
              icon: 'none',
              duration: 3000,
            })
          }
          else {
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000,
            })
          }
        }
        catch (e) {
          // TODO handle the exception
        }
      }
      else {
        const id = res.result.split('?')
        uni.navigateTo({
          url: `/pagesHome/src/iWantToSellGoods/orderInfoConfirm?${id[1]}`,
        })
      }
    },
    fail: () => {
      uni.showToast({
        title: '扫描失败',
        icon: 'none',
      })
    },
  })
}
// 跳转收胶订单
const gosjdd = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url: '/pagesHome/src/myOrderForm/index?type=2',
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 支出明细
const gozcmx = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url: '/pagesHome/src/payDetails/index',
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 设置收胶价
const setPrice = () => {
  if (roleFlag.value === 1) { // 胶厂
    uni.navigateTo({
      url: `/pagesMy/src/setPrice/index?id=${stationId.value}&amt=${stationPrice.value}`,
    })
  } else {
    uni.navigateTo({
      url: `/pagesMy/src/setPrice/index?id=${stationId.value}&amt=${stationPrice.value}`,
    })
  }
}
// 跳转胶站售胶
const gojzsj = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url:
        `/pagesHome/src/iWantToSellGoods/glueStationRrder?amt=${newPrice.value}`,
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 跳转售胶订单
const goshjdd = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url: '/pagesHome/src/myOrderForm/index?type=1',
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 收入明细
const gosrmx = () => {
  if (have(getToken())) {
    uni.navigateTo({
      url: '/pagesHome/src/payDetails/index',
    })
  }
  else {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    })
  }
}
// 胶厂地图
const gojcdt = () => {
  uni.navigateTo({
    url: '/pagesHome/src/map/index',
  })
}
// 代理收益
const godlsy = () => {
  uni.navigateTo({
    url: '/pagesHome/src/agent/index',
  })
}
// 跳转设置
const gosz = () => {
  uni.navigateTo({
    url: '/pagesMy/src/setUp/index',
  })
}
// 开票管理
const gokpgl = () => {
  uni.navigateTo({
    url: '/pagesHome/src/invoicing/index',
  })
}
// 代理收益
const goszsjz = () => {
  uni.showToast({
    title: '敬请期待',
    icon: 'none',
  })
}
// 开票管理
const gofptt = () => {
  uni.navigateTo({
    url: '/pagesHome/src/invoicing/invoiceManage',
  })
}

onLoad(() => {
  console.log('onload');
  getRU2409().then((res: any) => {
    console.log(res.Result[0].DisplayData.resultData.tplData.result);
  })
})
onShow(() => {
  baseFontSize.value = getFontSize()
  getNewsList()
  getPrice()
  roleFlag.value = uni.getStorageSync('userInfo').buyerOrSeller
  if (roleFlag.value == 3) {
    getStationDetail()
    getStationTotal()
    uni.hideTabBar()
  }
  else if (roleFlag.value == 1) {
    // 胶厂
    getDetailJC()
    uni.hideTabBar()
  }
  else {
    uni.showTabBar()
  }
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <!-- 胶农 -->
  <view v-if="!roleFlag || roleFlag == 2">
    <up-navbar title="首页" bg-color="#2BAE85" :title-style="{ color: '#FFFFFF', fontSize: '36rpx' }">
      <template #left />
    </up-navbar>
    <view class="padbg">
      <view :style="{ height: `calc(${barHeight + 44}px)` }" />
      <view class="topBg" />
      <view class="pd">
        <view class="box flex-row" style="margin-top: -140rpx">
          <view class="btn flex-col items-center" @click="goIDCard">
            <image src="@/static/image/pages/IDCode.png	" mode="scaleToFill" />
            <view class="text">
              身份码
            </view>
          </view>
          <view class="divisionLine" />
          <view class="btn flex-col items-center" @click="scanQRCode">
            <image src="@/static/image/pages/scan.png" mode="scaleToFill" />
            <view class="text">
              扫一扫
            </view>
          </view>
        </view>
        <view class="box price flex-col items-center" @click="goRubberPrice">
          <view class="tit">
            今日期货胶价
          </view>
          <view class="money">
            {{ newPrice }}<text>元/吨</text>
          </view>
        </view>
        <view class="box price flex-row flex-wrap justify-between items-center">
          <view v-for="(item, id) in gnList" :key="id" class="gn flex-col items-center" @click="gogn(item)">
            <image :src="item.icon" mode="scaleToFill" />
            <view>{{ item.name }}</view>
          </view>
        </view>
        <!-- <view class="titr flex-row justify-between items-center">
          <view class="flex-row items-center">
            <view class="label"></view>
            <view class="zx">资讯</view>
          </view>
          <view class="flex-row items-center" @click="goNews">
            <view class="more">查看更多</view>
            <up-icon name="arrow-right" color="#2BAE85" size="24rpx"></up-icon>
          </view>
        </view> -->
        <!-- <view class="box info">
          <view class="row flex-row justify-between" v-for="(item, id) in newsList" :key="id"
            @click="goNewsDetails(item)">
            <image :src="item.imagePath" mode="scaleToFill"></image>
            <view class="content flex-col justify-between">
              <view class="text">{{ item.title }}</view>
              <view class="date">
                <view>{{ item.contentSource }} </view>
                <view>{{ getData(item.createTime) }} </view>
              </view>
            </view>
          </view>
        </view> -->
      </view>
    </view>
  </view>
  <!-- 胶站 -->
  <view v-if="roleFlag == 3">
    <view class="padbg">
      <!-- 站点信息区域 -->
      <view class="topuser topbgImg1 flex-col justify-end">
        <view class="flex-row justify-between items-center">
          <image src="@/static/image/glueStation/business.png" mode="scaleToFill" class="tx" />
          <view class="content flex-col justify-around">
            <view class="name">
              {{ stationName }}
            </view>
            <view class="flex-row items-center">
              站点编号：{{ stationcode }}
              <image src="@/static/image/my/copy.png" mode="scaleToFill" class="copy" />
            </view>
          </view>
          <!-- <image src="@/static/image/pages/news.png" mode="scaleToFill" class="news"></image> -->
          <view class="news" />
        </view>
      </view>
      <!-- 功能区域 -->
      <view class="mainBack">
        <view class="weightInfo">
          <view class="title">
            今日收胶重量(公斤)
          </view>
          <view class="num">
            {{ stationNum }}公斤
          </view>
        </view>
        <view class="price">
          <view class="priceItem">
            <view class="tip">
              今日收胶单价
            </view>
            <view class="num">
              {{ stationPrice }}元/公斤
            </view>
          </view>
          <view class="thougt" />
          <view class="priceItem" @click="goRubberPrice">
            <view class="tip">
              今日期货胶价
            </view>
            <view class="num">
              {{ newPrice }}元/吨
            </view>
          </view>
        </view>
        <view class="tradeTitle">
          <image src="@/static/image/glueStation/through2.png" class="img" />
          <view>收胶管理</view>
        </view>
        <view class="rubberManage">
          <view class="box">
            <view class="manameItem" @click="scanTheCode">
              <image src="@/static/image/pages/scan.png" class="img" />
              <view>扫一扫</view>
            </view>
            <view class="manameItem" @click="gosjdd">
              <image src="@/static/image/glueStation/sjdd.png" class="img" />
              <view>收胶订单</view>
            </view>
            <view class="manameItem" @click="gozcmx">
              <image src="@/static/image/glueStation/zcmx.png" class="img" />
              <view>支出统计</view>
            </view>
            <view class="manameItem" @click="setPrice">
              <image src="@/static/image/glueStation/sjjg.png" class="img" />
              <view>设置收胶价</view>
            </view>
          </view>
        </view>
        <view class="tradeTitle">
          <image src="@/static/image/glueStation/through2.png" class="img" />
          <view>售胶管理</view>
        </view>
        <view class="rubberManage">
          <view class="box">
            <view class="manameItem" @click="gojzsj">
              <image src="@/static/image/glueStation/jzsj.png" class="img" />
              <view>胶站售胶</view>
            </view>
            <view class="manameItem" @click="goshjdd">
              <image src="@/static/image/glueStation/shjdd.png" class="img" />
              <view>售胶订单</view>
            </view>
            <view class="manameItem" @click="gosrmx">
              <image src="@/static/image/glueStation/srmx.png" class="img" />
              <view>收入统计</view>
            </view>
            <view class="manameItem" @click="gojcdt">
              <image src="@/static/image/glueStation/jcdt.png" class="img" />
              <view>胶厂地图</view>
            </view>
          </view>
        </view>
        <view class="tradeTitle">
          <image src="@/static/image/glueStation/through2.png" class="img" />
          <view>胶站管理</view>
        </view>
        <view class="rubberManage">
          <view class="box">
            <view class="manameItem" @click="godlsy">
              <image src="@/static/image/glueStation/dlsy.png" class="img" />
              <view>代理收益</view>
            </view>
            <view class="manameItem" @click="goIDCard">
              <image src="@/static/image/pages/IDCode.png" class="img" />
              <view>胶站码</view>
            </view>
            <view class="manameItem" @click="gosz">
              <image src="@/static/image/glueStation/sz.png" class="img" />
              <view>设置</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- 胶厂 -->
  <view v-if="roleFlag == 1">
    <view class="padbg">
      <!-- 站点信息区域 -->
      <view class="topuser topbgImg2 flex-col justify-end">
        <view class="flex-row justify-between items-center">
          <image src="@/static/image/glueStation/staName.png" mode="scaleToFill" class="tx" />
          <view class="content1 flex-col justify-around">
            <view>{{ getUserInfo().nickName }}</view>
          </view>
          <!-- <image src="@/static/image/pages/news.png" mode="scaleToFill" class="news"></image> -->
          <view class="news" />
        </view>
      </view>
      <!-- 功能区域 -->
      <view class="mainBack">
        <view class="weightInfo">
          <view class="title">
            今日收胶重量(公斤)
          </view>
          <view class="mount">
            14公斤
          </view>
        </view>
        <view class="price">
          <view class="priceItem">
            <view class="tip">
              今日收胶单价
            </view>
            <view class="mount">
              {{ 14 * 1000 }}元/吨
            </view>
          </view>
          <view class="thougt" />
          <view class="priceItem" @click="goRubberPrice">
            <view class="tip">
              今日期货胶价
            </view>
            <view class="mount">
              {{ newPrice }}元/吨
            </view>
          </view>
        </view>
        <view class="tradeTitle">
          <image src="@/static/image/glueStation/through.png" class="img" />
          <view>交易管理</view>
        </view>
        <view class="rubberManage2">
          <view class="box">
            <view class="manameItem2" @click="gosjdd">
              <image src="@/static/image/glueStation/sjdd.png" class="img" />
              <view>收胶订单</view>
            </view>
            <view class="manameItem2" @click="gokpgl">
              <image src="@/static/image/glueStation/kpgl.png" class="img" />
              <view>开票管理</view>
            </view>
            <view class="manameItem2" @click="setPrice">
              <image src="@/static/image/glueStation/sjjg.png" class="img" />
              <view>设置收胶价</view>
            </view>
          </view>
        </view>
        <view class="tradeTitle">
          <image src="@/static/image/glueStation/through.png" class="img" />
          <view>胶厂管理</view>
        </view>
        <view class="rubberManage2">
          <view class="box">
            <view class="manameItem2" @click="scanQRCode">
              <image src="@/static/image/pages/scan.png" class="img" />
              <view>扫一扫</view>
            </view>
            <view class="manameItem2" @click="gofptt">
              <image src="@/static/image/glueStation/fptt.png" class="img" />
              <view>发票抬头</view>
            </view>
            <view class="manameItem2" @click="goIDCard">
              <image src="@/static/image/glueStation/jcm.png" class="img" />
              <view>胶厂码</view>
            </view>
            <view class="manameItem2" @click="gosz">
              <image src="@/static/image/glueStation/sz.png" class="img" />
              <view>设置</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.topBg {
  height: 144rpx;
  background-color: $sbgcolor1;
}

.pd {
  padding: 24rpx;

  .box {
    background: #ffffff;
    border-radius: $radius1;

    .btn {
      padding: 36rpx 0;
      width: calc(50% - 2rpx);

      image {
        width: $imgw1;
        height: $imgh1;
      }

      .text {
        margin-top: 16rpx;
        font-size: $text2;
        font-weight: bold;
        color: #000000;
        line-height: $text2;
      }
    }

    .divisionLine {
      margin: 16rpx 0;
      border: 2rpx solid $sbgcolor7;
    }
  }

  .price {
    padding: 24rpx;
    margin-top: 24rpx;

    .tit {
      font-size: $text2;
      font-weight: bold;
      color: $sbgcolor4;
      line-height: $text2;
    }

    .money {
      margin-top: 36rpx;
      font-weight: bold;
      font-size: $text6;
      line-height: $text3;
      color: $sbgcolor1;

      text {
        font-size: $text2;
        font-weight: normal;
      }
    }

    .gn {
      font-size: $text2;
      font-weight: bold;
      color: #000000;
      line-height: $text2;

      image {
        width: $imgw1;
        height: $imgh1;
        margin-bottom: 16rpx;
      }
    }
  }

  .titr {
    padding: 24rpx 0;
    font-size: $text2;

    .label {
      width: 8rpx;
      height: $text2;
      border-radius: 10rpx;
      background-color: $sbgcolor1;
    }

    .zx {
      color: $sbgcolor4;
      margin-left: 24rpx;
      font-weight: 700;
    }

    .more {
      color: $sbgcolor5;
      margin-right: 16rpx;
    }
  }

  .info {
    padding: 24rpx 24rpx 0rpx 24rpx;

    .row {
      padding-bottom: 24rpx;

      image {
        width: $imgw2;
        height: $imgh2;
      }

      .content {
        width: 410rpx;
      }

      .text {
        font-size: $text2;
        color: #000;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        /* 定义显示的行数 */
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .date {
        font-size: $text1;
        color: $sbgcolor5;
        line-height: $text1;

        display: flex;
        justify-content: flex-end;

        view {
          width: 50%;
          text-align: end;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

//头部样式
.topbgImg1 {
  background-image: url('../../static/image/pages/topbg1.png');
}

.topbgImg2 {
  background-image: url('../../static/image/pages/topbg2.png');
}

.topuser {
  background-size: 100%;
  height: 276rpx;
  padding: 24rpx;

  .tx {
    width: 112rpx;
    height: 112rpx;
  }

  .copy {
    width: 18rpx;
    height: 18rpx;
    margin-left: 8rpx;
  }

  .news {
    width: 60rpx;
    height: 60rpx;
  }

  .content {
    width: 480rpx;
    height: 112rpx;
    font-size: $text2;
    color: #ffffff;
    line-height: $text2;

    .name {
      font-weight: bold;
    }
  }

  .content1 {
    width: 480rpx;
    height: 112rpx;
    font-size: $text4;
    color: #ffffff;
    line-height: $text4;
  }
}

// 胶厂首页样式
.img {
  width: 100rpx;
  height: 100rpx;
}

.img1 {
  width: 100rpx;
  height: 90rpx;
}

.mainBack {
  padding: 26rpx;
  box-sizing: border-box;

  .weightInfo {
    background: #fff;
    text-align: center;
    font-weight: 700;
    padding: 50rpx 0;
    box-sizing: border-box;
    font-family: PingFang SC-Bold;
    border-radius: 8px;
  }

  .title {
    font-size: $text2;
    margin-bottom: 24rpx;
  }

  .num {
    color: $sbgcolor8;
    font-size: $text3;
  }
}

.price {
  margin-top: 20rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  font-weight: 700;
  text-align: center;
  padding: 30rpx 0;
  box-sizing: border-box;
  font-family: PingFang SC-Bold;
  border-radius: 8px;

  .thougt {
    background-color: #ccc;
    width: 2rpx;
  }

  .priceItem {
    width: 45%;

    .tip {
      font-size: $text2;
      margin-bottom: 10px;
    }

    .num {
      color: $sbgcolor8;
      font-size: $text3;
    }
  }
}

.rubberManage {
  margin-top: 20rpx;
  background: #fff;
  padding: 30rpx 0;
  box-sizing: border-box;
  font-family: PingFang SC-Bold;
  border-radius: 8px;

  .title {
    font-size: $text2;
    margin-bottom: 16px;
    font-weight: 700;
    padding-left: 30rpx;
  }

  .box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .manameItem {
      width: 25%;
      text-align: center;
      font-size: $text2;

      view {
        margin-top: 8rpx;
        font-weight: bold;
      }
    }
  }
}

.topBack2 {
  height: 160rpx;
  background-color: $sbgcolor11;
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  box-sizing: border-box;

  .name {
    color: #fff;
    font-size: $text7;
    font-weight: 700;
    font-family: PingFang SC-Heavy;
    margin-left: 30rpx;
  }
}

.mount {
  color: $sbgcolor11;
  font-size: $text3;
}

.tradeTitle {
  font-size: $text2;
  margin: 16px 0;
  font-weight: 700;
  display: flex;
  align-items: center;

  image {
    width: 8rpx;
    height: 32rpx;
    margin-right: 30rpx;
  }
}

.rubberManage2 {
  margin-top: 20rpx;
  background: #fff;
  //   padding: 30rpx 0;
  //   box-sizing: border-box;
  font-family: PingFang SC-Bold;
  border-radius: 8px;

  .box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .manameItem2 {
      width: 33.33%;
      text-align: center;
      font-size: $text2;
      margin: 20px 0;

      view {
        margin-top: 8rpx;
      }
    }
  }
}
</style>
