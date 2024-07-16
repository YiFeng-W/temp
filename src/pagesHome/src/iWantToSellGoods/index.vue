<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="row">
					<view class="flex-row items-center justify-between">
						<view class="tit">分类名称</view>
						<view class="rinput flex-row items-center justify-end" @click="showSort = true">
							<text v-if="form.categoryName">{{ form.categoryName }}</text>
							<text v-else class="tip">请选择分类</text>
							<up-icon name="arrow-right" color="#A0A0A0" size="32rpx"></up-icon>
						</view>
					</view>
					<up-picker v-model="form.categoryName" :show="showSort" :columns="classificationList" @cancel="cancelSort"
						@confirm="confirmSort" keyName="categoryName"></up-picker>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">商品名称</view>
					<view class="rinput">
						<input v-model="form.productName" class="tend" placeholder="请输入商品名称" placeholder-class="placeholder"
							type="text" />
					</view>
				</view>
				<view v-if="have(form.categoryName)" class="row flex-row items-center justify-between">
					<view class="tit">销售数量</view>
					<view class="rinput justify-end">
						<text>{{ salesQuantity }}公斤</text>
					</view>
				</view>
				<view v-if="have(form.categoryName)" class="row flex-row items-center justify-between">
					<view class="tit">剩余数量</view>
					<view class="rinput justify-end">
						<text>{{ remainingQuantity }}公斤</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">橡胶类型</view>
					<view class="rinput flex-row items-center justify-end" @click="pickerType = true">
						<text v-if="have(form.rubberType)" class="tend">{{form.rubberType===1?'胶水':'胶块'}}</text>
						<text v-else class="tend" style="color: #A0A0A0;">请选择橡胶类型</text>
					</view>
					<up-picker :show="pickerType" :columns="typeColumns" keyName="name"
										 @cancel="cancelType" @confirm="confirmType" :defaultIndex="typeIndex"></up-picker>
				</view>
				<view v-if="form.rubberType===1" class="row flex-row items-center justify-between">
					<view class="tit">干含比</view>
					<view class="rinput flex-row items-center justify-end">
						<input v-model="form.dryWater" class="tend" placeholder="请输入干含比" placeholder-class="placeholder"
							type="digit" />
						<text style="width: 80rpx;text-align: end;">%</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">单价</view>
					<view class="rinput flex-row items-center justify-end">
						<input v-model="form.productUnitPrice" class="tend" placeholder="请输入单价" placeholder-class="placeholder"
							type="digit" @blur="blurdj" />
						<!-- <text>{{ form.productUnitPrice }}</text> -->
						<text style="width: 200rpx;text-align: end;">元/公斤</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">重量</view>
					<view class="rinput flex-row items-center justify-end">
						<input v-model="form.usageQuantity" class="tend" placeholder="请输入重量" placeholder-class="placeholder"
							type="digit" />
						<text style="width: 110rpx;text-align: end;">公斤</text>
					</view>
				</view>
				<view class="row flex-row items-center justify-between">
					<view class="tit">货品金额</view>
					<view class="rinput flex-row items-center justify-end totalPrice">
						<text>{{ totalPrice }}</text>
						<text style="width: 80rpx;text-align: end;">元</text>
					</view>
				</view>
				<view class="row">
					<view class="tit">货物照片</view>
				</view>
				<SmtUpload :fileList="goodsFileList" @newFileList="newGoodsFileList" :maxCount="10" :upStyle="upStyle">
				</SmtUpload>
			</view>
			<view class="protocol flex-row items-center justify-center">
				<up-checkbox-group v-model="checkboxValue" shape="circle">
					<up-checkbox :name="true"></up-checkbox>
				</up-checkbox-group>
				<view>阅读并同意<text @click="goProtocol(3)">《璟橡农产品交易协议》</text></view>
			</view>
			<view class="btn items-center justify-center" :class="forbidden?'forbidden':''" @click="submit">提交订单信息</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, computed } from 'vue';
	import { getCurrentUserCertificateInfoList, addQrCodeOrder } from '@/api/pagesHome/iWantToSellGoods/index'
	import { saveApplyInfo } from '@/api/index'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import { Decimal } from 'decimal.js'
	import { getUserInfo, setQRCode, getFontSize } from '@/utils/local-storage'
	import SmtUpload from '@/components/smt-upload/index.vue'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 获取个人信息
	const userInfo = getUserInfo()
	// 选中的多选框
	const checkboxValue = ref<any>([])

	// 上传证明时的表单
	let form = ref<any>({
		carImage: [""],
		carNumber: "",
		carRemark: "",
		categoryCode: "",
		categoryId: 0,
		categoryName: "",
		dryWater: "",
		isGlue: true,
		orderSign: "",
		productImage: [""],
		productName: "",
		productTotalPrice: '0.00',
		productUnitPrice: null,
		remark: "",
		rubberType: null,
		sellerType: 1,
		type: 1,
		usageQuantity: null,
		uuid: ""
	})
	// 销售数量
	const salesQuantity = ref<number>(0)
	// 剩余数量
	const remainingQuantity = ref<number>(0)

	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}
	
	// 计算总价
	const totalPrice = computed(() => {
		if (have(form.value.usageQuantity) && have(form.value.productUnitPrice) && have(form.value.dryWater)) {
			const zj = new Decimal(form.value.usageQuantity).mul(new Decimal(form.value.productUnitPrice))
			form.value.productTotalPrice = (new Decimal(zj).mul(new Decimal(form.value.dryWater/100))).toFixed(2)
			console.log(form.value.productTotalPrice);
			return form.value.productTotalPrice
		} else {
			return ''
		}
	})

	// 分类名称
	const showSort = ref<boolean>(false)
	const classificationList = ref<any>([[]])
	// 取消
	const cancelSort = () => {
		showSort.value = false
	}
	// 确认
	const confirmSort = (e : any) => {
		form.value.productName = e.value[0].productName
		form.value.categoryName = e.value[0].categoryName
		form.value.categoryId = e.value[0].plantCategoryId
		form.value.categoryCode = e.value[0].categoryCode
		salesQuantity.value = e.value[0].saleQuantity
		remainingQuantity.value = e.value[0].remainQuantity
		showSort.value = false
	}
	// 获取分类
	const getClassificationList = async () => {
		const res : any = await getCurrentUserCertificateInfoList({
			page: 1,
			pageSize: 9999
		})
		if (res.success) {
			classificationList.value[0] = res.data.records
		}
	}
	
	// 橡胶类型选择器
	const pickerType = ref<boolean>(false)
	// 橡胶类型内容
	const typeColumns = ref<any>([
		[
			{
				id: 1,
				name: '胶水'
			},
			{
				id: 2,
				name: '胶块'
			}
		]
	])
	// 选中的橡胶类型
	const typeIndex = ref<any>([])
	// 取消
	const cancelType = () => {
		pickerType.value = false
	}
	// 确认
	const confirmType = (e : any) => {
		typeIndex.value = e.indexs
		form.value.rubberType = e.value[0].id
		pickerType.value = false
	}
	
	// 单价开始价格
	const unitPrice = ref<any>(0)
	// 单价处理
	const blurdj = () => {
		const maxPrice = Number(new Decimal(unitPrice.value).mul(new Decimal(1.25)))
		const minPrice = Number(new Decimal(unitPrice.value).mul(new Decimal(0.75)))
		if(form.value.productUnitPrice > maxPrice || form.value.productUnitPrice < minPrice) {
			form.value.productUnitPrice = unitPrice.value
			uni.showToast({
				title: '单价不能大于'+maxPrice+'或小于'+minPrice,
				icon: 'none'
			})
		}
	}

	// 上传的宽高
	const upStyle = ref({
		width: '140rpx',
		height: '140rpx'
	})
	// 货物图片集
	const goodsFileList = ref<any>([])
	// 货物商品图片集
	const newGoodsFileList = (a : any, b : any) => {
		if (a.length === 0) {
			form.value.productImage = [""]
		} else {
			form.value.productImage = []
		}
		a.forEach((e : any) => {
			form.value.productImage.push(e.url)
		});
	}

	// 密码盐
	const password = ref<object>({})
	// 获取密码盐
	const getPassword = async () => {
		try {
			const res : any = await saveApplyInfo()
			if (res.success) {
				password.value = res.data
			} else {
				uni.showToast({
					title: res.nsg,
					icon: 'none'
				});
			}
		} catch (e) {
			//TODO handle the exception
		}
	}
	
	// 提交时禁用按钮？
	const forbidden = ref<boolean>(false)
	// 提交
	const submit = async () => {
		if (form.value.usageQuantity > remainingQuantity.value) {
			uni.showToast({
				title: '输入的数量不能大于剩余数量',
				icon: "none"
			});
		} else {
			if(checkboxValue.value[0]) {
				uni.showLoading({
					title: '订单提交中',
					mask: true
				});
				forbidden.value = true
				form.value.productUnitPrice = Number(form.value.productUnitPrice).toFixed(2)
				const res : any = await addQrCodeOrder(form.value)
				if (res.success) {
					uni.hideLoading();
					forbidden.value = false
					setQRCode(res.data.qrcodeBase64)
					uni.redirectTo({
						url: '/pagesHome/src/iWantToSellGoods/displayQRCode?id=' + res.data.orderId + '&amt=' + form.value.productTotalPrice
					});
				} else {
					uni.hideLoading();
					forbidden.value = false
					uni.showToast({
						title: res.msg,
						icon: "none",
					});
				}
			} else {
				uni.showToast({
					title: '请勾选并同意协议',
					icon: "none"
				});
			}
		}
	}
	
	// 跳转协议
	const goProtocol = (num: number) => {
		uni.navigateTo({
			url: '/pagesOther/src/protocol/index?id=' + num
		});
	}

	onLoad((e: any) => {
		unitPrice.value = ((e.amt - 2000)/1000).toFixed(2)
		form.value.productUnitPrice = unitPrice.value
		if (userInfo.userType === 3) {
			form.value.sellerType = 1
		} else if (userInfo.userType === 4) {
			form.value.sellerType = 2
		} else if (userInfo.userType === 2) {
			form.value.sellerType = 3
		}
		getClassificationList()
		getPassword()
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
					color: $sbgcolor5;
					width: 180rpx;

					text {
						color: $sbgcolor1;
					}
				}

				.rinput {
					width: 464rpx;
					color: $sbgcolor4;

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

		.protocol {
			margin: 50rpx 0;
			
			view{
				font-size: $text2;
				color: $sbgcolor5;
				
				text{
					color: $sbgcolor4;
					font-weight: bold;
				}
			}
		}

		.btn {
			background-color: $sbgcolor1;
			border-radius: $radius2;
			padding: 24rpx 0;
			line-height: $text5;
			font-weight: 500;
			font-size: $text3;
			color: #FFFFFF;
		}
	}
</style>