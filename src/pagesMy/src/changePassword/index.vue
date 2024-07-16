<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="list flex-row justify-between items-center">
					<view>当前密码</view>
					<input type="text" v-model="nowpw" placeholder="请输入当前密码" />
				</view>
				<view class="list flex-row justify-between items-center">
					<view>新密码</view>
					<input type="password" v-model="newpw" placeholder="请输入新密码" />
				</view>
				<view class="list flex-row justify-between items-center" style="border:none">
					<view>确认密码</view>
					<input type="password" v-model="confirmpw" placeholder="再次输入密码" />
				</view>
			</view>
		</view>
		<view class="btn justify-center items-center" @click="changePassword">确认修改</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getFontSize } from '@/utils/local-storage'
	import { updatePassword } from '@/api/pagesMy/changePassword'

	// 根字体大小
	const baseFontSize = ref<number>(1)

	// 当前密码
	const nowpw = ref<string>('')
	// 新密码
	const newpw = ref<string>('')
	// 确认密码
	const confirmpw = ref<string>('')
	// 修改密码
	const changePassword = async () => {

		if (nowpw.value === '') {
			uni.showToast({
				title: '请输入当前密码',
				icon: 'none'
			})
		} else if (newpw.value === '') {
			uni.showToast({
				title: '请输入新密码',
				icon: 'none'
			})
		} else if (confirmpw.value === '') {
			uni.showToast({
				title: '请输入修改密码',
				icon: 'none'
			})
		} else if (newpw.value !== confirmpw.value) {
			uni.showToast({
				title: '新密码与确认密码不一致',
				icon: 'none'
			})
		} else {
			try {
				const res : any = await updatePassword({
					newPassword: newpw.value,
					originalPassword: nowpw.value
				})
				if(res.success) {
					uni.showToast({
						title: '修改密码成功',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			} catch (e) {
				//TODO handle the exception
			}
		}
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;

		.box {
			padding: 6rpx 24rpx;
			background: #FFFFFF;
			border-radius: $radius1;

			.list {
				padding: 34rpx 0;
				border-bottom: 2rpx solid #F5F5F5;
				font-size: $text4;
				color: $sbgcolor4;

				input {
					width: 500rpx;
					text-align: end;
					padding-left: 60rpx;
					box-sizing: border-box;
				}
			}
		}
	}

	.btn {
		padding: 24rpx 0;
		width: calc(100% - 48rpx);
		background-color: $sbgcolor1;
		border-radius: $radius2;
		font-size: $text5;
		color: #FFFFFF;
		line-height: $text5;
		position: fixed;
		left: 24rpx;
		bottom: 24rpx;
	}
</style>