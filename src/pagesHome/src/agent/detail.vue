<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
    <view class="pd">
      <view class="box">
        <view class="row">
					<view class="tit">请上传代理服务发票</view>
				</view>
				<view class="row">
					<SmtUpload :fileList="billFileList" @newFileList="newBillFileList"
            :maxCount="10" :upStyle="upStyle">
          </SmtUpload>
        </view>
      </view>
    </view>
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
				<view class="row">
					<u-album v-if="have(form.qrcodeOrderVO.productImage)" :urls="form.qrcodeOrderVO.productImage"
						multipleSize="70" singleSize="70"></u-album>
				</view>
			</view>
			<view class="box" style="margin-top: 24rpx;">
				<view class="row">
					<view class="tit">支付凭证</view>
				</view>
				<view class="row">
					<u-album v-if="have(form.orderRubberExtendVO.payImage)" :urls="form.orderRubberExtendVO.payImage"
						multipleSize="70" singleSize="70"></u-album>
				</view>
			</view>
			<!-- <view v-if="buyerOrSeller === 2" class="box" style="margin-top: 24rpx;"> -->
			<view v-if="true" class="box" style="margin-top: 24rpx;">
				<view class="row flex-row items-center justify-between">
					<view class="tit">买家</view>
					<view>{{form.buyerName}}</view>
				</view>
			</view>
			<view v-else class="box" style="margin-top: 24rpx;">
				<view class="row flex-row items-center justify-between">
					<view class="tit">卖家</view>
					<view>{{form.sellerName}}</view>
				</view>
			</view>


			<view class="function">
				<view class="flex-row justify-between">
					<view class="btn1 items-center justify-center" @click="payEnd">提交</view>
				</view>
			</view>
		</view>
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

  const billImg = ref<any>([])
  const billFileList = ref<any>([])
  const newBillFileList = (a : any, b : any) => {

		if (a.length === 0) {
			billImg.value = [""]
		} else {
			billImg.value = []
		}
		a.forEach((e : any) => {
			billImg.value.push(e.url)
		});
	}



	// 确定提交订单
	const payEnd = async () => {
		uni.showLoading({
			title: '提交中',
			mask: true
		})
		try {
			const res : any = await xxxxx({
				orderId: form.value.id,
				payImage: billImg.value,
			})
			if (res.success) {
				uni.hideLoading();
				uni.navigateBack();
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

	// 获取连接需要的参数，orderNum:需要的参数,url:链接
	const getUrlParam = (orderNum : any, url : any) => {
		let u = url,
			reg = new RegExp("(^|&)" + orderNum + "=([^&]*)(&|$)"),
			r = u.substr(u.indexOf("?") + 1).match(reg);
		return r != null ? decodeURI(r[2]) : "";
	};


	onLoad((e : any) => {
		if (have(getUserInfo().buyerOrSeller)) {
			buyerOrSeller.value = getUserInfo().buyerOrSeller
		} else {
			buyerOrSeller.value = 3
		}
		parameter.value = {
      orderId: e.orderId
    }
    getForm()
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
			margin-top: 36rpx;
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
				width: 100%;
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