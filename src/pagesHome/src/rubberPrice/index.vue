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
				<lei-vchart :spec="spec" :options="options" :events="events" canvasId="chart-line" @chartinit="chartinit"
					@chartready="chartready"></lei-vchart>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getFontSize } from '@/utils/local-storage';
import ej from './response.json'

// 根字体大小
const baseFontSize = ref<number>(1)

onLoad(() => {
	baseFontSize.value = getFontSize()
	spec.data.values = ej.marketData.marketData.splice(-30).map(item => {
		return({
			time: item.split(',')[1],
			value: item.split(',')[3]
		});

	})

})
const spec: any = {
	type: 'line',
	data: {
		values: []
	},
	xField: 'time',
	yField: 'value'
};

const options = {}

const events = []

const chartinit = (e) => {
	console.log('chartinit:', e)
}

const chartready = (e) => {
	console.log('chartready:', e)
}
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