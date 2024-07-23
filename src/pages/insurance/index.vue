<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<up-navbar title="保险" bgColor="#2BAE85" :titleStyle="{color: '#FFFFFF',fontSize: '36rpx'}">
		<template #left></template>
	</up-navbar>
	<view class="padbg">
		<view :style="{height: 'calc('+(barHeight + 44)+'px)'}"></view>
		<view class="topBg"></view>
		<view class="pd">
			<swiper circular :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="swiper">
				<swiper-item v-for="item in chartList" :key="item.id" style="border-radius: 20rpx;">
					<image :src="item.imagePath ? item.imagePath : '../../static/logo.png'" mode="scaleToFill" />
				</swiper-item>
			</swiper>
			<view class="box function flex-row">
				<view class="btn flex-col items-center" @click="uploadPolicy">
					<image src="@/static/image/insurance/policy.png	" mode="scaleToFill"></image>
					<view class="text">上传保单</view>
				</view>
				<view class="divisionLine"></view>
				<view class="btn flex-col items-center">
					<image src="@/static/image/insurance/settleAClaim.png" mode="scaleToFill"></image>
					<view class="text">发起理赔</view>
				</view>
			</view>
			<view class="titr flex-row justify-between items-center">
				<view class="flex-row items-center">
					<view class="label"></view>
					<view class="tit">理赔申请记录</view>
				</view>
			</view>
			<scroll-view scroll-y :lower-threshold="20" @scrolltolower="scrolltolower">
				<view class="box">
					<view class="row flex-row justify-between" v-for="(item,id) in list" :key="id">
						<view class="content">
							<view class="number">售胶订单编号：{{item.number}}</view>
							<view class="tp">成交单价：{{item.productUnitPrice}}/公斤</view>
							<view class="tp">售胶重量：{{item.productNumber}}</view>
							<view class="tp">合计金额：{{item.productTotalPrice}}</view>
						</view>
						<image :src="'../../static/image/insurance/'+item.claimApplyStatus+'.png'" mode="scaleToFill"></image>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getFontSize, getToken } from '@/utils/local-storage'
	import { getUserBannerList } from '@/api/pages/index'
	import { getClaimRecords } from '@/api/pages/insurance'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 导航栏高度
	const barHeight = ref<any>(0)
	uni.getSystemInfo({
		success: function (info) {
			barHeight.value = info.statusBarHeight
		}
	});
	// 列表
	const list = ref<any>([])
	
	// 判断是否有值
	const have = (value : any) => {
		return value !== undefined && value !== null && value !== ''
	}

	// 轮播图
	const chartList = ref<any>()
	const getChart = async () => {
		const res : any = await getUserBannerList()
		if (res.success) {
			chartList.value = res.data
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}
	
	// 上传保单
	const uploadPolicy = () => {
		uni.chooseImage({
			success: (res : any) => {
				console.log(1,res);
			},
			fail: (err : any) => {
				uni.showToast({
					title: "扫描失败",
					icon: "none",
				});
			},
		});
	}
	
	// 理赔记录列表
	const page = ref<number>(1)
	const pageSize = ref<number>(100)
	const total = ref<number>(0)
	// 获取列表
	const getList = async () => {
		try {
			const res : any = await getClaimRecords({
				page: page.value,
				pageSize: pageSize.value
			})
			if (res.success) {
				res.data.records.forEach((e : any) => {
					list.value.push(e)
				});
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) {
			//TODO handle the exception
		}
	}
	// 页面触底
	const scrolltolower = () => {
		console.log(1);
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
		getChart()
		if(have(getToken())) {
			getList()
		} else {
			uni.showToast({
				title: '当前未登录，请先登录再查看申请记录',
				icon: 'none'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.topBg {
		height: 144rpx;
		background-color: $sbgcolor1;
	}

	.pd {
		padding: 24rpx;

		.swiper {
			height: 340rpx;
			margin-top: -140rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.box {
			background: #FFFFFF;
			border-radius: $radius1;

			.row {
				border-bottom: 2rpx solid $sbgcolor7;

				.content {
					padding: 24rpx;
					font-size: $text2;
					line-height: $text2;
					color: $sbgcolor4;
					
					.number {
						width: 520rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					
					.tp {
						margin-top: 20rpx;
					}
				}

				image {
					width: 100rpx;
					height: 100rpx;
				}
			}
		}

		.function {
			margin-top: 24rpx;

			.btn {
				padding: 36rpx 0;
				width: calc(50% - 2rpx);

				image {
					width: 100rpx;
					height: 100rpx;
				}

				.text {
					margin-top: 12rpx;
					font-size: $text2;
					color: #000000;
					line-height: $text2;
					font-weight: 700;
				}
			}

			.divisionLine {
				margin: 16rpx 0;
				border: 2rpx solid $sbgcolor7;
			}
		}

		.titr {
			padding: 24rpx 0;
			font-size: $text2;

			.label {
				width: 8rpx;
				height: $text4;
				border-radius: 10rpx;
				background-color: $sbgcolor1;
			}

			.tit {
				color: $sbgcolor4;
				margin-left: 24rpx;
				font-weight: bold;
			}
		}


	}
</style>