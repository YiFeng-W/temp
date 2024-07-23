<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="tit flex-row justify-between items-center">
				<view class="flex-row items-center">
					<view class="header"></view>
					<view class="text">橡胶期货价曲线图</view>
				</view>
				<view class="unit">单位：元/吨</view>
			</view>
			<view class="box">
				<l-echart class="line-chart" ref="lineChartRef"></l-echart>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getFontSize } from '@/utils/local-storage';
const echarts = require('../../static/js/echarts.min')
const echartsData = ref({
	xData: [],
	yData: [],
})

// 根字体大小
const baseFontSize = ref<number>(1)

onLoad(() => {
	baseFontSize.value = getFontSize()
	const marketData = uni.getStorageSync('marketData')	
	marketData.marketData.forEach(item => {
		const x = item.split(',')[1]
		const y = item.split(',')[3]
		echartsData.value.xData.push(x.substring(5))
		echartsData.value.yData.push(y)

	})
	setTimeout(() => {
		loadLineData()
	}, 20)

})


const lineChartRef = ref()
console.log('lineChartRef', lineChartRef);

const loadLineData = () => {
	//这里请求服务器拿到数据
	let res = echartsData.value
	//这里option配置参考文档：https://echarts.apache.org/zh/option.html
	let option = {
		xAxis: {
			type: 'category',
			// x轴数据文字颜色
			axisLabel: {
				color: '#a7a7a7'
			},
			// x轴那天坐标轴线的颜色
			axisLine: {
				lineStyle: {
					color: '#f1f1f1',
				}
			},
			//x轴上面刻度线隐藏
			axisTick: {
				show: false,
			},
			//这里是x轴数据
			data: res.xData
		},
		//设置网格
		grid: {
			top: 20,
			left: 50,
			bottom: 20,
			right: 10
		},
		//y轴设置
		yAxis: {
			min: 13000,
			type: 'value',
			//y轴标签文字颜色
			axisLabel: {
				color: '#a7a7a7'
			},
			// y轴分割线设置为虚线
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed'
				}
			}
		},
		//设置提示为点击时
		tooltip: {
			trigger: 'axis',
			triggerOn: 'click',
			formatter: '{b} \n 橡胶期货价: {c}'
		},
		//设置曲线的颜色
		color: ['#4e9d77'],
		series: [{
			//这里是数据
			data: res.yData,
			type: 'line',
			//设置为平滑，默认为折线
			smooth: true,
		}],
		//设置数据缩放，手指缩放
		dataZoom:{
				type: 'inside',//inside移动端就是手指缩放，slider
				id:'123',
		}
	};

	lineChartRef.value.init(echarts, (chart: any) => {
		chart.setOption(option);
	});
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