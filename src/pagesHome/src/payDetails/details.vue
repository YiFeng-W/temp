<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box" v-for="(item,id) in 5" :key="id" :style="{marginTop: id===0?'0rpx':'24rpx'}">
				<view class="content">
					<view class="flex-row justify-between items-center">
						<view class="tit">销售订单编号</view>
						<view class="text">20240511001</view>
					</view>
					<view class="mg flex-row justify-between items-center">
						<view class="tit">商品分类</view>
						<view class="text">芒果</view>
					</view>
					<view class="mg flex-row justify-between items-center">
						<view class="tit">订单金额</view>
						<view class="text">100.00</view>
					</view>
					<view class="mg flex-row justify-between items-center">
						<view class="tit">实收金额</view>
						<view class="text">100.00</view>
					</view>
					<view class="mg flex-row justify-between items-center">
						<view class="tit">下单时间</view>
						<view class="text">2024-11-12 10:33:22</view>
					</view>
				</view>
				<view class="btn flex-row justify-between items-center">
					<view>查看订单详情</view>
					<up-icon name="arrow-right" color="#25C264" size="14"></up-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getFontSize } from '@/utils/local-storage'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;
		
		.box{
			padding: 0 24rpx;
			background: #FFFFFF;
			border-radius: $radius1;
			
			.content{
				padding: 24rpx 0;
				border-bottom: 4rpx solid $sbgcolor7;
				font-size: $text2;
				
				.mg {
					margin-top: 36rpx;
				}
				
				.tit{
					color: $sbgcolor5;
				}
				
				.text{
					color: $sbgcolor4;
					width: 420rpx;
					text-align: end;
				}
			}
			
			.btn{
				padding: 24rpx 0;
				font-size: $text2;
				color: $sbgcolor4;
				line-height: $text2;
			}
		}
	}
</style>