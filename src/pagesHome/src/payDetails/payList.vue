<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box flex-row justify-between items-center">
				<view class="overview">
					<view>订单金额：{{ pageData.totalAmount }} 元</view>
					<view style="margin-top: 36rpx;">已支付金额：{{ pageData.finishedAmount }} 元</view>
					<view style="margin-top: 36rpx;">待付款：{{ pageData.willPayAmount }} 元</view>
					<view style="margin-top: 36rpx;">订单数量：{{ pageData.orderCount }} 单</view>
				</view>
				<view class="date flex-row items-center" @click="showDatePicker = true">
					<text>{{isDate}}&emsp13;</text>
					<up-icon name="arrow-down" color="#A0A0A0" size="14"></up-icon>
				</view>
			</view>
			<up-datetime-picker :show="showDatePicker" v-model="datePicker" mode="year-month" title="选择日期"
				@cancel="showDatePicker = false" @confirm="confirmDatePicker">
			</up-datetime-picker>
			<scroll-view :scroll-y="true" lower-threshold="20" @scrolltolower="loadMore" class="list">
				<view class="row flex-row justify-between items-center" v-for="(item,id) in pageData.daySummaryList" :key="id" @click="go(item)">
					<image src="../../../static/image/avatar.png" mode="scaleToFill"></image>
					<view class="flex-col" style="width: 570rpx;">
						<view class="text1 flex-row justify-between items-center">
							<view>共{{ item.orderCount }}单</view>
							<view>¥{{ item.totalAmount }}</view>
						</view>
						<view v-if="summaryType == '1'" class="text2 flex-row items-center">
							<view class="txt">已收款订单{{ item.finishedCount }}</view>
							<view class="txt">待胶厂订单{{ item.willPayCount }}</view>
						</view>
						<view v-if="summaryType == '2'" class="text2 flex-row items-center">
							<view class="txt">已支付订单{{ item.finishedCount }}</view>
							<view class="txt">待付款订单{{ item.willPayCount }}</view>
						</view>
						<view class="text2 flex-row justify-between items-center">
							<view>{{ item.date }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import dayjs from 'dayjs';

	import { getFontSize, getUserInfo } from '@/utils/local-storage'
	import { orderSummary, orderListByDay } from '@/api/pages/index'

	const summaryType = ref<string>() // 1-收入 2-支出
	const rubberUserType = ref<string>() // 1-胶站用户 2-胶厂用户

	onLoad((options: any) => {
		console.log('options', options);
		
		summaryType.value = options.summaryType
		rubberUserType.value = uni.getStorageSync('userInfo').buyerOrSeller == 1 ? '2' : '1'
		isDate.value = dayjs(new Date).format('YYYY-MM')
		getOrderSummary()
	})

	const pageData = ref<any>([])
	const getOrderSummary = async () => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		const res: any = await orderSummary({
			summaryType: summaryType.value,
			rubberUserType: rubberUserType.value,
			userId: getUserInfo().id,
			monthDate: isDate.value
		})
		uni.hideLoading()
		if (res.success) {
			pageData.value = res.data
		} else {
			uni.showToast({
        title: res.msg,
        icon: 'none',
      })
		}
	}

	// 根字体大小
	const baseFontSize = ref<number>(1)

	// 控制显示时间
	const showDatePicker = ref<any>()
	// 选中的时间
	const datePicker = ref<any>(new Date)
	// 显示的时间
	const isDate = ref<any>()

	// 选择时间时点击确定
	const confirmDatePicker = (e : any) => {
		isDate.value = dayjs(e.value).format('YYYY-MM')
		console.log('isDate', isDate.value);
		getOrderSummary()
		showDatePicker.value = false
	}
	
	// 列表触底时触发
	const loadMore = () => {
		console.log(1);
	}
	
	// 跳转下级
	const go = (item: any) => {
		uni.navigateTo({
			url: `/pagesHome/src/payDetails/details?summaryType=${summaryType.value}&date=${item.date}`
		});
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;

		.box {
			padding: 24rpx;
			background: #FFFFFF;
			border-radius: $radius1;

			.overview {
				font-size: $text2;
				color: $sbgcolor4;
			}

			.date {
				padding: 16rpx 24rpx;
				font-size: $text2;
				color: #A0A0A0;
				line-height: $text2;
				background: $sbgcolor7;
				border-radius: $radius2;
			}
		}
		
		.list{
			padding: 0 24rpx;
			background: #ffffff;
			border-radius: $radius1;
			height: calc(100vh - 400rpx);
			width: 654rpx;
			margin-top: 24rpx;
			
			.row{
				padding: 24rpx 0;
				border-bottom: 2rpx solid $sbgcolor7;
				
				image {
					width: 60rpx;
					height: 60rpx;
				}
				
				.text1{
					font-size: $text2;
					color: $sbgcolor4;
					line-height: $text2;
				}
				
				.text2{
					font-size: $text1;
					color: $sbgcolor5;
					line-height: $text1;
					margin-top: 8rpx;
					.txt {
						margin-right: 24rpx;
					}
				}
			}
		}
	}
</style>