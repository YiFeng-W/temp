<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<up-navbar title="" :autoBack="true" bgColor="#2BAE85" leftIconColor="#fff">
		</up-navbar>
		<view class="bg" :style="{paddingTop: barHeight+56+'px',minHeight: 'calc(100vh - 24rpx - 56px - '+barHeight+'px)'}">
			<view class="box flex-col justify-center">
				<view v-show="type" class="pd role">
					<view class="tit">用户角色选择</view>
					<view class="content" v-for="item in role" :key="item.id" @click="changeIsRole(item.id)">
						<view class="btn justify-center items-center">{{item.btnName}}</view>
					</view>
				</view>
				<view v-show="!type" class="pd role">
					<view class="tit">{{isRole === 1?'买家身份选择':'卖家身份选择'}}</view>
					<view class="content" v-for="item in isRole === 1?identitya:identityb" :key="item.id" @click="go(item.id)">
						<view class="cTit flex-row items-center">
							<image src="@/pagesOther/static/Frame.png" mode="scaleToFill"></image>
							<view>{{item.tit}}</view>
						</view>
						<view class="btn justify-center items-center">{{item.btnName}}</view>
					</view>
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
	// 目前选择类型
	const type = ref<boolean>(true)
	// 导航栏高度
	const barHeight = ref<any>(0)
	uni.getSystemInfo({
		success: function (info) {
			barHeight.value = info.statusBarHeight
		}
	});

	// 角色
	const role = ref<{ id : number; btnName : string; }[]>([{
		id: 1,
		btnName: '我是买家'
	}, {
		id: 2,
		btnName: '我是卖家'
	}])
	// 选中角色
	const isRole = ref<number>()
	// 选择角色
	const changeIsRole = (e : number) => {
		isRole.value = e
		type.value = false
	}

	// 买家身份
	const identitya = ref<{ id : number; tit : string; btnName : string; }[]>([{
		id: 2,
		tit: '收购/大宗购买企业用户请选择',
		btnName: '企业用户'
	}, {
		id: 1,
		tit: '购买农产品的个人用户请选择',
		btnName: '个人用户'
	}])
	// 卖家身份
	const identityb = ref<{ id : number; tit : string; btnName : string; }[]>([{
		id: 3,
		tit: '农产品种植销售用户请选择',
		btnName: '种植户'
	}, {
		id: 2,
		tit: '收购/大宗购买企业用户请选择',
		btnName: '企业用户'
	}, {
		id: 4,
		tit: '线下交易市场卖家用户请选择',
		btnName: '线下交易市场商户'
	}])
	// 选择身份
	const go = (e : number) => {
		uni.navigateTo({
			url: '/pagesOther/src/login/login?buyerOrSeller=' + isRole.value + '&userType=' + e
		});
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.bg {
		background-color: $sbgcolor1;
		padding: 0rpx 24rpx 24rpx 24rpx;

		.box {
			background-color: #fff;
			border-radius: $radius2;
			height: calc(100vh - 200rpx);

			.pd {
				padding: 70rpx;
			}

			.tit {
				font-weight: 500;
				font-size: $title3;
				color: $sbgcolor1;
				text-align: center;
				margin-bottom: 86rpx;
			}

			.cTit {
				margin-bottom: 28rpx;

				image {
					width: 40rpx;
					height: 40rpx;
				}

				view {
					font-weight: 500;
					font-size: $text4;
					color: $sbgcolor4;
				}
			}

			.btn {
				height: 88rpx;
				background: rgba(255, 206, 207, 0.3);
				border-radius: $radius3;
				font-weight: 500;
				font-size: $text3;
				color: $sbgcolor1;
				margin-bottom: 40rpx;
			}
		}
	}
</style>