<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="tabs">
			<up-tabs :list="tabList" @click="changeTab" lineColor="#FFA020" lineWidth="78rpx" lineHeight="4rpx"
				:activeStyle="{ color: '#0D0D0D', fontSize: '32rpx', fontWeight: 'bold' }"
				:inactiveStyle="{ color: '#A0A0A0', fontSize: '32rpx', fontWeight: 'bold' }"
				:itemStyle="{width: 'calc(50% - 22px)',marginBottom: '16rpx'}">
			</up-tabs>
		</view>
		<view class="pd">
			<scroll-view scroll-y :lower-threshold="10" @scrolltolower="scrolltolower"
				:style="{height: 'calc(100vh - 200rpx)'}">
				<up-checkbox-group v-model="formIndex" placement="column" @change="changeIndex" shape="circle"
					activeColor="#FFA020" v-if="tabIndex === 0">
					<view class="box" v-for="(item,id) in form" :key="id">
						<view class="btit">{{item.sellerName}}</view>
						<view class="flex-row justify-between">
							<view>
								<view class="flex-row items-center">
									<view class="flex-col justify-center">
										<up-checkbox :key="id" :name="item.id"></up-checkbox>
									</view>
									<image :src="item.thumbnail?item.thumbnail:'../../../static/image/defaultImg.png'" mode="scaleToFill">
									</image>
								</view>
							</view>
							<view class="content flex-col">
								<view class="text1">类型：{{item.rubberType===1?'胶水':'胶块'}}</view>
								<view v-if="item.rubberType === 1" class="mtp flex-row justify-between items-center">
									<view class="text1">干含比：{{item.dryWater}}</view>
									<view class="text2">%</view>
								</view>
								<view class="mtp flex-row justify-between items-center">
									<view class="text1">重量：{{item.productCount}}</view>
									<view class="text2">公斤</view>
								</view>
								<view class="mtp flex-row justify-between items-center">
									<view class="text1">收胶价：{{item.productUnitPrice}}</view>
									<view class="text2">元/吨</view>
								</view>
								<view class="text3">订单金额 ¥ {{item.paymentTotalAmount}} 元</view>
							</view>
						</view>
					</view>
					<voidPrompt v-if="form.length===0"></voidPrompt>
				</up-checkbox-group>
				<view class="record" v-else>
					<view class="rbox" v-for="(item,id) in record" :key="id">
						<view class="flex-row justify-between items-center">
							<view>{{item.title}}</view>
							<view>{{item.titleType===1?'个人':'企业'}}</view>
						</view>
						<view class="hang underline flex-row justify-between items-center">
							<view>{{item.type === 1?'电子普通发票':'增值税专用发票'}}</view>
							<view>{{item.invoiceAmount}}元</view>
						</view>
						<view class="hang" :style="{color: '#E54043'}" v-if="item.invoiceUserStatus == 0">开票失败</view>
						<view class="hang" :style="{color: '#E54043'}" v-else-if="item.invoiceUserStatus == 1">待审核</view>
						<view class="hang" :style="{color: '#E54043'}" v-else-if="item.invoiceUserStatus == 2">审核未通过</view>
						<view class="hang" :style="{color: '#FFA020'}" v-else-if="item.invoiceUserStatus == 3">开票中</view>
						<view class="hang" :style="{color: '#2BAE85'}" v-else-if="item.invoiceUserStatus == 4">开票成功</view>
						<view class="hang" :style="{color: '#FFA020'}" v-else-if="item.invoiceUserStatus == 5">待作废</view>
						<view class="hang" :style="{color: '#E54043'}" v-else-if="item.invoiceUserStatus == 6">作废失败</view>
						<view class="hang" :style="{color: '#E54043'}" v-else-if="item.invoiceUserStatus == 7">已作废</view>
						<view class="hang" :style="{color: '#FFA020'}" v-else-if="item.invoiceUserStatus == 8">待作废原发票</view>
						<view class="hang" :style="{color: '#FFA020'}" v-else>待作废原发票</view>
					</view>
					<voidPrompt v-if="record.length===0"></voidPrompt>
				</view>
				<view v-if="showMore">
					<uni-load-more :status="moreStatus"></uni-load-more>
				</view>
			</scroll-view>
		</view>
		<view v-show="tabIndex===0" @click="goIonvoice" class="btn justify-center items-center">去开票</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import {
		getQrOrderList,
	} from '@/api/pagesMy/myOrderForm'
	import { getEvoiceRecords } from "@/api/pagesMy/invoicing";
	import { getUserInfo, getFontSize } from '@/utils/local-storage'
	import voidPrompt from '@/components/void-prompt/index.vue'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 订单类型
	const type = ref<number>(1)
	// 用户信息
	const userInfo = getUserInfo()
	// 表单
	const form = ref<any>([])

	// tab列表
	const tabList = reactive([
		{ name: '可开票订单' },
		{ name: '开票记录' }
	])
	// tab选中项
	const tabIndex = ref<number>(0)
	// tab改变时
	const changeTab = (e : any) => {
		if (tabIndex.value !== e.index) {
			tabIndex.value = e.index
			form.value = []
			record.value = []
			page.value = 1
			totalPage.value = 0
			if (e.index === 0) {
				getOrderList()
			} else {
				getRecordlist()
			}
		}

	}

	// 选中的列表
	const formIndex = ref<any>([])
	// 列表选中的值发生改变
	const changeIndex = (item : any) => {
		formIndex.value = item
	}

	// 获取订单列表
	const page = ref<number>(1)
	const pageSize = ref<number>(20)
	const totalPage = ref<number>(0)
	const getOrderList = async () => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		const data = {
			page: page.value,
			pageSize: pageSize.value,
			isGlue: 1,
			tradeStatus: 3,
			buyerOrSeller: userInfo.buyerOrSeller,
			invoiceStatus: 0,
			type: type.value
		}
		try {
			const res : any = await getQrOrderList(data)
			if (res.success) {
				totalPage.value = Math.ceil(res.data.total / pageSize.value)
				res.data.records.forEach((item : any) => {
					form.value.push(item)
				})
				uni.hideLoading();
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				page.value--
				uni.hideLoading();
			}
			if (totalPage.value === page.value) {
				moreStatus.value = 'noMore'
				showMore.value = true
			} else {
				moreStatus.value = 'more'
				showMore.value = false
			}
		} catch (e) {
			uni.hideLoading();
			page.value--
			moreStatus.value = 'more'
			showMore.value = false
		}
	}

	// 开票记录列表
	const record = ref<any>([])
	const getRecordlist = async () => {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
		try {
			const res : any = await getEvoiceRecords({
				invoiceUserStatus: "",
				page: page.value,
				pageSize: pageSize.value,
				userId: userInfo.id,
			})
			if (res.success) {
				totalPage.value = Math.ceil(res.data.total / pageSize.value)
				res.data.records.forEach((item : any) => {
					record.value.push(item)
				})
				uni.hideLoading();
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				page.value--
				uni.hideLoading();
			}
			if (totalPage.value === page.value) {
				moreStatus.value = 'noMore'
				showMore.value = true
			} else {
				moreStatus.value = 'more'
				showMore.value = false
			}
		} catch (e) {
			uni.hideLoading();
			page.value--
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
			getOrderList()
		}
	}

	// 跳转开票页面
	const goIonvoice = () => {
		if (formIndex.value.length !== 0) {
			uni.navigateTo({
				url: '/pagesHome/src/invoicing/issuingInvoices?ids=' + formIndex.value + '&type=' + type.value
			});
		} else {
			uni.showToast({
				title: '请选择需要开票的订单',
				icon: 'none'
			})
		}
	}

	onLoad(() => {
		type.value = 1
		formIndex.value = []
		form.value = []
		getOrderList()
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.tabs {
		padding: 12rpx 126rpx;
		background-color: #fff;
		position: sticky;
		left: 0;
		top: 0;
	}

	.pd {
		padding: 24rpx;

		.box {
			padding: 0 24rpx;
			background: #FFFFFF;
			border-radius: $radius1;
			margin-bottom: 24rpx;

			image {
				width: 186rpx;
				height: 186rpx;
			}

			.btit {
				font-weight: bold;
				font-size: $text2;
				color: $sbgcolor4;
				line-height: $text2;
				padding: 28rpx 0;
				border: 2rpx solid $sbgcolor7;
			}

			.content {
				width: 380rpx;

				.text1 {
					font-size: $text2;
					color: $sbgcolor4;
					line-height: $text2;
				}

				.text2 {
					font-size: $text2;
					color: $sbgcolor5;
					line-height: $text2;
				}

				.text3 {
					font-weight: bold;
					font-size: $text2;
					color: $sbgcolor4;
					line-height: $text2;
					text-align: end;
					margin: 36rpx 0 28rpx 0;
				}

				.mtp {
					margin-top: 24rpx;
				}
			}
		}

		.record {

			.rbox {
				padding: 24rpx 24rpx 0rpx 24rpx;
				background: #FFFFFF;
				border-radius: $radius1;
				margin-bottom: 24rpx;
				font-size: $text2;
				color: $sbgcolor4;
				line-height: $text2;

				.hang {
					padding: 24rpx 0;
				}

				.underline {
					border: 2rpx solid $sbgcolor7;
				}
			}
		}
	}

	.btn {
		width: 702rpx;
		padding: 24rpx 0;
		position: fixed;
		left: 24rpx;
		bottom: 24rpx;
		background: $sbgcolor11;
		border-radius: $radius2;
		font-size: $text3;
		color: #FFFFFF;
		line-height: $text3;
	}
</style>