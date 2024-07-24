<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="row flex-row items-center justify-between">
					<view class="tit">订单号</view>
					<view class="rinput justify-end">
						<text>{{form.number}}</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">商品名称</view>
					<view class="rinput justify-end">
						<text>{{form.productName}}</text>
					</view>
				</view>
				<view class="row">
					<view class="flex-row items-center justify-between">
						<view class="tit">分类名称</view>
						<view class="rinput justify-end">
							<text>{{ form.qrcodeOrderVO.categoryName }}</text>
						</view>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">橡胶类型</view>
					<view class="rinput justify-end">
						<text>{{form.orderRubberExtendVO.rubberType===1?'胶水':'胶块'}}</text>
					</view>
				</view>
				<view v-if="form.orderRubberExtendVO.rubberType===1" class="row flex-row items-center justify-between">
					<view class="tit">干含比</view>
					<view class="rinput justify-end">
						<text>{{form.dryWater}}%</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">数量</view>
					<view class="rinput flex-row items-center justify-end">
						<text>{{form.qrcodeOrderVO.usageQuantity}}</text>
						<text style="width: 110rpx;text-align: end;">公斤</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">单价</view>
					<view class="rinput flex-row items-center justify-end">
						<text>{{form.qrcodeOrderVO.productUnitPrice}}</text>
						<text style="width: 160rpx;text-align: end;">元/公斤</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">货品金额</view>
					<view class="rinput flex-row items-center justify-end">
						<text>{{ form.productTotalPrice }}</text>
						<text style="width: 80rpx;text-align: end;">元</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">订单金额</view>
					<view class="rinput flex-row items-center justify-end">
						<text>{{ form.paymentTotalAmount }}</text>
						<text style="width: 80rpx;text-align: end;">元</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">创建时间</view>
					<view class="rinput flex-row items-center justify-end">
						<text>{{ form.createTime }}</text>
					</view>
				</view>
				<view class="row">
					<view class="tit">货物照片</view>
				</view>
				<SmtUpload v-if="form.orderRubberExtendVO.checkStatus === 1" :fileList="goodsFileList" @newFileList="newGoodsFileList"
					:maxCount="10" :upStyle="upStyle">
				</SmtUpload>
				<view v-else class="row">
					<u-album v-if="have(form.qrcodeOrderVO.productImage)" :urls="form.qrcodeOrderVO.productImage"
						multipleSize="70" singleSize="70"></u-album>
				</view>
			</view>
			<view class="box" style="margin-top: 24rpx;">
				<view class="row">
					<view class="tit">支付凭证</view>
				</view>
				<SmtUpload v-if="form.orderRubberExtendVO.checkStatus === 1" :fileList="voucherFileList" @newFileList="newVoucherFileList"
					:maxCount="10" :upStyle="upStyle">
				</SmtUpload>
				<view v-else class="row">
					<u-album v-if="have(form.orderRubberExtendVO.payImage)" :urls="form.orderRubberExtendVO.payImage"
						multipleSize="70" singleSize="70"></u-album>
				</view>
			</view>
			<view v-if="buyerOrSeller === 2" class="box" style="margin-top: 24rpx;">
				<view class="row flex-row items-center justify-between">
					<view class="tit">买家</view>
					<view>{{form.buyerName}}</view>
				</view>
			</view>
			<view v-else class="box" style="margin-top: 24rpx;">
				<view class="row flex-row items-center justify-between">
					<view class="tit">卖家</view>
					<view v-if="form.sellerId">{{form.sellerName}}</view>
					<view v-else class="flex-row items-center justify-end rinput">
						扫码自动识别&emsp13;
						<image src="@/pagesHome/static/scanCode.png" mode="scaleToFill" style="width: 20px;height: 20px;"
							@click="scanTheCode"></image>
					</view>
				</view>
			</view>
			<view class="protocol1" v-if="form.orderRubberExtendVO.checkStatus === 2 && form.sellerName === currentUserName">
				<view class="flex-row justify-center items-center">
					<up-checkbox-group v-model="checkboxValue" shape="circle">
						<up-checkbox :name="true"></up-checkbox>
					</up-checkbox-group>
					<view>阅读并同意<text @click="goProtocol(3)">《璟橡农产品交易协议》</text></view>
				</view>
			</view>
			<view class="protocol1" v-if="form.orderRubberExtendVO.checkStatus === 1 && buyerOrSeller !== 2">
				<view class="flex-row justify-center items-center">
					<up-checkbox-group v-model="checkboxValue" shape="circle">
						<up-checkbox :name="true"></up-checkbox>
					</up-checkbox-group>
					<view>阅读并同意<text @click="goProtocol(4)">《璟橡农产品采购协议》</text></view>
				</view>
			</view>
			<view class="function">
				<view v-if="form.orderRubberExtendVO.checkStatus === 2 && form.sellerName === currentUserName" class="btn items-center justify-center" @click="showPopup">确认收款</view>
				<!-- <view v-if="form.orderRubberExtendVO.checkStatus === 1 && buyerOrSeller !== 2" class="btn items-center justify-center" @click="showPopup">线下支付</view> -->
				<view v-if="form.orderRubberExtendVO.checkStatus === 1 && buyerOrSeller !== 2" class="flex-row justify-between">
					<view class="btn1 items-center justify-center" @click="binding">线上支付</view>
					<view class="btn2 items-center justify-center" @click="showPopup">线下支付</view>
				</view>
			</view>
		</view>
		<up-popup :show="show" mode="center" bgColor="transparent">
			<view class="popup flex-col">
				<view class="text">{{tipsText}}</view>
				<view class="operate flex-row justify-around items-center">
					<view class="justify-center items-center" :class="buyerOrSeller===2?'btna1':'btnb1'" @click="show = false">取消</view>
					<view class="justify-center items-center" :class="buyerOrSeller===2?'btna2':'btnb2'" @click="payEnd">确认</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getFontSize, getUserInfo } from '@/utils/local-storage'
	import {
		getQrOrderDetail,
		bindOrder,
		updateProductImages,
		uploadPayImage,
		getOpenid,
		confirmpay
	} from '@/api/pagesHome/iWantToSellGoods/index'
	import SmtUpload from '@/components/smt-upload/index.vue'
	import { APPID } from '@/config'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	//	买家Or卖家 1买家 2卖家 3买家and卖家
	const buyerOrSeller = ref<number>(1)
	// 选中的多选框
	const checkboxValue = ref<any>([])
	// 是否显示弹窗
	const show = ref<boolean>(false)
	// 当前登录的用户名称
	const currentUserName = ref<string>()
	// 上传证明时的表单
	const form = ref<any>({
		"buyerId": 0,
		"buyerType": 0,
		"createTime": "",
		"createUserId": 0,
		"id": 0,
		"invoice_id": 0,
		"number": 0,
		"orderRubberExtendVO": {
			"checkStatus": 0,
			"dryWater": 0,
			"payImage": [],
			"stationId": 0
		},
		"payStatus": 0,
		"paymentNumber": "",
		"paymentTime": "",
		"paymentTotalAmount": 0,
		"paymentType": 0,
		"productListVO": [
			{
				"categoryId": 0,
				"categoryIndex": "",
				"categoryName": "",
				"productId": 0,
				"productName": "",
				"productNumber": 0,
				"productTotalPrice": 0,
				"productUnit": 0,
				"productUnitPrice": 0
			}
		],
		"productName": "",
		"productTotalPrice": 0,
		"qrcodeOrderVO": {
			"carImage": null,
			"carNumber": "",
			"carRemark": "",
			"categoryCode": "",
			"categoryId": 0,
			"categoryName": "",
			"deliveryType": 0,
			"productId": 0,
			"productImage": null,
			"productUnit": 0,
			"productUnitPrice": 0,
			"usageQuantity": 0
		},
		"remark": "",
		"sellerId": 0,
		"sellerType": 0,
		"serviceTotalPrice": 0,
		"serviceUnitPrice": 0,
		"tradeStatus": 0,
		"type": 1,
		"updateTime": "",
		"updateUserId": 0
	})

	// 查询参数
	const parameter = ref({})

	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}

	// 获取详情表单
	const getForm = async () => {
		try {
			const res : any = await getQrOrderDetail(parameter.value)
			if (res.success) {
				form.value = res.data
				if (res.data.qrcodeOrderVO.productImage !== null) {
					if (res.data.qrcodeOrderVO.productImage[0] !== "") {
						res.data.qrcodeOrderVO.productImage.forEach((item : any) => {
							goodsFileList.value.push({
								url: item
							})
						});
					}
				}
				if (res.data.orderRubberExtendVO.payImage !== null) {
					if (res.data.orderRubberExtendVO.payImage[0] !== "") {
						res.data.orderRubberExtendVO.payImage.forEach((item : any) => {
							voucherFileList.value.push({
								url: item
							})
						});
					}
				}
			} else {
				uni.showToast({
					title: res.msg,
					// title: '获取订单详情失败',
					icon: "none",
				});
			}
		} catch (e) {

		}
	}

	// 上传的宽高
	const upStyle = ref({
		width: '140rpx',
		height: '140rpx'
	})
	// 货物图片集
	const goodsFileList = ref<any>([])
	// 提交更改后的表单
	const productImage = ref<any>([""])
	// 货物商品图片集
	const newGoodsFileList = (a : any, b : any) => {
		if (a.length === 0) {
			productImage.value = [""]
		} else {
			productImage.value = []
		}
		a.forEach((e : any) => {
			productImage.value.push(e.url)
		});
		newImgForm()
	}
	// 提交更新图片后的表单
	const newImgForm = async () => {
		uni.showLoading({
			title: '提交图片中',
			mask: true
		})
		try {
			const res : any = await updateProductImages({
				orderId: form.value.id,
				productImage: productImage.value
			})
			if (res.success) {
				uni.showToast({
					title: '修改图片成功'
				})
			} else {
				goodsFileList.value = []
				productImage.value = []
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) {
			//TODO handle the exception
		}
	}

	// 支付凭证图片集
	const voucherFileList = ref<any>([])
	// 提交更改后的支付凭证
	const payImage = ref<any>([""])
	// 货物支付凭证
	const newVoucherFileList = (a : any, b : any) => {
		if (a.length === 0) {
			payImage.value = [""]
		} else {
			payImage.value = []
		}
		a.forEach((e : any) => {
			payImage.value.push(e.url)
		});
	}
	// 弹窗的提示文字
	const tipsText = ref<string>('是否确认收款')
	// 显示弹窗
	const showPopup = () => {
		if(!currentUserName.value){
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			});
			return
		}
		if (checkboxValue.value[0]) {
			show.value = true
			if (buyerOrSeller.value === 2) {
				if (voucherFileList.value.length === 0) {
					tipsText.value = '当前未提交支付凭证，是否确认收款'
				} else {
					tipsText.value = '是否确认收款'
				}
			} else {
				if (voucherFileList.value.length === 0) {
					tipsText.value = '当前未提交支付凭证，是否确认付款'
				} else {
					tipsText.value = '是否确认付款'
				}
			}
		} else {
			uni.showToast({
				title: '请先勾选《璟橡农产品采购协议》',
				icon: 'none'
			});
		}
	}
	// 确定提交订单
	const payEnd = async () => {
		uni.showLoading({
			title: '提交订单中',
			mask: true
		})
		try {
			const res : any = await uploadPayImage({
				orderId: form.value.id,
				payImage: payImage.value,
				status: buyerOrSeller.value === 2 ? 3 : 2
			})
			if (res.success) {
				uni.hideLoading();
				uni.redirectTo({
					url: '/pagesHome/src/iWantToSellGoods/paySuccess'
				});
			} else {
				uni.hideLoading();
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		} catch (e) {
			uni.hideLoading();
			//TODO handle the exception
		}
	}

	// 扫码绑定卖家
	const scanTheCode = () => {
		uni.scanCode({
			success: (res) => {
				const obja : any = res.result.split('{')
				const objb : any = obja[1].split('}')
				const objc : any = objb[0].split(',')
				const obj : any = objc[1].split(':')
				bindSeller(obj[1])
			},
			fail: (err : any) => {
				uni.showToast({
					title: '扫描失败',
					icon: 'none'
				});
			}
		})
	}
	// 绑定
	const bindSeller = async (id : any) => {
		let data : any = parameter.value
		data.sellerId = id
		try {
			const res : any = await bindOrder(data)
			if (res.success) {
				getForm()
				uni.showToast({
					title: '绑定卖家成功',
					icon: 'none'
				});
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		} catch (e) {
			//TODO handle the exception
		}
	}

	// 用户openid
	const openid = ref<string>()
	// 获取openid
	const binding = () => {
		if(!currentUserName.value){
				uni.hideLoading();
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return
			}
		if (checkboxValue.value[0]) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			try {
				uni.login({
					provider: 'weixin', //使用微信登录
					success: async (e : any) => {
						const res : any = await getOpenid({
							appid: APPID,
							code: e.code
						})
						if (res.success) {
							openid.value = res.data
							getOrderInfo()
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}
				})
			} catch (e) {
				uni.hideLoading();
				//TODO handle the exception
			}
		} else {
			uni.showToast({
				title: '请勾选并同意协议',
				icon: "none"
			});
		}
	}
	// 获取订单支付返回信息及绑定买家
	const getOrderInfo = async () => {
		try {
			const res : any = await confirmpay({
				id: form.value.id,
				openid: openid.value
			})
			if (res.success) {
				uni.hideLoading();
				submit(res.data)
			} else {
				uni.hideLoading();
				uni.showToast({
					title: res.msg,
					icon: "none",
				});
			}
		} catch (e) {
			uni.hideLoading();
			//TODO handle the exception
		}
	}
	// 进行支付
	const submit = (item : any) => {
		wx.requestPayment({
			timeStamp: item.timeStamp,
			nonceStr: item.nonceStr,
			package: item.package,
			signType: 'RSA',
			paySign: item.paySign,
			success(res : any) {
				if (res.errMsg == "requestPayment:ok") {
					uni.redirectTo({
						url: '/pagesHome/src/iWantToSellGoods/paySuccess'
					});
				} else {
					console.log('支付失败')
				}
			},
			fail(res : any) {
				// console.log('支付失败')
			}
		})
	}

	// 获取连接需要的参数，orderNum:需要的参数,url:链接
	const getUrlParam = (orderNum : any, url : any) => {
		let u = url,
			reg = new RegExp("(^|&)" + orderNum + "=([^&]*)(&|$)"),
			r = u.substr(u.indexOf("?") + 1).match(reg);
		return r != null ? decodeURI(r[2]) : "";
	};

	// 跳转协议
	const goProtocol = (num : number) => {
		uni.navigateTo({
			url: '/pagesOther/src/protocol/index?id=' + num
		});
	}

	onLoad((e : any) => {
		if (have(getUserInfo().nickName)) {
			currentUserName.value = getUserInfo().nickName
		}
		
		if (have(getUserInfo().buyerOrSeller)) {
			buyerOrSeller.value = getUserInfo().buyerOrSeller
		} else {
			buyerOrSeller.value = 3
		}
		if (e.q) {
			const url : any = decodeURIComponent(e.q)
			parameter.value = {
				orderNumber: getUrlParam('orderNum', url)
			}
			getForm()
		} else {
			if (have(e.orderNum)) {
				parameter.value = {
					orderNumber: e.orderNum
				}
				getForm()
			} else if (have(e.orderId)) {
				parameter.value = {
					orderId: e.orderId
				}
				getForm()
			}
		}
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;

		.box {
			background-color: #fff;
			border-radius: $radius1;
			padding: 0 24rpx;

			.row {
				padding: 24rpx 0;
				border-bottom: 2rpx solid $sbgcolor7;
				font-weight: 500;
				font-size: $text2;

				.tit {
					color: $sbgcolor4;
					width: 180rpx;

					text {
						color: $sbgcolor1;
					}
				}

				.rinput {
					width: 464rpx;
					color: $sbgcolor5;

					.tend {
						text-align: end;
					}

					:deep(.u-radio__icon-wrap) {
						margin-right: 16rpx !important;
					}
				}

				.totalPrice {
					color: $sbgcolor1;
				}

				.tip {
					color: $sbgcolor5 !important;
				}

				:deep(.u-radio-group, .u-radio-row) {
					justify-content: flex-end !important;
				}
			}
		}

		.protocol1 {
			margin: 50rpx 0;

			view {
				font-size: $text2;
				color: $sbgcolor5;

				text {
					color: $sbgcolor4;
					font-weight: bold;
				}
			}
		}

		.function {
			margin-bottom: 36rpx;

			.btn {
				background-color: $sbgcolor1;
				border-radius: $radius2;
				padding: 24rpx 0;
				line-height: $text5;
				font-weight: 500;
				font-size: $text3;
				color: #FFFFFF;
			}

			.btn1 {
				background-color: $sbgcolor8;
				border-radius: $radius2;
				padding: 24rpx 0;
				width: calc(50% - 24rpx);
				line-height: $text5;
				font-weight: 500;
				font-size: $text3;
				color: #FFFFFF;
			}

			.btn2 {
				background-color: $sbgcolor8;
				border-radius: $radius2;
				padding: 24rpx 0;
				width: calc(50% - 24rpx);
				line-height: $text5;
				font-weight: 500;
				font-size: $text3;
				color: #FFFFFF;
			}
		}
	}

	.popup {
		width: 606rpx;
		padding: 60rpx 0;
		background-color: #fff;
		border-radius: $radius1;

		.text {
			font-weight: bold;
			font-size: $text2;
			color: $sbgcolor4;
			line-height: $text4;
			text-align: center;
		}

		.operate {
			margin-top: 48rpx;

			.btna1 {
				width: 36%;
				padding: 14rpx 0;
				border-radius: $text5;
				border: 2rpx solid $sbgcolor1;
				font-size: $text2;
				color: $sbgcolor1;
			}

			.btna2 {
				width: 36%;
				padding: 14rpx 0;
				border-radius: $text5;
				background: $sbgcolor1;
				font-size: $text2;
				color: #fff;
			}
			
			.btnb1 {
				width: 36%;
				padding: 14rpx 0;
				border-radius: $text5;
				border: 2rpx solid $sbgcolor8;
				font-size: $text2;
				color: $sbgcolor8;
			}
			
			.btnb2 {
				width: 36%;
				padding: 14rpx 0;
				border-radius: $text5;
				background: $sbgcolor8;
				font-size: $text2;
				color: #fff;
			}
		}
	}
</style>