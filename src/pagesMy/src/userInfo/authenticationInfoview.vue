<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="img flex-row justify-between">
					<image @click="largeImg(authInfo.idcardBackPath)" :src="authInfo.idcardBackPath" mode="aspectFill"></image>
					<image @click="largeImg(authInfo.idcardFrontPath)" :src="authInfo.idcardFrontPath" mode="aspectFill"></image>
				</view>
				<view class="row1 flex-row justify-between">
					<view>姓名</view>
					<view class="text">{{authInfo.name}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>性别</view>
					<view class="text">{{authInfo.sex===1?'男':'女'}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>民族</view>
					<view class="text">{{authInfo.ethnicity}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>出生日期</view>
					<view class="text">{{authInfo.birthday}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>住址</view>
					<view class="text">{{authInfo.address}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>身份证号码</view>
					<view class="text">{{authInfo.idcardNumber}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>签发机关</view>
					<view class="text">{{authInfo.issueAuthority}}</view>
				</view>
				<view class="row1 flex-row justify-between">
					<view>有效期</view>
					<view class="text">{{authInfo.validStartDate}} 至 {{authInfo.validEndDate}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import { getFontSize, getAuthInfo } from '@/utils/local-storage'
	
	// 基础字号
	const baseFontSize = ref<number>(1)
	// 认证信息
	const authInfo = getAuthInfo()
	
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
	
	onLoad((e) => {
		id.value = '1810919904085340162' || e.id
		baseFontSize.value = getFontSize()
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
				width: 452rpx;
				text-align: end;
			}
		}
	}
</style>