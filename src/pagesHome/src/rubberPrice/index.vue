<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="tit flex-row justify-between items-center">
				<view class="flex-row items-center">
					<view class="header"></view>
					<view class="text">橡胶期货价曲线图</view>
				</view>
				<view class="unit">单位：元</view>
			</view>
			<view class="box">
				
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getFontSize } from '@/utils/local-storage';

	// 根字体大小
	const baseFontSize = ref<number>(1)

	onLoad(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;
		
		.tit {
			margin-bottom: 24rpx;
			
			.header {
				width: 8rpx;
				height: 32rpx;
				background-color: $sbgcolor1;
				border-radius: 10rpx;
			}
			
			.text {
				font-weight: bold;
				font-size: $text2;
				color: $sbgcolor4;
				line-height: $text3;
				margin-left: 24rpx;
			}
			
			.unit {
				font-size: $text2;
				color: $sbgcolor5;
				line-height: $text1;
			}
		}
		
		.box {
			background: #FFFFFF;
			border-radius: $radius1;
			padding: 24rpx;
		}
	}
	
</style>