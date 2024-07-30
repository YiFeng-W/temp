<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view :class="'type' + authInfo.buyerOrSeller">
		<view class="pd">
			<view class="box">
				<view class="flex-col items-center">
					<view class="name">{{authInfo.name}}</view>
					<image class="code" :src="form.QRCode" mode="scaleToFill"></image>
					<view class="tips">{{state}}</view>
				</view>
				<view class="content flex-row justify-between items-center">
					<text class="ctit">金额</text>
					<text class="ccontent">¥{{form.amt}}元</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow, onUnload } from '@dcloudio/uni-app';
	import { getQrcodeStatus } from '@/api/pagesHome/iWantToSellGoods/index'
	import { getQRCode } from '@/utils/local-storage';
	import { getFontSize } from '@/utils/local-storage';

	// 根字体大小
	const baseFontSize = ref<number>(1)

	const form = ref<{ QRCode : string; amt : string; }>({
		QRCode: '',
		amt: ''
	})

	// 参数
	const data = ref<object>({})

	// 用户信息
	const authInfo = getUserInfo()
	console.log('authInfo', authInfo);
	

	// 展示内容
	const state = ref<string>('')

	const timeId = ref<any>()

	const getOrderInfo = async () => {
		try {
			const res : any = await getQrcodeStatus(data.value)
			if (res.success) {
				if (res.data.status === 0) {
					state.value = '请将此码展示给买方'
				} else if (res.data.status === 1) {
					state.value = '二维码订单已被查看'
				} else if (res.data.status === 2) {
					state.value = res.data.userName + '正在支付订单'
				} else if (res.data.status === 3) {
					clearInterval(timeId.value);
					state.value = '订单已支付'
					uni.showModal({
						title: '订单已支付',
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								uni.navigateBack({
									delta: 2
								});
							}
						}
					})
				} else if (res.data.status === 4) {
					clearInterval(timeId.value);
					state.value = '订单已取消'
				}
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) {
			clearInterval(timeId.value);
		}
	}

	onLoad((e : any) => {
		form.value.amt = e.amt
		form.value.QRCode = getQRCode()
		if (e.id) {
			data.value = {
				orderId: e.id
			}
		}
		getOrderInfo()
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
		// 定时获取订单信息
		timeId.value = setInterval(() => {
			getOrderInfo()
		}, 5000)
	})
	onUnload(() => {
		clearInterval(timeId.value);
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;

		.box {
			background-color: #fff;
			border-radius: $radius1;

			.name {
				font-size: $text4;
				color: #000000;
				margin: 36rpx 0;
			}

			.code {
				width: 498rpx;
				height: 498rpx;
			}

			.tips {
				font-size: $text3;
				color: $sbgcolor1;
				margin: 40rpx 0 72rpx 0;
			}

			.content {
				box-shadow: 0 -6rpx 20rpx 0 rgba(0, 0, 0, 0.1);
				border-radius: $radius1;
				padding: 24rpx;

				.ctit {
					font-size: $text3;
					color: $sbgcolor4;
				}

				.ccontent {
					font-size: $text4;
					color: $sbgcolor1;
				}
			}
		}
	}
	.type1 {
		.tips {
			color: $sbgcolor11 !important;
		}
		.ccontent  {
			color: $sbgcolor11 !important;
		}
	}
	.type3 {
		.tips {
			color: $sbgcolor8 !important;
		}
		.ccontent  {
			color: $sbgcolor8 !important;
		}
	}
</style>