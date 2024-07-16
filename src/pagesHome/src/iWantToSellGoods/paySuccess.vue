<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box flex-col items-center">
				<image src="@/pagesHome/static/complete.png" mode="scaleToFill"></image>
				<view class="text">提交成功</view>
			</view>
		</view>
		<view class="operate flex-row justify-around items-center">
			<view class="btn justify-center items-center" @click="goIndex">返回首页</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app'
	import { getFontSize } from '@/utils/local-storage'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	
	// 返回首页
	const goIndex = () => {
		uni.switchTab({
			url: '/pages/index/index'
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
			background-color: #fff;
			border-radius: $radius1;

			image {
				width: 164rpx;
				height: 164rpx;
				margin-top: 76rpx;
			}

			.text {
				margin: 24rpx 0 76rpx 0;
				font-size: $text5;
				color: $sbgcolor4;
			}
		}
	}

	.operate {
		position: fixed;
		left: 0;
		bottom: 100rpx;
		font-size: $text4;
		line-height: $text4;
		width: 100%;

		.btn {
			color: #ffffff;
			background: $sbgcolor1;
			border-radius: $radius3;
			width: calc(100% - 48rpx);
			padding: 24rpx 0;
		}
	}
</style>