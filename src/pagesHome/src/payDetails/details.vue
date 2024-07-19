<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<scroll-view :scroll-y="true" lower-threshold="20" @scrolltolower="loadMore" class="list">
				<view class="box" v-for="(item, id) in pageData" :key="id" :style="{ marginTop: id === 0 ? '0rpx' : '24rpx' }">
					<view class="content">
						<view class="flex-row justify-between items-center">
							<view class="tit">销售订单编号</view>
							<view class="text">20240511001</view>
						</view>
						<view class="mg flex-row justify-between items-center">
							<view class="tit">橡胶类型</view>
							<view class="text" v-if="item.rubberType == 1">胶水</view>
							<view class="text" v-if="item.rubberType == 2">胶块</view>
						</view>
						<view class="mg flex-row justify-between items-center">
							<view class="tit">订单金额</view>
							<view class="text">{{ item.orderAmount }}</view>
						</view>
						<view class="mg flex-row justify-between items-center">
							<view class="tit">订单状态</view>
							<view class="text">{{ retType(item.orderStatus) }}</view>
						</view>
						<view class="mg flex-row justify-between items-center">
							<view class="tit">下单时间</view>
							<view class="text">{{ item.createTime }}</view>
						</view>
					</view>
					<view class="btn flex-row justify-between items-center" @click="goOrderDetail(item.orderId)">
						<view>查看订单详情</view>
						<up-icon name="arrow-right" color="#25C264" size="14"></up-icon>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getFontSize, getUserInfo } from '@/utils/local-storage'
import { orderSummary, orderListByDay } from '@/api/pages/index'

const summaryType = ref<string>() // 1-收入 2-支出
const rubberUserType = ref<string>() // 1-胶站用户 2-胶厂用户
const date = ref<string>()

const pageData = ref<any>([])
const userType = ref<any>()
const tabList = ref<any>()

const pageNum = ref<any>(1)
const isFinish = ref<boolean>(false)

onLoad((options: any) => {
	userType.value = uni.getStorageSync('userInfo').buyerOrSeller
	date.value = options.date
	summaryType.value = options.summaryType
	rubberUserType.value = userType.value == 1 ? '2' : '1'
	judgeUser()
	getOrderListByDay()
})

const judgeUser = () => {
  if (userType.value === 2) {
    tabList.value = [{ name: '全部' }, { name: '待支付' }, { name: '待收款' }, { name: '已取消' }]
  }
  else if (userType.value === 3) {
    if (summaryType.value === '1') {
      tabList.value = [{ name: '全部' }, { name: '待确认' }, { name: '待收款' }, { name: '已取消' }]
    }
    else {
      tabList.value = [{ name: '全部' }, { name: '待付款' }, { name: '已支付' }, { name: '已取消' }]
    }
  }
  else if (userType.value === 1) {
    tabList.value = [{ name: '全部' }, { name: '待交易' }, { name: '待支付' }, { name: '已取消' }]
  }
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

const getOrderListByDay = async () => {
	if (isFinish.value) {
		return
	}
	uni.showLoading({
		title: '加载中',
		mask: true
	})
	const res: any = await orderListByDay({
		summaryType: summaryType.value,
		rubberUserType: rubberUserType.value,
		userId: getUserInfo().id,
		date: date.value,
		pageNum: pageNum.value,
		pageSize: 10
	})
	uni.hideLoading()
	if (res.success) {
		pageData.value = pageData.value.concat(res.data.records)
		if (res.data.total >= pageData.value.length) {
			isFinish.value = true
		}
	} else {
		uni.showToast({
			title: res.msg,
			icon: 'none',
		})
	}
}

const goOrderDetail = (id: string) => {
	let url = ''
	if (userType.value == 2) {
    url = `/pagesHome/src/iWantToSellGoods/orderInfoConfirm?orderId=${id}&orderType=1`
  }
  else if (userType.value == 3) {
    if (summaryType.value == '2') {
      url = `/pagesHome/src/myOrderForm/generateTrade?orderId=${id}`
    }
    else {
      url = `/pagesHome/src/iWantToSellGoods/orderInfoConfirm?orderId=${id}&orderType=1`
    }
  }
  else {
    url = `/pagesHome/src/myOrderForm/generateTrade?orderId=${id}`
  }
	uni.navigateTo({ url })
}

// 根字体大小
const baseFontSize = ref<number>(1)

onShow(() => {
	baseFontSize.value = getFontSize()
})

const loadMore = () => {
	pageNum.value++
	getOrderListByDay()
}
</script>

<style lang="scss" scoped>
.pd {
	padding: 24rpx;
	.list {
		height: 100vh;
		padding: 0 0 48rpx 0;
	}
	.box {
		padding: 0 24rpx;
		background: #FFFFFF;
		border-radius: $radius1;

		.content {
			padding: 24rpx 0;
			border-bottom: 4rpx solid $sbgcolor7;
			font-size: $text2;

			.mg {
				margin-top: 36rpx;
			}

			.tit {
				color: $sbgcolor5;
			}

			.text {
				color: $sbgcolor4;
				width: 420rpx;
				text-align: end;
			}
		}

		.btn {
			padding: 24rpx 0;
			font-size: $text2;
			color: $sbgcolor4;
			line-height: $text2;
		}
	}
}
</style>