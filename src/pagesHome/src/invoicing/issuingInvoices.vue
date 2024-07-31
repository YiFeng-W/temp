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
							<view style="width: 50rpx;" class="justify-center items-center" @click="showHeader">
								<image src="@/static/image/right-arrow.png" mode="scaleToFill"></image>
							</view>
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
				<view class="flex-row justify-between row2">
					<view class="rtit">发票金额</view>
					<view class="money">{{ form.invoiceAmount }}<text>元</text></view>
				</view>
			</view>
			<view class="box">
				<view class="tit"><view class="mark">*</view>接收方式</view>
				<view class="form">
					<view class="flex-row justify-between row">
						<view class="rtit">电子邮箱</view>
						<input v-model="form.emailAddress" placeholder="请输入电子邮箱" />
					</view>
					<view class="flex-row justify-between row">
						<view class="rtit">接收电话</view>
						<input v-model="form.phoneNumber" placeholder="请输入接收电话" />
					</view>
				</view>
			</view>
			<view v-if="form.type === 2" class="btn justify-center items-center" @click="showPopup = true">确认</view>
			<!-- 是否要固定底部提交按钮，配合.btn使用 -->
			<!-- <view class="box" style="margin-bottom: 104rpx;"> -->
			<view v-else class="btn justify-center items-center" :class="forbidden?'forbidden':''" @click="submit">确认</view>
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
				<view class="pBtn justify-center items-center" :class="forbidden?'forbidden':''" @click="submit">我已阅读并同意</view>
			</view>
		</up-popup>
		<up-popup :show="headerPopup" mode="bottom" overlayOpacity="0.6" closeOnClickOverlay @close="headerPopup = false"
			round="16rpx">
			<view class="popupBox">
				<view class="flex-row justify-between">
					<view class=""></view>
					<view class="pTit">抬头选择</view>
					<up-icon name="close" color="#A0A0A0" size="18" @click="headerPopup = false"></up-icon>
				</view>
				<scroll-view scroll-y :lower-threshold="10" @scrolltolower="scrolltolower" :style="{height: '70vh'}"
					v-if="headerList.length !== 0">
					<view class="hform">
						<view class="hbox" v-for="(item,id) in headerList" :key="id" @click="choiceHeader(item)">
							<view class="htit flex-row justify-between items-center">
								<view style="font-weight: bold;">{{item.type===1?'电子普通发票':'增值税专用发票'}}-{{item.titleType===1?'个人':'企业'}}
								</view>
								<!-- <view class="flex-row items-center">
									<view style="color: #E54043;" @click="deletePrompt(item.id)">删除</view>&ensp;&ensp;&ensp;
									<view style="color: #A0A0A0;" @click="goEdit(item.id)">编辑</view>
								</view> -->
							</view>
							<view v-if="item.titleType === 2">{{item.title}}</view>
							<view v-if="item.titleType === 2" style="margin-top: 24rpx;color: #A0A0A0;">税号:{{item.creditCode}}</view>
							<view v-if="item.titleType === 1">{{item.title}}</view>
						</view>
					</view>
					<view v-if="showMore">
						<uni-load-more :status="moreStatus"></uni-load-more>
					</view>
				</scroll-view>
				<view style="height: 70vh;" v-if="headerList.length===0">
					<voidPrompt></voidPrompt>
				</view>
				<view class="pBtn justify-center items-center" @click="goHeader">管理发票抬头</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from "vue";
	import { onLoad,onShow } from "@dcloudio/uni-app";
	import { issuEvoice, reIssuEvoice } from "@/api/pagesMy/invoicing";
	import { getQrOrderDetail } from "@/api/pagesHome/iWantToSellGoods/index";
	import { getUserInvoiceTitleList } from '@/api/pagesMy/invoicing'
	import { getUserInfo,getFontSize } from "@/utils/local-storage";
	import voidPrompt from '@/components/void-prompt/index.vue'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 携带的参数ids
	const ids = ref<any>([])
	// 订单类型
	const type = ref<number>(1)
	// 用户信息
	const userInfo = getUserInfo();

	// 表单
	const form = ref<any>({
		bankAccount: '',
		businessAddress: '',
		checkStatus: '1',
		creditCode: '',
		depositBank: '',
		emailAddress: '',
		invoiceAmount: 0,
		phoneNumber: '',
		productRelations: [],
		registeredPhone: '',
		remark: '',
		title: '',
		titleType: 2,
		type: 1,
		userId: userInfo.id,
	});

	// 选中为个人时时清空非个人字段数据
	const emptyEnterprise = () => {
		form.value.creditCode = ''
		form.value.businessAddress = ''
		form.value.depositBank = ''
		form.value.bankAccount = ''
	}

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

	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}

	// 是否显示抬头选择
	const headerPopup = ref<boolean>(false)
	// 发票抬头列表
	const headerList = ref<any>([])
	// 打开发票抬头
	const showHeader = () => {
		headerPopup.value = true
		headerList.value = []
		page.value = 1
		getHeaderList()
	}
	// 获取发票抬头列表
	const page = ref<number>(1)
	const pageSize = ref<number>(20)
	const totalPage = ref<number>(0)
	const getHeaderList = async () => {
		try {
			const res : any = await getUserInvoiceTitleList({
				page: page.value,
				pageSize: pageSize.value,
				title: ""
			})
			if (res.success) {
				totalPage.value = Math.ceil(res.data.total / pageSize.value)
				res.data.records.forEach((item : any) => {
					headerList.value.push(item)
				})
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				page.value--
			}
			if (totalPage.value === page.value) {
				moreStatus.value = 'noMore'
				showMore.value = true
			} else {
				moreStatus.value = 'more'
				showMore.value = false
			}
		} catch (e) {
			moreStatus.value = 'more'
			showMore.value = false
		}
	}
	// 是否显示加载状态
	const showMore = ref<boolean>(false)
	// 加载状态
	const moreStatus = ref<string>('more')
	// 页面触底触发
	const scrolltolower = () => {
		if (totalPage.value <= page.value) {
			showMore.value = true
			moreStatus.value = 'noMore'
		} else {
			page.value++
			moreStatus.value = 'loading'
			showMore.value = true
			getHeaderList()
		}
	}
	// 选中抬头
	const choiceHeader = (item : any) => {
		form.value.bankAccount = item.bankAccount
		form.value.businessAddress = item.businessAddress
		form.value.creditCode = item.creditCode
		form.value.depositBank = item.depositBank
		form.value.emailAddress = item.emailAddress
		form.value.phoneNumber = item.phoneNumber
		form.value.registeredPhone = item.registeredPhone
		form.value.title = item.title
		form.value.titleType = item.titleType
		form.value.type = item.type
		headerPopup.value = false
	}
	// 跳转抬头管理页面
	const goHeader = () => {
		headerPopup.value = false
		uni.navigateTo({
			url: `/pagesHome/src/invoicing/invoiceManage`,
		});
	}

	// 根据id获取订单信息
	const getOrderInfo = async (data : any) => {
		try {
			const res : any = await getQrOrderDetail(data);
			if (res.success) {
				form.value.invoiceAmount += res.data.productTotalPrice;
				if (type.value === 1) {
					form.value.productRelations.push({
						// applyId: 0,
						categoryId: res.data.qrcodeOrderVO.categoryId,
						categoryName: res.data.qrcodeOrderVO.categoryName,
						// id: res.data.number,
						// itemNumber: res.data.number,
						orderNumber: res.data.number,
						orderType: res.data.type,
						productAmount: res.data.productTotalPrice,
						productId: res.data.qrcodeOrderVO.productId,
						productName: res.data.productName,
						productNumber: res.data.qrcodeOrderVO.usageQuantity,
						// productTaxRate: 0.03,
						productUnit: 0,
						productUnitPrice: res.data.qrcodeOrderVO.productUnitPrice,
						// taxCategoryCode: "",
						// taxCategoryName: ""
					})
				} else {
					res.data.productListVO.forEach((item : any) => {
						form.value.productRelations.push({
							// applyId: 0,
							categoryId: item.categoryId,
							categoryName: item.categoryName,
							// id: res.data.number,
							// itemNumber: res.data.number,
							orderNumber: res.data.number,
							orderType: res.data.type,
							productAmount: item.productTotalPrice,
							productId: item.productId,
							productName: item.productName,
							productNumber: item.productNumber,
							// productTaxRate: 0.03,
							productUnit: item.productUnit,
							productUnitPrice: item.productUnitPrice,
							// taxCategoryCode: "",
							// taxCategoryName: ""
						})
					})
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
	
	// 提交时禁用按钮？
	const forbidden = ref<boolean>(false)

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
			if (form.value.titleType === 1) {
				emptyEnterprise()
			}
			uni.showLoading({
				title: '订单提交中',
				mask: true
			});
			forbidden.value = true
			if (have(form.value.id)) {
				reissueInvoice()
			} else {
				drawABill()
			}
			showPopup.value = false
		}
	}

	// 开发票
	const drawABill = async () => {
		try {
			const res : any = await issuEvoice(form.value)
			if (res.success) {
				uni.hideLoading();
				forbidden.value = false
				uni.redirectTo({
					url: `/pagesHome/src/invoicing/issuApplySuccessful`,
				});
			} else {
				uni.hideLoading();
				forbidden.value = false
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) {
			//TODO handle the exception
		}
	}

	// 重开发票
	const reissueInvoice = async () => {
		try {
			const res : any = await reIssuEvoice(form.value)
			if (res.success) {
				uni.hideLoading();
				forbidden.value = false
				uni.redirectTo({
					url: `/pagesHome/src/invoicing/issuApplySuccessful`,
				});
			} else {
				uni.hideLoading();
				forbidden.value = false
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
		console.log(1, item);
		if (item.id) {
			form.value.type = item.type;
			form.value.titleType = item.titleType;
			form.value.title = item.title;
			form.value.creditCode = item.creditCode;
			form.value.businessAddress = item.businessAddress;
			form.value.registeredPhone = item.registeredPhone;
			form.value.depositBank = item.depositBank;
			form.value.bankAccount = item.bankAccount;
			form.value.emailAddress = item.emailAddress;
			form.value.phoneNumber = item.phoneNumber;
			form.value.invoiceAmount = item.invoiceAmount;
			form.value.id = item.id;
			form.value.titleType = Number(item.titleType);
			form.value.type = Number(item.type);
		} else {
			type.value = Number(item.type)
			if (item.ids.includes(",")) {
				ids.value = item.ids.split(",");
			} else {
				ids.value.push(item.ids);
			}
			ids.value.forEach((item : any) => {
				getOrderInfo({ orderId: item });
			});
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
					padding: 20rpx 14rpx;
					border-radius: 8rpx;
					border: 2rpx solid $sbgcolor5;
					font-size: $text2;
					line-height: $text2;
					color: #000000;
				}

				.btnb {
					margin-left: 34rpx;
					padding: 20rpx 14rpx;
					border-radius: 8rpx;
					border: 2rpx solid $sbgcolor5;
					font-size: $text2;
					line-height: $text2;
					color: #000000;
				}

				.isBtn {
					border: 2rpx solid $sbgcolor11;
					color: $sbgcolor11;
				}
			}

			.form {
				margin-top: 12rpx;
			}
			
			.row {
				padding: 24rpx 0;
				border-bottom: 2rpx solid $sbgcolor7;
				font-size: $text2;
			}
			
			.row1 {
				padding-top: 24rpx;
				font-size: $text2;
			}
			
			.row2 {
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
					font-weight: normal;
					font-size: $text1;
					color: $sbgcolor5;
				}
			}
		}

		.btn {
			// width: calc(100% - 48rpx);
			padding: 24rpx 0;
			background: $sbgcolor11;
			border-radius: $radius2;
			font-size: $text3;
			line-height: $text3;
			color: #ffffff;
			margin: 60rpx 0rpx 72rpx 0rpx;
		}
	}

	.popupBox {
		padding: 36rpx 24rpx;

		.pTit {
			font-weight: bold;
			font-size: $text2;
			color: #000000;
		}

		.pContent {
			font-size: $text2;
			color: $sbgcolor5;
			margin-top: 42rpx;
		}

		.hform {
			padding: 24rpx;

			.hbox {
				padding: 24rpx;
				background-color: #fff;
				border-radius: $radius1;
				font-size: $text2;

				.htit {
					padding-bottom: 24rpx;
					border-bottom: 2rpx solid $sbgcolor7;
				}
			}
		}

		.pBtn {
			padding: 24rpx 0;
			background: $sbgcolor11;
			border-radius: $radius2;
			font-size: $text3;
			line-height: $text3;
			color: #FFFFFF;
			margin-top: 42rpx;
		}
	}
</style>