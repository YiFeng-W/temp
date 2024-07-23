<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view :class="[state.lists ? 'list_box' : 'box', 'padbg']">
		<!-- 有开票记录 -->
		<scroll-view scroll-y :lower-threshold="10" @scrolltolower="scrolltolower" :style="{height: 'calc(100vh - 48rpx)'}"
			v-if="state.lists.length !== 0">
			<view class="single_records" v-for="item in state.lists" :key="item.id" @click="goDetail(item.id)">
				<view style="border-bottom: 1px solid #ccc">
					<view class="evoInfo">
						<view> {{ item.title }}</view>
						<view>{{ item.titleType == 2 ? "企业" : "个人" }}</view>
					</view>
					<view class="evoInfo">
						<view>{{ item.type == 2 ? "增值税专用发票" : "普通发票" }} </view>
						<view>{{ item.invoiceAmount }}元</view>
					</view>
					<view class="time">{{ item.invoiceDate }} </view>
				</view>
				<view class="opt_box">
					<view class="evoState" v-if="item.invoiceUserStatus == 0">开票失败</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 1">待审核</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 2">审核未通过</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 3">开票中</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 4">开票成功</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 5">待作废</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 6">作废失败</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 7">已作废</view>
					<view class="evoState" v-else-if="item.invoiceUserStatus == 8">待作废原发票</view>
					<view class="evoState" v-else>待作废原发票</view>
					<view class="opt_item" v-if="item.invoiceStatus == 4">
						<view @click.stop="mailboxPrompt(item)">发送邮件</view>
						<view @click.stop="reApplay(item)">申请重开</view>
					</view>
				</view>
			</view>
			<view v-if="showMore">
				<uni-load-more :status="moreStatus"></uni-load-more>
			</view>
		</scroll-view>
		<voidPrompt v-if="state.lists.length===0"></voidPrompt>
		<!-- 弹窗 -->
		<up-popup :show="showMailbox" mode="center" @close="closeDelete" bgColor="transparent">
			<view class="popupDelete">
				<view class="pcontent">是否确认发送邮件</view>
				<view class="flex-row items-center">
					<view class="dbtn justify-center items-center" @click="closeDelete">取消</view>
					<view class="dbtn justify-center items-center" @click="selfSendmail">确认</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive } from "vue";
	import { onLoad,onShow } from "@dcloudio/uni-app";
	import { getEvoiceRecords, sendEmail } from "@/api/pagesMy/invoicing";
	import { getUserInfo,getFontSize } from "@/utils/local-storage";
	import voidPrompt from '@/components/void-prompt/index.vue'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 用户信息
	const userInfo = getUserInfo();
	const state = reactive<any>({
		lists: [],
	});
	onLoad((item : any) => {
		getEvoiceLists();
	});
	onShow(() => {
		baseFontSize.value = getFontSize()
	})

	// 获取发票记录
	const page = ref<number>(1)
	const pageSize = ref<number>(20)
	const totalPage = ref<number>(0)
	const getEvoiceLists = async () => {
		try {
			const res : any = await getEvoiceRecords({
				invoiceUserStatus: "",
				page: page.value,
				pageSize: pageSize.value,
				userId: userInfo.id,
			});
			if (res.success) {
				totalPage.value = Math.ceil(res.data.total / pageSize.value)
				res.data.records.forEach((item : any) => {
					state.lists.push(item)
				})
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
				page.value--
			}
			if(totalPage.value <= page.value) {
				moreStatus.value = 'noMore'
				showMore.value = true
			} else {
				moreStatus.value = 'more'
				showMore.value = false
			}
		} catch (e) {
			page.value--
			moreStatus.value = 'more'
			showMore.value = false
		}
	};
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
			getEvoiceLists()
		}
	}

	// 跳转详情页面
	const goDetail = async (id : any) => {
		uni.navigateTo({
			url: `/pagesHome/src/invoicing/invoiceDetail?id=${id}`,
		});
	};
	
	// 是否显示发邮件提示
	const showMailbox = ref<boolean>(false)
	// 需要发邮件参数
	const mailboxForm = ref<any>()
	// 显示发邮件提示
	const mailboxPrompt = (item : any) => {
		mailboxForm.value = {
			filePath: item.invoicePath,
			to: '',
			operationType: '',
			content: item.emailAddress
		}
		showMailbox.value = true
	}
	// 关闭发邮件提示
	const closeDelete = (id : string) => {
		mailboxForm.value = ''
		showMailbox.value = false
	}
	// 发送邮件
	// 手动开票发送邮件
	const selfSendmail = async (item: any) => {
		try{
			const res: any = await sendEmail(mailboxForm.value)
			if(res.success) {
				uni.showToast({
					title: '发送邮件成功',
				})
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		}catch(e){
			//TODO handle the exception
		}
		showMailbox.value = false
	};
	
	//申请重开
	const reApplay = async (arg : any) => {
		uni.navigateTo({
			url: `/pagesHome/src/invoicing/issuingInvoices?type=${arg.type}&titleType=${arg.titleType}&title=${arg.title}&creditCode=${arg.creditCode}&businessAddress=${arg.businessAddress}&registeredPhone=${arg.registeredPhone}&depositBank=${arg.depositBank}&bankAccount=${arg.bankAccount}&invoiceAmount=${arg.invoiceAmount}&emailAddress=${arg.emailAddress}&phoneNumber=${arg.phoneNumber}&id=${arg.id}`,
		});
	};
</script>

<style lang="scss" scoped>
	.box {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.list_box {
		padding: 24rpx;
		box-sizing: border-box;
	}

	image {
		width: 200rpx;
		height: 200rpx;
	}

	.empty {
		font-family: PingFang SC, PingFang SC;
		font-weight: 500;
		font-size: $text4;
		color: #a0a0a0;
		margin-top: 20rpx;
	}

	.single_records {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		font-size: $text4;
		margin-bottom: 20rpx;

		.evoInfo {
			display: flex;
			justify-content: space-between;

			margin-bottom: 10rpx;
		}
	}

	.time {
		margin-bottom: 10rpx;
	}

	.opt_box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: PingFang SC, PingFang SC;
		margin-top: 20rpx;
		font-size: $text4;

		.evoState {
			color: #1a75ff;
		}
	}

	.opt_item {
		display: flex;
		align-items: center;

		view {
			border: 1px solid #ccc;
			width: 188rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			border-radius: 25rpx;
			margin-left: 20rpx;
		}
	}
	
	.popupDelete{
		width: 654rpx;
		background-color: #fff;
		border-radius: $radius1;
		
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