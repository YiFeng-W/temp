<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<up-navbar title="我的" bgColor="transparent" :titleStyle="{color: '#FFFFFF',fontSize: '36rpx'}">
		<template #left></template>
	</up-navbar>
	<view class="padbg">
		<view class="top flex-col justify-end">
			<view class="flex-row">
				<image src="@/static/image/avatar.png" mode="scaleToFill" class="tx"></image>
				<view v-if="have(token)" class="flex-col justify-around">
					<view class="flex-row items-center">
						<view class="name">{{userInfo.nickName}}</view>
						<view class="type"
							:style="{backgroundColor: authInfo.authStatus === -1?'#FFC64B':authInfo.authStatus === 1?'#FFC64B':authInfo.authStatus === 2?'#FFC64B':'#FFC64B'}">
							{{authInfo.authStatus === -1?'认证失败':authInfo.authStatus === 1?'认证通过':authInfo.authStatus === 2?'待审核':'未认证'}}
						</view>
					</view>
					<view class="flex-row items-center">
						<view class="id">ID：{{userInfo.id}}</view>
						<image src="@/static/image/my/copy.png" mode="scaleToFill" class="copy" @click="copy"></image>
					</view>
				</view>
				<view v-else class="flex-col justify-center" @click="goLogin">
					<view class="login">登录/注册</view>
				</view>
			</view>
		</view>
		<view class="pd">
			<view class="box">
				<view class="row1 flex-row justify-between" @click="goAuth">
					<view>
						身份认证 <text v-if="have(token)"
							:style="{color: '#F04E51'}">({{authInfo.authStatus === -1?'认证失败':authInfo.authStatus === 1?'认证通过':authInfo.authStatus === 2?'待审核':'未认证'}})</text>
					</view>
					<up-icon name="arrow-right" color="#A0A0A0" size="28rpx"></up-icon>
				</view>
				<view class="row1 flex-row justify-between" @click="goPassword">
					<view>修改密码</view>
					<up-icon name="arrow-right" color="#A0A0A0" size="28rpx"></up-icon>
				</view>
				<!-- <view class="row1 flex-row justify-between" @click="goRise">
					<view>发票抬头</view>
					<up-icon name="arrow-right" color="#A0A0A0" size="28rpx"></up-icon>
				</view> -->
				<view class="row2 flex-row justify-between" @click="goBank">
					<view>银行信息</view>
					<up-icon name="arrow-right" color="#A0A0A0" size="28rpx"></up-icon>
				</view>
			</view>
			<view class="box" style="margin-top: 24rpx;">
				<view class="row1 flex-row justify-between">
					<view>联系电话</view>
					<view class="tel" @click="dial">400-8796-6020</view>
				</view>
				<button open-type="contact" class="row3 flex-row justify-between">
					<view>在线客服</view>
					<up-icon name="arrow-right" color="#A0A0A0" size="28rpx"></up-icon>
				</button>
			</view>
			<view v-show="have(token)"
						class="btn justify-center items-center" 
						@click="show = true">退出登录</view>
		</view>
		<up-popup :show="show" mode="center" bgColor="transparent">
			<view class="flex-col items-center popup">
				<view>确定退出当前登录账号吗？</view>
				<view class="flex-row justify-around tcbtn">
					<view class="justify-center items-center tcbtna" @click="show = false">暂不退出</view>
					<view class="justify-center items-center tcbtnb" @click="loginOut">确定</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getFontSize, getAuthInfo, getToken, getUserInfo, removeToken, removeUserInfo, removeAuthInfo } from '@/utils/local-storage'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 导航栏高度
	const barHeight = ref<any>(0)
	uni.getSystemInfo({
		success: function (info) {
			barHeight.value = info.statusBarHeight
		}
	});
	// 用户信息
	const userInfo = ref<any>()
	// 认证信息
	const authInfo = ref<any>()
	// token
	const token = ref<any>()
	// 显示弹窗
	const show = ref<boolean>(false)

	// 判断是否有值
	const have = (value : any) => {
		return value !== undefined && value !== null && value !== ''
	}
	
	// 复制用户id
	const copy = () => {
		uni.setClipboardData({
			data: getUserInfo().id,
			success: () => {
				uni.showToast({
					title: '复制成功',
					icon: 'none',
					duration: 2000
				});
			}
		})
	}
	
	// 拨号
	const dial = () => {
		uni.makePhoneCall({
			phoneNumber: '400-8796-6020' // 这里填入你要拨打的电话号码
		});
	}
	
	// 去登录
	const goLogin = () => {
		uni.navigateTo({
			url: '/pagesOther/src/login/index'
		});
	}

	// 跳转认证
	const goAuth = () => {
		if (have(token.value)) {
			if(authInfo.value.authStatus === 1) {
				uni.navigateTo({
					url: '/pagesMy/src/userInfo/authenticationInfo'
				});
			} else if (authInfo.value.authStatus === 2) {
				uni.showToast({
					title: '审核中',
					icon: 'none'
				})
			} else {
				uni.navigateTo({
					url: '/pagesMy/src/userInfo/improveInformation'
				});
			}
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	}
	// 跳转修改密码
	const goPassword = () => {
		if (have(token.value)) {
			uni.navigateTo({
				url: '/pagesMy/src/changePassword/index'
			});
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	}
	// 跳转发票抬头
	const goRise = () => {
		if (have(token.value)) {
			uni.navigateTo({
				url: '/pagesHome/src/invoicing/invoiceManage'
			});
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	}
	// 跳转银行信息
	const goBank = () => {
		if (have(token.value)) {
			if (authInfo.value.authStatus === 1) {
				uni.navigateTo({
					url: '/pagesMy/src/bankCard/index'
				});
			} else {
				uni.showToast({
					title: '请先通过认证',
					icon: 'none'
				})
			}
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	}
	// 退出登录
	const loginOut = () => {
		removeToken()
		removeUserInfo()
		removeAuthInfo()
		show.value = false
		uni.reLaunch({
			url: '/pages/index/index'
		});
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
		userInfo.value = getUserInfo()
		authInfo.value = getAuthInfo()
		token.value = getToken()
	})
</script>

<style lang="scss" scoped>
	.top {
		height: 272rpx;
		padding: 24rpx;
		background-image: url('@/static/image/my/bg.png');
		background-size: 100% 100%;
		color: #fff;

		.tx {
			width: 112rpx;
			height: 112rpx;
			border-radius: 50%;
			margin-right: 24rpx;
		}

		.name {
			font-size: $text2;
			line-height: $text2;
		}

		.type {
			padding: 2rpx 14rpx;
			font-size: $text1;
			line-height: $text2;
			border-radius: $radius6;
			margin-left: 14rpx;
		}

		.id {
			font-size: $text2;
			line-height: $text2;
		}

		.copy {
			width: 18rpx;
			height: 18rpx;
			margin-left: 12rpx;
		}

		.login {
			font-size: $text4;
			line-height: $text4;
		}
	}

	.pd {
		padding: 24rpx;

		.box {
			padding: 6rpx 24rpx;
			background-color: #fff;
			border-radius: $radius1;
			font-size: $text2;
			color: $sbgcolor4;

			.row1 {
				border-bottom: 2rpx solid $sbgcolor7;
				padding: 32rpx 0;
			}

			.row2 {
				padding: 32rpx 0;
			}

			.row3 {
				padding: 32rpx 0;
				margin: 0;
				line-height: normal;
				background-color: transparent;
				border: none;
				font-size: $text2;
			}

			button::after {
				border: none;
			}

			.tel {
				color: $sbgcolor1;
				font-size: $text3;
			}
		}

		.btn {
			background-color: $sbgcolor1;
			padding: 24rpx 0;
			margin: 60rpx 0;
			border-radius: $radius2;
			font-size: $text3;
			color: #FFFFFF;
			line-height: $text3;
		}
	}

	.popup {
		padding: 60rpx 52rpx;
		margin: 0 72rpx;
		background-color: #fff;
		width: 502rpx;
		border-radius: 16rpx;

		.tcbtn {
			margin-top: 48rpx;
			width: 100%;
		}

		.tcbtna {
			width: 224rpx;
			height: 72rpx;
			border-radius: 36rpx;
			border: 2rpx solid $sbgcolor1;
			font-weight: 500;
			font-size: $text4;
			color: $sbgcolor1;
		}

		.tcbtnb {
			width: 224rpx;
			height: 72rpx;
			border-radius: 36rpx;
			background: $sbgcolor1;
			font-weight: 500;
			font-size: $text4;
			color: #fff;
		}
	}
</style>