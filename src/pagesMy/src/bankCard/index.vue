<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="row1 flex-col">
					<view>银行卡照片</view>
					<view v-if="modify">
						<SmtUpload :fileList="bankCardImg" @newFileList="newBankCard" :maxCount="1"
							:upStyle="upStyle" :uploadUrl="packApiUrl(bankCardUrl)" :custom="true">
							<image src="@/pagesMy/static/bank.png" mode="scaleToFill" :style="upStyle" />
						</SmtUpload>
					</view>
					<view v-else>
						<image :src="have(form.cardImage)?form.cardImage:'../../../static/image/defaultImg.png'" mode="aspectFit" :style="upStyle" ></image>
					</view>
				</view>
				<view class="row1 flex-row justify-between items-center">
					<view>用户名称</view>
					<view v-if="modify" class="text">
						<textarea v-model="sub.userName" 
											placeholder="请输入用户名称" 
											auto-height
											style="width: 420rpx;" />
						<!-- <input v-model="sub.userName" type="text" placeholder="请输入用户名称" /> -->
					</view>
					<view v-else class="text">{{form.userName}}</view>
				</view>
				<view class="row1 flex-row justify-between items-center">
					<view>银行卡号</view>
					<view v-if="modify" class="text">
						<textarea v-model="sub.bankAccount"
											placeholder="请输入银行卡号" 
											auto-height
											style="width: 420rpx;" />
					</view>
					<view v-else class="text">{{form.bankAccount}}</view>
				</view>
				<view class="row1 flex-row justify-between items-center">
					<view>银行名称</view>
					<view v-if="modify" class="text">
						<textarea v-model="sub.bankName"
											placeholder="请输入银行名称" 
											auto-height
											style="width: 420rpx;" />
					</view>
					<view v-else class="text">{{form.bankName}}</view>
				</view>
				<view class="row1 flex-row justify-between items-center">
					<view>开户行名称</view>
					<view v-if="modify" class="text">
						<textarea v-model="sub.bankBranchName"
											placeholder="请输入开户行名称" 
											auto-height
											style="width: 420rpx;" />
					</view>
					<view v-else class="text">{{form.bankBranchName}}</view>
				</view>
			</view>
			<view class="operation flex-row justify-between items-center">
				<view v-show="!modify" class="btn1 justify-center items-center" @click="goModify">修改</view>
				<view v-show="modify" class="btn2 justify-center items-center" @click="cancelModify">取消</view>
				<view v-show="modify" class="btn3 justify-center items-center" @click="submit">提交</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getFontSize, getAuthInfo } from '@/utils/local-storage'
	import { getUserBankInfoDetail, addUserBankInfo, updateUserBankInfo } from '@/api/pagesMy/bankCard'
	import SmtUpload from '@/components/smt-upload/index.vue'
	import { packApiUrl } from "@/config";

	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 是否已拥有银行卡信息
	const haveCard = ref<boolean>(false)
	// 修改？
	const modify = ref<boolean>(false)
	// 表单
	const form = ref<any>({
		bankAccount: "",
		bankBranchName: "",
		bankName: "",
		cardImage: null,
		id: 0,
		userName: "",
		userType: 1
	})
	// 修改的表单
	const sub = ref<any>({
		bankAccount: "",
		bankBranchName: "",
		bankName: "",
		cardImage: null,
		userName: "",
		userType: getAuthInfo().authType
	})
	
	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}
	
	// 银行卡照片
	const bankCardImg = ref<any>([])
	// 上传按钮宽高
	const upStyle = ref({
		width: '320rpx',
		height: '220rpx'
	})
	// 银行卡接口
	const bankCardUrl = '/user/recognize/v1/recognizeBankCard'
	// 上传银行卡照片
	const newBankCard = (a: any, b: any) => {
		// console.log(1,a,b);
		if (a.length === 0) {
			sub.value.cardImage = null
		} else {
			sub.value.cardImage = b[0].bankCardPath
		}
		sub.value.bankName = b[0].bankName
		sub.value.bankAccount = b[0].cardNumber
	}
	
	// 获取银行卡信息
	const getCardInfo = async () => {
		try {
			const res : any = await getUserBankInfoDetail()
			if (res.success) {
				if (res.data) {
					haveCard.value = true
					modify.value = false
					form.value = res.data
					sub.value.id = res.data.id
				} else {
					haveCard.value = false
					modify.value = true
				}
			} else {
				haveCard.value = false
				modify.value = true
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) {
			//TODO handle the exception
		}
	}
	
	// 点击修改
	const goModify = () => {
		// sub.value.bankAccount = form.value.bankAccount
		// sub.value.bankBranchName = form.value.bankBranchName
		// sub.value.bankName = form.value.bankName
		// sub.value.userName = form.value.userName
		sub.value.bankAccount = ''
		sub.value.bankBranchName = ''
		sub.value.bankName = ''
		sub.value.userName = ''
		modify.value = true
	}
	
	// 点击取消
	const cancelModify = () => {
		if(haveCard.value) {
			modify.value = false
		} else {
			uni.navigateBack({
				delta: 1
			});
		}
	}
	
	// 点击提交
	const submit = async () => {
		uni.showLoading({
			title: '提交中',
			mask: true
		})
		try{
			let res: any
			if(haveCard.value) {
				
				res = await updateUserBankInfo(sub.value)
			} else {
				res = await addUserBankInfo(sub.value)
			}
			if(res.success) {
				getCardInfo()
				uni.hideLoading();
				uni.showToast({
					title: '提交成功',
					icon: 'none'
				})
			} else{
				uni.hideLoading();
				uni.showToast({
					title: res.	msg,
					icon: 'none'
				})
			}
		}catch(e){
			//TODO handle the exception
		}
	}

	onLoad(() => {
		baseFontSize.value = getFontSize()
		getCardInfo()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;
		height: calc(100vh - $text5 - 144rpx);

		.box {
			padding: 0 24rpx;
			background: #FFFFFF;
			border-radius: $radius1;

			.row1 {
				padding: 24rpx 0;
				font-size: $title1;
				color: $sbgcolor4;
				border-bottom: 2rpx solid $sbgcolor7;

				.text {
					width: 420rpx;
					text-align: end;
				}

				input {
					font-size: $title1;
					text-align: end;
				}
			}
		}

		.operation {
			margin-top: 60rpx;

			.btn1 {
				padding: 24rpx 0;
				width: 100%;
				background: $sbgcolor1;
				border-radius: $radius2;
				font-size: $text4;
				color: #FFFFFF;
				line-height: $text4;
			}

			.btn2 {
				padding: 24rpx 0;
				width: calc(50% - 12rpx);
				background-color: #FFFFFF;
				border-radius: $radius3;
				border: 2rpx solid $sbgcolor1;
				color: $sbgcolor1;
				font-size: $text4;
				line-height: $text4;
			}

			.btn3 {
				padding: 24rpx 0;
				width: calc(50% - 12rpx);
				background-color: $sbgcolor1;
				border-radius: $radius3;
				color: #FFFFFF;
				font-size: $text4;
				line-height: $text4;
			}
		}
	}
</style>