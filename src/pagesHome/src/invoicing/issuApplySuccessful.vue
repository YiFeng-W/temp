<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="box">
			<!-- 提示框区域 -->
			<view class="box_tip">
				<image src="@/pagesHome/static/success.png" alt="" />
				<view class="state">提交成功</view>
				<view class="tips">开票成功，请注意查收，如您需要重开或者重新发送发票，可以前往“我的-发票中心-开票历史”中进行重新开票与重新发送发票。</view>
			</view>
			<!-- 底部按钮 -->
			<view class="footer">
				<view class="reback_index" @click="goIndexPage">返回首页</view>
				<view class="records" @click="goRecordsPage">开票记录</view>
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
	
	// 返回首页
	const goIndexPage = () => {
		uni.switchTab({
			url: `/pages/index/index`,
		});
	};
	// 前往开票记录
	const goRecordsPage = () => {
		uni.navigateTo({
			url: `/pagesHome/src/invoicing/invoiceRecords`,
		});
	};
	
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.box {
		padding: 30rpx 30rpx 0 30rpx;
	}

	.box_tip {
		height: 572rpx;
		background: #ffffff;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		text-align: center;
		padding: 40px 12px;
		box-sizing: border-box;

		image {
			width: 164rpx;
			height: 164rpx;
		}

		.state {
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: $text3;
			color: #0d0d0d;
			margin: 12px 0;
		}

		.tips {
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: $text2;
			color: #0d0d0d;
			text-align: left;
		}
	}

	.footer {
		margin-top: 300rpx;
		display: flex;
		justify-content: space-around;

		view {
			width: 45%;
			height: 80rpx;
			border-radius: 40rpx;
			text-align: center;
			line-height: 80rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 500;
			font-size: $text3;
		}

		.reback_index {
			background-color: #fff;
			border: 2rpx solid $sbgcolor11;
			color: $sbgcolor11;
		}

		.records {
			background-color: $sbgcolor11;
			color: #fff;
		}
	}
</style>