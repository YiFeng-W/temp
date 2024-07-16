<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<!-- <web-view :src="url"></web-view> -->
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getFontSize } from '@/utils/local-storage';

	// 根字体大小
	const baseFontSize = ref<number>(1)
	
	// const url = ref<string>('https://wap.eastmoney.com/quote/stock/113.rum.html')

	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;
		height: calc(100vh - $text5 - 144rpx);

		.box {
			
		}
	}
</style>