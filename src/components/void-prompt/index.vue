<template>
	<view class="void flex-col justify-center items-center">
		<image src="@/static/image/void.png" mode="scaleToFill"></image>
		<text>暂无数据</text>
	</view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
	.void{
		padding: 286rpx 0;
		text-align: center;
		
		image{
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 20rpx;
		}
		
		text{
			font-size: $text4;
			color: $sbgcolor5;
		}
	}
</style>