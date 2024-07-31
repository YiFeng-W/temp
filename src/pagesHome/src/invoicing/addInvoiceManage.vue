<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="tit">发票类型</view>
				<view class="btnBox flex-row">
					<view class="btna justify-center items-center" :class="form.type === 1 ? 'isBtn' : ''"
						@click="changeInvoiceType(1)">电子普通发票</view>
					<view class="btnb justify-center items-center" :class="form.type === 2 ? 'isBtn' : ''"
						@click="changeInvoiceType(2)">增值税专用发票</view>
				</view>
			</view>
			<view class="box">
				<view class="tit">发票抬头</view>
				<view class="btnBox flex-row" v-if="form.type === 1">
					<view class="btna justify-center items-center" :class="form.titleType === 2 ? 'isBtn' : ''"
						@click="changeInvoiceHeader(2)">企业</view>
					<view class="btnb justify-center items-center" :class="form.titleType === 1 ? 'isBtn' : ''"
						@click="changeInvoiceHeader(1)">个人</view>
				</view>
				<view class="form">
					<view class="flex-row justify-between row">
						<view class="rtit"><view class="mark">*</view>抬头名称</view>
						<view class="flex-row items-center">
							<input v-model="form.title" placeholder="请输入抬头名称" />
						</view>
					</view>
					<view v-if="form.titleType === 2" class="flex-row justify-between row">
						<view class="rtit"><view class="mark">*</view>纳税人识别号</view>
						<input v-model="form.creditCode" placeholder="请输入纳税人识别号" />
					</view>
					<view v-if="form.titleType === 2" class="flex-row justify-between row">
						<view class="rtit">公司地址</view>
						<input v-model="form.businessAddress" placeholder="请输入公司地址" />
					</view>
					<view class="flex-row justify-between row">
						<view class="rtit">电话号码</view>
						<input v-model="form.registeredPhone" placeholder="请输入电话号码" />
					</view>
					<view v-if="form.titleType === 2" class="flex-row justify-between row">
						<view class="rtit">开户银行</view>
						<input v-model="form.depositBank" placeholder="请输入开户银行" />
					</view>
					<view v-if="form.titleType === 2" class="flex-row justify-between row1">
						<view class="rtit">银行账户</view>
						<input v-model="form.bankAccount" placeholder="请输入银行账户" />
					</view>
				</view>
			</view>
			<view class="box">
				<view class="tit"><view class="mark">*</view>接收方式</view>
				<view class="form">
					<view class="flex-row justify-between row">
						<view class="rtit">电子邮箱</view>
						<input v-model="form.emailAddress" placeholder="请输入电子邮箱" />
					</view>
					<view class="flex-row justify-between row1">
						<view class="rtit">接收电话</view>
						<input v-model="form.phoneNumber" placeholder="请输入接收电话" />
					</view>
				</view>
			</view>
			<view v-if="form.type === 2" class="btn justify-center items-center"
				@click="showPopup = true">确认</view>
			<!-- 是否要固定底部提交按钮，配合.btn使用 -->
			<!-- <view class="box" style="margin-bottom: 104rpx;"> -->
			<view v-else class="btn justify-center items-center" @click="submit">确认</view>
		</view>
		<up-popup :show="showPopup" mode="bottom" overlayOpacity="0.6" closeOnClickOverlay @close="showPopup = false"
			round="16rpx">
			<view class="popupBox">
				<view class="flex-row justify-between">
					<view class=""></view>
					<view class="pTit">增值税专用发票抬头确认书</view>
					<up-icon name="close" color="#A0A0A0" size="18" @click="showPopup = false"></up-icon>
				</view>
				<view class="pContent">
					<view>
						根据国家税法及发票管理相关规定，任何单位和个人不得要求他人为自己开具与实际经营业务情况不符的增值税专用发票【包括并不限于（1）在没有货物采购或者没有接受应税劳务的情况下要求他人为自己开具数量或金额与实际情况不符的增值税专用发票；（2）虽有货物采购或者接受应税劳务但要求他人为自己开具数量或金额与实际情况不符的增值税专用发票】，否则属于“虚开增值税专用发票”
					</view>
					<view>我以充分了解上述各项相关国家税法和发票管理规定，并确认仅就我司实际购买商品或服务索取发票。如我司未按国家相关规定申请开具或使用增值税专用发票，由我司自行承担相应法律后果。</view>
				</view>
				<view class="pBtn justify-center items-center" @click="submit">我已阅读并同意</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	import { onLoad,onShow } from "@dcloudio/uni-app";
	import { getUserInvoiceTitleDetail, addUserInvoiceTitle, updateUserInvoiceTitle } from "@/api/pagesMy/invoicing";
	import { getFontSize } from '@/utils/local-storage'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)

	// 选中发票类型发生改变
	const changeInvoiceType = (e : number) => {
		form.value.type = e;
		if (form.value.type === 2) {
			form.value.titleType = 2
		}
	};

	// 选中发票抬头发生改变
	const changeInvoiceHeader = (e : number) => {
		form.value.titleType = e;
	};

	// 表单
	const form = ref<any>({
		bankAccount: "",
		businessAddress: "",
		creditCode: "",
		depositBank: "",
		emailAddress: "",
		phoneNumber: "",
		registeredPhone: "",
		title: "",
		titleType: 2,
		type: 1
	});

	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}

	// 抬头id 
	const headerId = ref<string>('')
	// 通过id获取form
	const getFormById = async () => {
		try {
			const res : any = await getUserInvoiceTitleDetail({
				id: headerId.value
			})
			if (res.success) {
				form.value = {
					bankAccount: res.data.bankAccount,
					businessAddress: res.data.businessAddress,
					creditCode: res.data.creditCode,
					depositBank: res.data.depositBank,
					emailAddress: res.data.emailAddress,
					id: res.data.id,
					phoneNumber: res.data.phoneNumber,
					registeredPhone: res.data.registeredPhone,
					remark: res.data.remark,
					title: res.data.title,
					titleType: res.data.titleType,
					type: res.data.type
				}
				
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
	const checkBank = (str: string) => {
		const reg = /^\d{8,26}$/
		return reg.test(str)
	}
	// 提交
	const submit = () => {
		if (!have(form.value.title)) {
			uni.showToast({
				title: '请输入抬头名称',
				icon: 'none'
			})
		} else if (!have(form.value.creditCode) && form.value.titleType === 2) {
			uni.showToast({
				title: '请输入纳税人识别号',
				icon: 'none'
			})
		} 
		// else if (!have(form.value.businessAddress) && form.value.titleType === 2) {
		// 	uni.showToast({
		// 		title: '请输入公司地址',
		// 		icon: 'none'
		// 	})
		// } 
		// else if (!have(form.value.registeredPhone)) {
		// 	uni.showToast({
		// 		title: '请输入电话号码',
		// 		icon: 'none'
		// 	})
		// } 
		else if (have(form.value.bankAccount) && !have(form.value.depositBank) && form.value.titleType === 2) {
			uni.showToast({
				title: '请输入开户银行',
				icon: 'none'
			})
		} 
		else if (have(form.value.bankAccount) && form.value.titleType === 2 && !checkBank(form.value.bankAccount)) {
			uni.showToast({
				title: '请输入合法的银行账户',
				icon: 'none'
			})
		} 
		else if (!have(form.value.emailAddress) && !have(form.value.phoneNumber)) {
			uni.showToast({
				title: '请输入接收方式',
				icon: 'none'
			})
		} 
		// else if (!have(form.value.phoneNumber)) {
		// 	uni.showToast({
		// 		title: '请输入接收电话',
		// 		icon: 'none'
		// 	})
		// } 
		else {
			if (have(headerId.value)) {
				modifyInvoiceHeader()
			} else {
				addInvoiceHeader()
			}
		}
	}

	// 新增发票抬头
	const addInvoiceHeader = async () => {
		try {
			const res : any = await addUserInvoiceTitle(form.value)
			if (res.success) {
				uni.navigateBack({
					delta: 1
				});
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

	// 修改发票抬头
	const modifyInvoiceHeader = async () => {
		try {
			const res : any = await updateUserInvoiceTitle(form.value)
			if (res.success) {
				uni.navigateBack({
					delta: 1
				});
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

	// 是否显示增值税提示
	const showPopup = ref<boolean>(false)

	onLoad((item : any) => {
		if (item.id) {
			headerId.value = item.id
			getFormById()
		}
	});
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.mark {
		color: red;
		display: inline
	}
	.pd {
		padding: 24rpx 24rpx 24rpx 24rpx;

		.box {
			padding: 24rpx;
			margin-bottom: 24rpx;
			background-color: #fff;
			border-radius: $radius1;

			.tit {
				font-weight: bold;
				font-size: $text2;
				color: $sbgcolor4;
			}

			.btnBox {
				margin-top: 24rpx;

				.btna {
					min-width: 176rpx;
					padding: 20rpx 14rpx;
					border-radius: 8rpx;
					border: 2rpx solid $sbgcolor5;
					font-size: $text2;
					color: #000000;
				}

				.btnb {
					min-width: 176rpx;
					margin-left: 34rpx;
					padding: 20rpx 14rpx;
					border-radius: 8rpx;
					border: 2rpx solid $sbgcolor5;
					font-size: $text2;
					color: #000000;
				}

				.isBtn {
					border: 2rpx solid $sbgcolor11;
					color: $sbgcolor11;
				}
			}

			.form {
				margin-top: 12rpx;

				.row {
					padding: 24rpx 0;
					border-bottom: 2rpx solid $sbgcolor7;
					font-size: $text2;
				}
				
				.row1 {
					padding-top: 24rpx;
					font-size: $text2;
				}
				
				.rtit {
					color: #000000;
				}
				
				input {
					width: 446rpx;
					text-align: end;
					font-size: $text2;
				}
				
				image {
					width: 36rpx;
					height: 36rpx;
				}
				
				.money {
					font-weight: bold;
					font-size: $text2;
					color: $sbgcolor4;
				
					text {
						font-weight: 500;
						font-size: $text1;
						color: $sbgcolor5;
					}
				}
			}
		}

		.btn {
			width: calc(100% - 48rpx);
			padding: 24rpx;
			background: $sbgcolor11;
			border-radius: $radius2;
			font-size: $text3;
			line-height: $text3;
			color: #ffffff;
			margin: 60rpx 0 72rpx 0;
		}
	}

	.popupBox {
		padding: 36rpx 24rpx;

		.pTit {
			font-weight: bold;
			font-size: $text3;
			color: #000000;
		}

		.pContent {
			font-size: $text2;
			color: $sbgcolor5;
			margin-top: 42rpx;
		}

		.pBtn {
			padding: 24rpx;
			background: $sbgcolor11;
			border-radius: $radius2;
			font-size: $text3;
			line-height: $text3;
			color: #FFFFFF;
			margin-top: 42rpx;
		}
	}
</style>