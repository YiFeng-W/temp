<script lang="ts" setup>
// @ts-expect-error blame no type declaration
import QQMapWX from '@/utils/qqmap-wx-jssdk'
import { getRubberFactoryMap, getRubberStationMap } from '@/api/pagesHome/map'

const { isStationRef } = useRoleMisc()

watchEffect(() => {
  if (!isStationRef.value)
    return

  // 如果是胶站，修改标题为 胶厂地图
  uni.setNavigationBarTitle({ title: '胶厂地图' })
})

// 根字体大小
const baseFontSize = ref<number>(1)
// 中心经度
const longitude = ref<any>()
// 中心纬度
const latitude = ref<any>()
// 当前坐标
const coordinate = ref<any>({
  longitude: '',
  latitude: '',
})
// 缩放级别
const scale = ref<number>(16)
// 胶站点
const markers = ref<any>([])
// 胶站点
const list = ref<any>([])

// 获取胶站地图
const getMap = async () => {
  try {
    const action = isStationRef.value ? getRubberFactoryMap : getRubberStationMap
    const res = await action()
    if (res.success) {
      const tempList = res.data || []

      list.value = tempList
      tempList.forEach((e: any, id: any) => {
        markers.value.push({
          id,
          latitude: e.latitude,
          longitude: e.longitude,
          title: e.name,
          iconPath: '/pagesHome/static/dw.png',
          width: 32,
          height: 32,
        })
      })
    }
    else {
      uni.showToast({
        title: res.msg,
        icon: 'none',
      })
    }
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e) {
    // TODO handle the exception
  }
}

// 获取当前位置
const getPosition = () => {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => {
      uni.getLocation({
        type: 'gcj02',
        geocode: true,
        success: (res: any) => {
          //
          longitude.value = res.longitude
          latitude.value = res.latitude
          coordinate.value.longitude = res.longitude
          coordinate.value.latitude = res.latitude
          getMap()
          const qqmapsdk = new QQMapWX({
            key: 'RV7BZ-EDHKZ-GK7X3-7MIGN-DNX6J-2GBYU', // 申请的key
          })
          const loca = {
            longitude: longitude.value,
            latitude: latitude.value,
            province: '',
            city: '',
            area: '',
            street: '',
            address: '',
          }
          qqmapsdk.reverseGeocoder({
            loca,
            // success(asd: any) {
            //   const info = asd.result
            //   //
            // },
            // fail(err: any) {
            //   //
            // },
          })
        },
        fail: (res: any) => {
          //
          uni.showToast({
            title: res.errMsg,
            icon: 'none',
          })
        },
      })
    },
    fail: () => {
      uni.showToast({
        title: '未获取地理位置信息，请手动开启',
      })
    },
  })
}

// 获取两个地点间距
const getSpacing = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const earthRadius = 6371 // 地球半径，单位为千米
  // 将经纬度转换为弧度
  const radLat1 = (Math.PI / 180) * lat1
  const radLon1 = (Math.PI / 180) * lon1
  const radLat2 = (Math.PI / 180) * lat2
  const radLon2 = (Math.PI / 180) * lon2
  //

  // 计算经纬度的差值
  const deltaLat = radLat2 - radLat1
  const deltaLon = radLon2 - radLon1
  //

  // 使用Haversine公式计算距离
  const a
= Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
+ Math.cos(radLat1)
* Math.cos(radLat2)
* Math.sin(deltaLon / 2)
* Math.sin(deltaLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadius * c
  //
  if (distance > 1) {
    return `${distance.toFixed(2)}公里` // 返回保留两位小数的距离值
  }
  else {
    return `${(distance * 1000).toFixed(2)}米`
  }
// return distance.toFixed(2); // 返回保留两位小数的距离值
}

// 标点被点击
const markertap = (markerId: any) => {
  console.log('markerId: ', markerId)
}

// 点击过的列表
const isList = ref<number>()

// 点击列表
const selectList = (item: any, id: number) => {
  longitude.value = item.longitude
  latitude.value = item.latitude
  isList.value = id
  for (let i = 0; i < markers.value.length; i++) {
    if (i === id) {
      markers.value[i].width = 48
      markers.value[i].height = 48
    }
    else {
      markers.value[i].width = 32
      markers.value[i].height = 32
    }
  }
}

// 导航
const navigation = (item: any) => {
  uni.openLocation({
    latitude: item.latitude,
    longitude: item.longitude,
    name: item.name,
  })
}

onShow(() => {
  baseFontSize.value = getFontSize()

  getPosition()
})
</script>

<template>
  <page-meta :root-font-size="`${baseFontSize}px`" />
  <view class="padbg">
    <view class="dt">
      <map
        :longitude="longitude"
        :latitude="latitude"
        :scale="scale"
        :show-location="true"
        :markers="markers"
        @markertap="markertap"
      />
    </view>
    <view class="list">
      <view v-for="(item, id) in list" :key="id" class="row flex-row justify-between" @click="selectList(item, id)">
        <image :src="item.doorHeadImage" mode="scaleToFill" class="model" />
        <view class="content flex-col justify-around">
          <view :style="{ color: isList === id ? '#2BAE85' : '#000000' }" class="text1">
            {{ item.name }}
          </view>
          <view class="jj">
            今日收胶价：{{ item.rubberPrice }} 元/公斤
          </view>
          <view class="text2">
            {{ getSpacing(coordinate.latitude, coordinate.longitude, item.latitude, item.longitude) }}
          </view>
        </view>
        <view class="flex-col justify-center items-center" @click.stop="navigation(item)">
          <image src="@/pagesHome/static/navigation.png" mode="scaleToFill" class="operateImg" />
          <view class="text3">
            导航
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.dt {
  width: 100%;
  height: 572rpx;

  map {
    width: 100%;
    height: 100%;
  }
}

.list {
  padding: 0rpx 24rpx;
  height: calc(100vh - 596rpx);
  background-color: #fff;
  overflow: auto;

  .row {
    padding: 24rpx 0;
    color: #000000;
    border-bottom: 2rpx solid $sbgcolor7;

    .model {
      width: 186rpx;
      height: 186rpx;
      border-radius: $radius1;
    }

    .content {
      width: 368rpx;
    }

    .operateImg {
      width: 100rpx;
      height: 100rpx;
      margin-bottom: 8rpx;
    }

    .text1 {
      font-size: $text2;
      color: $sbgcolor4;
      font-weight: 700;
    }

    .jj {
      font-size: $text1;
      color: $sbgcolor4;
      line-height: $text2;
    }

    .text2 {
      font-size: $text2;
      color: $sbgcolor5;
    }

    .text3 {
      font-size: $text2;
      color: #000000;
    }
  }
}
</style>
