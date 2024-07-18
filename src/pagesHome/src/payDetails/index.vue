<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="flex-row" style="border-bottom: 4rpx solid #F5F5F5;">
					<view class="table flex-col justify-center items-center" style="border-right: 4rpx solid #F5F5F5;">
						<view class="tit">本月订单金额（元）</view>
						<view class="text">{{ pageData.totalAmount }}</view>
					</view>
					<view class="table flex-col justify-center items-center">
						<view class="tit">订单数量（单）</view>
						<view class="text">{{ pageData.orderCount }}</view>
					</view>
				</view>
				<view class="flex-row">
					<view class="table flex-col justify-center items-center" style="border-right: 4rpx solid #F5F5F5;">
						<view v-if="summaryType == '1'" class="tit">待胶厂支付金额（元）</view>
						<view v-if="summaryType == '2'" class="tit">待付款金额（元）</view>
						<view class="text">{{ pageData.willPayAmount }}</view>
					</view>
					<view class="table flex-col justify-center items-center">
						<view v-if="summaryType == '1'" class="tit">已收款金额（元）</view>
						<view v-if="summaryType == '2'" class="tit">已支付金额（元）</view>
						<view class="text">{{ pageData.finishedAmount }}</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row flex-row justify-between items-center" 
							v-for="(item, id) in pageData.daySummaryList" :key="id"
							@click="goDetails(item)">
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
			</view>
			<view class="btn justify-center items-center" @click="go">查看全部收款</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getFontSize, getUserInfo } from '@/utils/local-storage'
	import { orderSummary, orderListByDay } from '@/api/pages/index'

	const summaryType = ref<string>() // 1-收入 2-支出
	const rubberUserType = ref<string>() // 1-胶站用户 2-胶厂用户

	onLoad((options: any) => {
		summaryType.value = options.summaryType
		rubberUserType.value = uni.getStorageSync('userInfo').buyerOrSeller == 1 ? '2' : '1'

		getOrderSummary()
	})

	const pageData = ref<any>([])
	const getOrderSummary = async () => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		let year = new Date().getFullYear()
		let month: string | number = new Date().getMonth() + 1;
		month = month < 10 ? ('0' + month ): month;
		const res: any = await orderSummary({
			summaryType: summaryType.value,
			rubberUserType: rubberUserType.value,
			userId: getUserInfo().id,
			monthDate: `${year}-${month}`
		})
		uni.hideLoading()
		if (res.success) {
			pageData.value = res.data
			console.log('pageData', pageData);
			
		} else {
			uni.showToast({
        title: res.msg,
        icon: 'none',
      })
		}
	}

	// 根字体大小
	const baseFontSize = ref<number>(1)
	
	// 跳转下级
	const go = () => {
		uni.navigateTo({
			url: `/pagesHome/src/payDetails/payList?summaryType=${summaryType.value}`
		});
	}
	// 跳转详情
	const goDetails = (item: any) => {
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
			background: #FFFFFF;
			border-radius: $radius1;
			
			.table{
				width: calc(50% - 2rpx);
				padding: 24rpx 0;
				
				.tit{
					font-size: $text2;
					color: $sbgcolor4;
				}
				
				.text{
					font-weight: bold;
					font-size: $text2;
					color: #000000;
					line-height: $text2;
					margin: 16rpx 0;
				}
			}
		}
		
		.list{
			padding: 0 24rpx;
			background: #ffffff;
			border-radius: $radius1;
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
					line-height: $text4;
				}
				
				.text2{
					font-size: $text1;
					color: $sbgcolor5;
					line-height: $text4;
					margin-top: 8rpx;
					.txt {
						margin-right: 24rpx;
					}
				}
			}
		}
		
		.btn{
			padding: 24rpx 0;
			margin-top: 48rpx;
			background-color: $sbgcolor1;
			border-radius: $radius2;
			font-size: $text3;
			color: #FFFFFF;
			line-height: $text3;
		}
	}
</style>