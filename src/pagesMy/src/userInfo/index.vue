<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<up-navbar title="身份码" :autoBack="true" bgColor="transparent" leftIconColor="#fff" :titleStyle="{color: '#fff'}">
	</up-navbar>
	<view class="bg flex-col justify-center items-center" :class="backgroundImg">
		<view class="flex-col items-center">
			<view class="user flex-col items-center">
				<image src="@/static/image/avatar.png" mode="scaleToFill" class="tx"></image>
				<view class="name">{{getUserInfo().nickName}}</view>
			</view>
			<image class="code" :src="QRCode" mode="scaleToFill"></image>
			<view class="tips">扫码后绑定我的身份信息</view>
		</view>
		<!-- <view class="function flex-row justify-center items-center">
			<view>保存图片</view>
		</view> -->
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getFontSize, getUserInfo } from '@/utils/local-storage';
	import { generateIdCardQrCode } from '@/api/pagesMy/userInfo'

	// 根字体大小
	const baseFontSize = ref<number>(1)
// 二维码
	const QRCode = ref<any>()
	// 背景
	const backgroundImg = ref<string>('img1')
	if(getUserInfo().buyerOrSeller === 1) {
		backgroundImg.value = 'img1'
	} else if (getUserInfo().buyerOrSeller === 2) {
		backgroundImg.value = 'img2'
	} else {
		backgroundImg.value = 'img3'
	}

	// 获取个人二维码
	const getQRCode = async () => {
		try {
			const res : any = await generateIdCardQrCode()
			if (res.success) {
				QRCode.value = res.data
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		} catch (e) {
			//TODO handle the exception
		}
	}
	
	onLoad(() => {
		baseFontSize.value = getFontSize()
		getQRCode()
	})
</script>

<style lang="scss" scoped>
	.img1 {
		background: url('https://smton.net/image/codebg1.png') no-repeat;
	}
	.img2 {
		background: url('https://smton.net/image/codebg2.png') no-repeat;
	}
	.img3 {
		background: url('https://smton.net/image/codebg3.png') no-repeat;
	}
	
	.bg {
		background-size: 100% 100%;
		width: 100%;
		height: 100vh;

		.user {
			color: #FFFFFF;

			.tx {
				width: 164rpx;
				height: 164rpx;
			}

			.name {
				font-weight: bold;
				font-size: $text2;
				line-height: $text2;
				margin-top: 36rpx;
			}
		}

		.code {
			width: 400rpx;
			height: 400rpx;
			margin: 60rpx 0;
		}

		.tips {
			color: #fff;
			font-size: $text2;
			color: #FFFFFF;
			text-align: center;
		}

		.function {
			font-size: $text2;
			color: #FFFFFF;
			position: fixed;
			bottom: 104rpx;

			view {
				line-height: $text2;
			}
		}
	}
</style>