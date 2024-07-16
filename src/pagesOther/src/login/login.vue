<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<up-navbar title="" leftIcon="close" :autoBack="true" bgColor="#2BAE85" leftIconColor="#fff">
	</up-navbar>
	<view class="box">
		<view class="bg" :style="{marginTop: barHeight + 44 + 'px'}">
			<view class="tit justify-center">账号注册</view>
			<view class="form">
				<view class="flex-row justify-between items-center line">
					<u-input type="number" v-model="userInfo.phoneNumber" placeholder="请输入手机号码" border="none"
						@change="changeTel"></u-input>
				</view>
				<view class="flex-row justify-between items-center line">
					<view v-show="passState === 'password'" style="width: 100%;">
						<u-input type="password" v-model="userInfo.password" placeholder="请输入密码" border="none">
							<template #suffix>
								<up-icon name="eye" size="20" @click="changePassState"></up-icon>
							</template>
						</u-input>
					</view>
					<view v-show="passState === 'text'" style="width: 100%;">
						<u-input type="text" v-model="userInfo.password" placeholder="请输入密码" border="none">
							<template #suffix>
								<up-icon name="eye-fill" size="20" @click="changePassState"></up-icon>
							</template>
						</u-input>
					</view>
					<!-- <image :src="passImg" mode="scaleToFill" class="showHide" @click="changePassState" /> -->
				</view>
				<view class="flex-row justify-between items-center line">
					<view v-show="isPassState === 'password'" style="width: 100%;">
						<u-input type="password" v-model="userInfo.confirmPassword" placeholder="请再次输入密码" border="none">
							<template #suffix>
								<up-icon name="eye" size="20" @click="isChangePassState"></up-icon>
							</template>
						</u-input>
					</view>
					<view v-show="isPassState === 'text'" style="width: 100%;">
						<u-input type="text" v-model="userInfo.confirmPassword" placeholder="请再次输入密码" border="none">
							<template #suffix>
								<up-icon name="eye-fill" size="20" @click="isChangePassState"></up-icon>
							</template>
						</u-input>
					</view>
				</view>
				<view class="flex-row justify-between items-center line">
					<u-input v-model="userInfo.code" placeholder="请输入验证码" border="none" maxlength="6"></u-input>
					<view @tap="getCode" class="justify-center" :class="disabled ? 'codeBtna' : 'codeBtnb'">{{ tips }}</view>
				</view>
			</view>
			<view>
				<view class="submit justify-center items-center" @click="submit">立即注册</view>
				<view class="goLogin" @click="goLogin">已有账号去登录</view>
				<view class="	justify-center items-center protocol">
					<up-checkbox-group placement="column" v-model="checkbox" @change="change" shape="circle" size="32rpx">
						<up-checkbox :name="isAgree">
						</up-checkbox>
					</up-checkbox-group>
					<text class="text">已阅读并同意</text>
					<text class="url" @click="goProtocol(1)">《服务协议》</text>
					<text class="url" @click="goProtocol(2)">《隐私政策》</text>
				</view>
			</view>
		</view>
	</view>
	<up-popup :show="show" mode="center" bgColor="transparent">
		<view class="popup">
			<view class="tit">服务协议及隐私政策</view>
			<view class="content">
				请您认真阅读<text @click="goProtocol(1)">《服务协议》</text>和<text
					@click="goProtocol(2)">《隐私政策》</text>的全部内容，同意并接受全部条款后开始使用我们的产品和服务。若选择不同意，将无法使用我们的产品和服务，并会退出应用。</view>
			<view class="flex-row justify-around btn">
				<view class="justify-center items-center btn-not" @click="show === false">不同意</view>
				<view class="justify-center items-center btn-is" @click="changeAgree">同意</view>
			</view>
		</view>
	</up-popup>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { getFontSize } from '@/utils/local-storage'
	import { sendCode, userRegister } from '@/api/pagesOther/login'
	import { encrypt } from '@/utils/jsencrypt'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	const tit = ref<string>('')
	const userInfo = ref<{
		code : string;
		password : string;
		phoneNumber : string;
		userType : number;
		confirmPassword : string;
		buyerOrSeller : number
	}>({
		code: '',
		password: '',
		phoneNumber: '',
		userType: 1,
		confirmPassword: '',
		buyerOrSeller: 1
	})

	// 导航栏高度
	const barHeight = ref<any>(0)

	onLoad((e : any) => {
		uni.getSystemInfo({
			success: function (info) {
				barHeight.value = info.statusBarHeight
			}
		});
		userInfo.value.userType = Number(e.userType)
		userInfo.value.buyerOrSeller = Number(e.buyerOrSeller)
	})

	// 验证手机号码
	const correctTel = (e : string) => {
		const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
		if (reg.test(e)) {
			return true
		} else {
			return false
		}
	}

	// 验证码
	const countDown = ref<number>(60)
	const tips = ref<string>('点击获取')
	const disabled = ref<boolean>(false)
	const timer = ref<any>(null)
	const changeTel = (e : any) => {
		disabled.value = correctTel(e)
	}
	const getCode = async () => {
		if (disabled.value) {
			uni.showLoading({
				title: '正在获取验证码'
			})
			await sendCode({
				phoneNumber: userInfo.value.phoneNumber
			}).then((e : any) => {
				uni.hideLoading();
				uni.$u.toast('验证码已发送');
				if (timer.value) return
				timer.value = setInterval(() => {
					if (countDown.value > 0) {
						countDown.value--
						tips.value = `${countDown.value}秒后重新获取`
						disabled.value = false
					} else {
						restGetCode()
					}
				}, 1000)
			}).catch((e : any) => {
				uni.hideLoading();
			})
		} else {
			uni.$u.toast('请输入正确的手机号码');
		}
	}
	const restGetCode = () => {
		clearInterval(timer.value)
		timer.value = null
		countDown.value = 60
		tips.value = '获取验证码'
		disabled.value = correctTel(userInfo.value.phoneNumber)
	}

	// 显示隐藏密码
	const showPass = ref<boolean>(false)
	const passState = ref<string>('password')
	const changePassState = () => {
		showPass.value = !showPass.value
		if (showPass.value) {
			passState.value = 'text'
		} else {
			passState.value = 'password'
		}
	}
	const isShowPass = ref<boolean>(false)
	const isPassState = ref<string>('password')
	const isPassImg = ref<string>('../../pagesOther/static/hide.png')
	const isChangePassState = () => {
		isShowPass.value = !isShowPass.value
		if (isShowPass.value) {
			isPassState.value = 'text'
			isPassImg.value = '../pagesOther/static/show.png'
		} else {
			isPassState.value = 'password'
			isPassImg.value = '../pagesOther/static/hide.png'
		}
	}

	// 用户协议
	const show = ref<boolean>(false)
	const checkbox = ref<any>([])
	const agree = ref<boolean>(false)
	const isAgree = ref<boolean>(true)
	const change = (e : any) => {
		if (e[0]) {
			agree.value = e[0]
		} else {
			agree.value = false
		}
	}
	const changeAgree = () => {
		checkbox.value.push(true)
		agree.value = true
		show.value = false
	}

	// 查看协议
	const goProtocol = (e : number) => {
		uni.navigateTo({
			url: '/pagesOther/src/protocol/index?id=' + e
		});
	}

	// 去登录
	const goLogin = () => {
		uni.navigateBack({
			delta: 1
		});
	}

	// 提交注册
	const submit = async () => {
		if (!correctTel(userInfo.value.phoneNumber)) return uni.$u.toast('请输入正确的手机号码');
		if (userInfo.value.password === '') return uni.$u.toast('请输入密码');
		if (userInfo.value.confirmPassword === '') return uni.$u.toast('请再次输入密码');
		if (userInfo.value.password !== userInfo.value.confirmPassword) return uni.$u.toast('两次输入的密码不一致');
		if (userInfo.value.code === '') return uni.$u.toast('请输入验证码');
		if (agree.value) {
			uni.showLoading({
				title: '登录中'
			});
			const res : any = await userRegister({
				code: userInfo.value.code,
				password: encrypt(userInfo.value.password),
				phoneNumber: userInfo.value.phoneNumber,
				userType: userInfo.value.userType,
				buyerOrSeller: userInfo.value.buyerOrSeller
			})
			if (res.success) {
				uni.hideLoading();
				uni.showToast({
					title: '注册成功,即将跳转登录页面登录',
					duration: 3000,
					mask: true
				});
				setTimeout(() => {
					goLogin()
				}, 3000)
			} else {
				uni.hideLoading();
				uni.$u.toast(res.msg);
			}
		} else {
			uni.$u.toast('请勾选');
			show.value = true
		}
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.box {
		padding: 32rpx 24rpx;
		font-size: $text3;
		background-color: $sbgcolor1;

		.bg {
			padding: 56rpx;
			background-color: #fff;
			border-radius: 40rpx;
			width: calc(100% - 112rpx);

			.tit {
				font-weight: 500;
				color: $sbgcolor1;
				font-size: $title3;
			}

			.form {
				margin-top: 44rpx;

				.line {
					padding: 76rpx 0rpx 24rpx 0rpx;
					border-bottom: 2rpx solid $sbgcolor6;

					.codeBtna {
						padding: 6rpx 16rpx;
						border: 2rpx solid $sbgcolor1;
						border-radius: 30rpx;
						font-size: $text2;
						color: $sbgcolor1;
					}

					.codeBtnb {
						padding: 6rpx 16rpx;
						border: 2rpx solid $sbgcolor5;
						border-radius: 30rpx;
						font-size: $text2;
						color: $sbgcolor5;
					}

					.showHide {
						width: 44rpx;
						height: 44rpx;
					}
				}
			}
		}

		.submit {
			margin-top: 172rpx;
			background-color: $sbgcolor1;
			height: 84rpx;
			border-radius: 76rpx;
			font-size: $text5;
			color: #fff;
		}

		.goLogin {
			margin-top: 48rpx;
			font-size: $text2;
			color: $sbgcolor1;
			font-weight: 800;
		}

		.protocol {
			margin-top: 300rpx;
			font-size: 12rem;

			.text {
				color: $sbgcolor5;
			}

			.url {
				color: $sbgcolor4;
				font-weight: bold;
			}
		}
	}

	.popup {
		margin: 0 72rpx;
		padding: 36rpx 30rpx;
		background-color: #fff;
		border-radius: 16rpx;

		.tit {
			font-weight: 500;
			font-size: $text4;
			color: $sbgcolor4;
			text-align: center;
		}

		.content {
			font-weight: 500;
			font-size: $text3;
			color: $sbgcolor5;
			margin-top: 34rpx;

			text {
				color: $sbgcolor4;
			}
		}

		.btn {
			margin-top: 34rpx;
			font-size: $text4;

			&-not {
				width: 224rpx;
				height: 72rpx;
				border-radius: 36rpx;
				border: 2rpx solid $sbgcolor1;
				color: $sbgcolor1;
			}

			&-is {
				width: 224rpx;
				height: 72rpx;
				background: $sbgcolor1;
				border-radius: 36rpx;
				color: #fff;
			}
		}
	}
</style>