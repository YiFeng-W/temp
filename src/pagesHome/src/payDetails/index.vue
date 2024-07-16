<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="flex-row" style="border-bottom: 4rpx solid #F5F5F5;">
					<view class="table flex-col justify-center items-center" style="border-right: 4rpx solid #F5F5F5;">
						<view class="tit">本月订单金额（元）</view>
						<view class="text">300.89</view>
					</view>
					<view class="table flex-col justify-center items-center">
						<view class="tit">实收金额（元）</view>
						<view class="text">300.89</view>
					</view>
				</view>
				<view class="flex-row">
					<view class="table flex-col justify-center items-center" style="border-right: 4rpx solid #F5F5F5;">
						<view class="tit">已结算金额（元）</view>
						<view class="text">300.89</view>
					</view>
					<view class="table flex-col justify-center items-center">
						<view class="tit">订单数量（单）</view>
						<view class="text">300.89</view>
					</view>
				</view>
			</view>
			<view class="list">
				<view class="row flex-row justify-between items-center" 
							v-for="(item,id) in 5" :key="id"
							@click="goDetails">
					<image src="../../../static/image/avatar.png" mode="scaleToFill"></image>
					<view class="flex-col" style="width: 570rpx;">
						<view class="text1 flex-row justify-between items-center">
							<view>共4单</view>
							<view>¥390.22</view>
						</view>
						<view class="text2 flex-row justify-between items-center">
							<view>2024-05-31</view>
							<view>未结算</view>
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
	import { getFontSize } from '@/utils/local-storage'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	
	// 跳转下级
	const go = () => {
		uni.navigateTo({
			url: '/pagesHome/src/payDetails/payList'
		});
	}
	// 跳转详情
	const goDetails = (item: any) => {
		uni.navigateTo({
			url: '/pagesHome/src/payDetails/details'
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