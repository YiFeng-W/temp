<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<scroll-view scroll-y :lower-threshold="10" @scrolltolower="scrolltolower" :style="{height: 'calc(100vh)'}"
			v-if="form.length !== 0">
			<view class="pd">
				<view class="box" v-for="(item,id) in form" :key="id">
					<view class="tit flex-row justify-between items-center">
						<view style="font-weight: bold;">{{item.type===1?'电子普通发票':'增值税专用发票'}}-{{item.titleType===1?'个人':'企业'}}
						</view>
						<view class="flex-row items-center">
							<view style="color: #E54043;" @click="deletePrompt(item.id)">删除</view>&ensp;&ensp;&ensp;
							<view style="color: #A0A0A0;" @click="goEdit(item.id)">编辑</view>
						</view>
					</view>
					<view v-if="item.titleType === 2" class="text1">{{item.title}}</view>
					<view v-if="item.titleType === 2" class="text2">税号:{{item.creditCode}}</view>
					<view v-if="item.titleType === 1" class="text1">{{item.title}}</view>
				</view>
			</view>
			<view v-if="showMore">
				<uni-load-more :status="moreStatus"></uni-load-more>
			</view>
		</scroll-view>
		<voidPrompt v-if="form.length===0"></voidPrompt>
		<view class="btn justify-center items-center" @click="goAdd">添加发票抬头</view>
		<!-- 弹窗 -->
		<up-popup :show="showDelete" mode="center" @close="closeDelete" round="16rpx">
			<view class="popupDelete">
				<view class="pcontent">是否确认删除此抬头</view>
				<view class="flex-row items-center">
					<view class="dbtn justify-center items-center" @click="closeDelete">取消</view>
					<view class="dbtn justify-center items-center" @click="deleteHeader">确认</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { getUserInvoiceTitleList, deleteUserInvoiceTitle } from '@/api/pagesMy/invoicing'
	import { getFontSize } from '@/utils/local-storage'
	import voidPrompt from '@/components/void-prompt/index.vue'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 列表
	const form = ref<any>([])

	// 获取订单列表
	const page = ref<number>(1)
	const pageSize = ref<number>(20)
	const totalPage = ref<number>(0)
	const getForm = async () => {
		try {
			const res : any = await getUserInvoiceTitleList({
				page: page.value,
				pageSize: pageSize.value,
				title: ""
			})
			if (res.success) {
				totalPage.value = Math.ceil(res.data.total / pageSize.value)
				res.data.records.forEach((item : any) => {
					form.value.push(item)
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
			getForm()
		}
	}
	
	// 是否显示删除提示
	const showDelete = ref<boolean>(false)
	// 需要删除的id
	const deleteId = ref<string>('')
	// 显示删除提示
	const deletePrompt = (id : string) => {
		deleteId.value = id
		showDelete.value = true
	}
	// 关闭删除提示
	const closeDelete = (id : string) => {
		deleteId.value = ''
		showDelete.value = false
	}

	// 删除抬头
	const deleteHeader = async () => {
		try {
			const res : any = await deleteUserInvoiceTitle({
				id: deleteId.value
			})
			deleteId.value = ''
			if (res.success) {
				uni.showToast({
					title: '删除成功',
				})
				page.value = 1
				form.value = []
				getForm()
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) {
			//TODO handle the exception
		}
		showDelete.value = false
	}
	
	// 去添加
	const goAdd = () => {
		uni.navigateTo({
			url: '/pagesHome/src/invoicing/addInvoiceManage'
		});
	}
	// 去编辑
	const goEdit = (id: string) => {
		uni.navigateTo({
			url: '/pagesHome/src/invoicing/addInvoiceManage?id=' + id
		});
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
		form.value = []
		getForm()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;

		.box {
			padding: 24rpx;
			background-color: #fff;
			border-radius: $radius1;
			font-size: $text2;

			.tit {
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid $sbgcolor7;
				font-weight: bold;
			}
			
			.text1 {
				margin-top: 24rpx;
			}
			
			.text2 {
				color: $sbgcolor5;
				margin-top: 24rpx;
			}
		}
	}

	.btn {
		width: calc(100% - 48rpx);
		padding: 24rpx 0;
		background: $sbgcolor11;
		border-radius: $radius2;
		font-size: $text3;
		line-height: $text3;
		color: #FFFFFF;
		position: fixed;
		left: 24rpx;
		bottom: 24rpx;
	}
	
	.popupDelete{
		width: 654rpx;
		
		.pcontent{
			padding: 48rpx 24rpx;
			font-size: $text4;
			text-align: center;
		}
		.dbtn{
			width: 50%;
			height: 80rpx;
			border: 2rpx solid #a0a0a0;
		}
	}
</style>