<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="box">
		<view class="content">
			<!-- <iframe :src="url" frameborder="0" class="iframe"></iframe> -->
			<web-view :src="url"></web-view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { getFontSize } from '@/utils/local-storage'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	const title = ref<string>('')
	// 服务协议 or 隐私政策
	const type = ref<string>('')
	// 展示内容
	const url = ref<string>('')

	onLoad((e : any) => {
		console.log(1, e);
		type.value = e.id
		if (e.id === '1') {
			title.value = '服务协议'
			url.value = 'https://smton.net/fwxy.html'
		} else if (e.id === '2') {
			title.value = '隐私政策'
			url.value = 'https://smton.net/yszc.html'
		} else if (e.id === '3') {
			title.value = '农产品销售协议'
			url.value = 'https://smton.net/xsxy.html'
		} else if (e.id === '4') {
			title.value = '农产品采购协议'
			url.value = 'https://smton.net/cgxy.html'
		}
		uni.setNavigationBarTitle({ title: title.value })
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.box {
		background-color: $sbgcolor1;
		padding: 24rpx;

		.content {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 24rpx;

			.iframe {
				width: 100%;
				min-height: calc(100vh - 96rpx);
				background-color: #faf;
			}
		}
	}
</style>