<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="tit">抬头信息：</view>
				<view class="sing_item">
					<view> 抬头名称 </view>
					<view class="content"> {{ state.info.title }} </view>
				</view>
				<view class="sing_item">
					<view> 抬头类型 </view>
					<view class="content" v-if="state.info.titleType==1"> 个人 </view>
					<view class="content" v-else> 企业 </view>
				</view>
				<view class="sing_item">
					<view> 发票类型 </view>
					<view class="content" v-if="state.info.type==1">普通发票</view>
					<view class="content" v-else>增值税专用发票</view>
				</view>
				<view class="sing_item" v-if="state.info.titleType===2">
					<view> 纳税人识别号 </view>
					<view class="content"> {{ state.info.creditCode }}</view>
				</view>
				<view class="sing_item" v-if="state.info.titleType===2">
					<view> 公司地址 </view>
					<view class="content"> {{ state.info.businessAddress }} </view>
				</view>
				<view class="sing_item">
					<view> 电话号码 </view>
					<view class="content"> {{ state.info.registeredPhone }}</view>
				</view>
				<view class="sing_item" v-if="state.info.titleType===2">
					<view> 开户银行 </view>
					<view class="content"> {{ state.info.depositBank }} </view>
				</view>
				<view class="sing_item" v-if="state.info.titleType===2">
					<view> 银行账户 </view>
					<view class="content"> {{ state.info.bankAccount }} </view>
				</view>
				<view class="sing_item" v-if="state.info.titleType===2">
					<view> 发票金额 </view>
					<view class="content"> {{ state.info.invoiceAmount }}元 </view>
				</view>
			</view>

			<view class="box">
				<view class="tit">接收方式</view>
				<view>
					<view class="sing_item">
						<view> 电子邮箱 </view>
						<view class="content"> {{ state.info.emailAddress }} </view>
					</view>
					<view class="sing_item">
						<view> 接收电话 </view>
						<view class="content"> {{ state.info.phoneNumber }} </view>
					</view>
				</view>
			</view>
			<view>
				<view class="box">
					<view class="tit">商品关系：</view>
					<view class="single" v-for="item in state.info.productRalations" :key="item.id">
						<view class="single_item">
							<view class="evoInfo">
								<view> 分类名称：</view>
								<view>{{ item.categoryName }}</view>
							</view>
							<view class="evoInfo">
								<view> 商品名称：</view>
								<view>{{ item.productName }}</view>
							</view>
						</view>
						<view class="single_item">
							<view class="evoInfo">
								<view> 商品数量：</view>
								<view>{{ item.productNumber }}</view>
							</view>
							<view class="evoInfo">
								<view> 商品单位：</view>
								<view>{{ item.productUnit }}</view>
							</view>
						</view>
						<view class="single_item">
							<view class="evoInfo">
								<view> 商品单价（元）：</view>
								<view>{{ item.productUnitPrice }}</view>
							</view>
							<view class="evoInfo">
								<view> 商品总价（元）：</view>
								<view>{{ item.productAmount }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, reactive } from "vue";
	import { onLoad,onShow } from "@dcloudio/uni-app";
	import { getEvoiceDetail } from "@/api/pagesMy/invoicing";
	import { getUserInfo,getFontSize } from "@/utils/local-storage";
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 用户信息
	const userInfo = getUserInfo();
	const state = reactive({
		info: {},
	});
	onLoad((options : any) => {
		getDetail(options.id);
	});
	onShow(() => {
		baseFontSize.value = getFontSize()
	})

	// 获取详情
	const getDetail = async (id : any) => {
		try {
			const res : any = await getEvoiceDetail({
				invoiceId: id,
				orderNumber: "",
				userId: userInfo.id,
			});
			if (res.success) {
				state.info = res.data;
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		} catch (e) { }
	};
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx 24rpx 24rpx 24rpx;

		.box {
			padding: 24rpx;
			margin-bottom: 24rpx;
			background-color: #fff;
			border-radius: $radius1;

			.sing_item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #efefef;
				padding: 10rpx;
				box-sizing: border-box;
				font-size: $text4;
				
				.content{
					width: 410rpx;
				}
			}
		}

		.tit {
			font-size: $text4;
			font-weight: 700;
			margin-bottom: 10px;
		}

		.single {
			font-size: $text4;
			background-color: $sbgcolor7;
			padding: 10rpx;
			box-sizing: border-box;
			margin-bottom: 10rpx;
		}

		.single_item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;
		}

		.evoInfo {
			display: flex;
			justify-content: flex-start;
			font-size: $text4;
			width: 48%;
		}
	}
</style>