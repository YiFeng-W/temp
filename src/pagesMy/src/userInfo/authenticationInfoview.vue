<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="row1 flex-row justify-between">
					<view>姓名</view>
					<view class="text">{{authInfo.nickName}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>联系电话</view>
					<view class="text">{{authInfo.phoneNumber}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>自产登记状态</view>
					<view class="text" v-if="authInfo.certAuthStatus == 0">待审核</view>
					<view class="text" v-if="authInfo.certAuthStatus == 1">通过</view>
					<view class="text" v-if="authInfo.certAuthStatus == 2">已撤销</view>
					<view class="text" v-if="authInfo.certAuthStatus == -1">未通过</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>种植承包面积</view>
					<view class="text">{{authInfo.plantArea}}亩</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>可销售数量</view>
					<view class="text">{{authInfo.saleQuantity}}公斤</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>剩余数量</view>
					<view class="text">{{authInfo.remainQuantity}}公斤</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { getUserInfo } from '@/api/pagesMy/userInfo'
	import { getFontSize, getAuthInfo } from '@/utils/local-storage'
	
	// 基础字号
	const baseFontSize = ref<number>(1)
	// 认证信息
	// const authInfo = getAuthInfo()
	const authInfo = ref<any>({})
	
	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}
	
	// 查看大图
	const largeImg = (url: any) => {
		uni.previewImage({
			urls: [url]
		})
	}
	
	onLoad((e: any) => {
		baseFontSize.value = getFontSize()
		getUserInfo({
			sellerId: e.id
		}).then(res => {
			authInfo.value = res.data
		})
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;
		
		.box {
			padding: 6rpx 24rpx;
			background-color: #fff;
			border-radius: $radius1;
			
			.img {
				margin: 26rpx 0;
				
				image {
					width: 320rpx;
					height: 220rpx;
				}
			}
		}
		
		.row1 {
			padding: 34rpx 0;
			font-size: $text4;
			border-bottom: 2rpx solid $sbgcolor7;
			
			.text {
				width: 400rpx;
				text-align: end;
			}
		}
	}
</style>