<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="top">
			<up-tabs :list="operationList" @click="changeOperationList" class="tabs"
				:itemStyle="{ width: 'calc(25% - 22px)', marginBottom: '8px' }" lineColor="#2BAE85" lineWidth="78rpx"
				lineHeight="4rpx" :activeStyle="{ fontSize: '32rpx', color: '#0D0D0D' }"
				:inactiveStyle="{ fontSize: '32rpx', color: '#A0A0A0' }">
			</up-tabs>
		</view>
		<view v-show="isTab !== 2" class="marbox search justify-between flex-row items-center">
			<up-icon name="search" color="#A0A0A0" size="32"></up-icon>
			<input v-model="keyWord" placeholder="请输入关键字" />
			<view class="keyBtn justify-center items-center" @click="lookup">查找</view>
		</view>
		<view class="marbox list" v-show="isTab !== 2">
			<scroll-view scroll-y :lower-threshold="50" class="scroll" @scrolltolower="scrolltolower">
				<view v-show="isTab === 0" class="row flex-row justify-between items-center" v-for="(item,id) in availableList"
					:key="id" @click="goAvailable(item)">
					<view class="to">{{item.productName}}</view>
					<text>{{item.createTime}}</text>
				</view>
				<view v-show="isTab === 1" class="row flex-row justify-between items-center" v-for="(item,id) in record"
					:key="id" @click="goRecord(item)">
					<view class="to">{{item.productName}}</view>
					<view class="flex-col items-end">
						<text :style="{color: item.authStatus === 0?'#FFC64B':item.authStatus === -1?'#2BAE85':'#033786'}">{{item.authStatus === 0?'待审核':item.authStatus === -1?'未通过':'通过'}}</text>
						<text>{{item.createTime}}</text>
					</view>
				</view>
				<checkbox-group @change="changeChoice">
					<view v-show="isTab === 3" class="row flex-row justify-between items-center" v-for="(item,id) in revokeList"
						:key="id">
						<checkbox :value="item.id" />
						<view @click="goAvailable(item)" class="ctit">{{item.productName}}</view>
						<text @click="goAvailable(item)">{{item.createTime}}</text>
					</view>
				</checkbox-group>
				<view v-if="showMore">
					<uni-load-more :status="moreStatus"></uni-load-more>
				</view>
			</scroll-view>
		</view>
		<view v-show="isTab === 2" class="activation">
			<view class="tit">请填写个人信息</view>
			<view class="actbox" style="margin-bottom: 36rpx;">
				<view class="row flex-row items-center">
					<view class="ztit">姓名</view>
					<text class="ztext">{{form.name}}</text>
				</view>
				<view class="row flex-row items-center">
					<view class="ztit">身份证号</view>
					<text class="ztext">{{form.IDCard}}</text>
				</view>
				<view class="row flex-row items-center">
					<view class="ztit">手机号</view>
					<text class="ztext">{{form.tel}}</text>
				</view>
			</view>
			<view class="flex-row items-center justify-between" style="margin-bottom: 36rpx;">
				<view class="actbox">
					<input type="number" maxlength="6" v-model="form.Vcode" placeholder="输入验证码" />
				</view>
				<view class="zBtn justify-center items-center">获取验证码</view>
			</view>
			<view class="sBtn justify-center items-center">提交</view>
		</view>
		<view v-show="isTab === 3" class="cBtn justify-center items-center" @click="revokeProve">撤销</view>
		<view v-show="isTab === 0" class="add" @click="goAdd">
			<image src="@/pagesHome/static/add.png" mode="scaleToFill"></image>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import {
		getCurrentUserCertificateInfoList,
		getCertificateApplyList,
		enableOrDisableInfo
	} from '@/api/pagesHome/selfProductionRegistration/index'
	import { getFontSize } from '@/utils/local-storage'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	// tab列表
	const isTab = ref<number>(0)
	const operationList = ref<any>([
		{
			name: '可用记录'
		},
		{
			name: '申请记录'
		},
		{
			name: '激活证明'
		},
		{
			name: '撤销证明'
		}
	])

	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}

	// 选择tab
	const changeOperationList = (e : any) => {
		// keyWord.value = ''
		isTab.value = e.index
	}

	// 关键字
	const keyWord = ref<string>('')
	// 每页条数
	const PageSize = ref<number>(9)

	// 获取可用记录列表 || 获取撤销证明列表
	const availableList = ref<any>([])
	const revokeList = ref<any>([])
	const availablePage = ref<number>(1)
	const revokePage = ref<number>(1)
	const availablePageSzie = ref<number>(0)
	const revokePageSzie = ref<number>(0)
	const getAvailable = async (a ?: any) => {
		const res : any = await getCurrentUserCertificateInfoList({
			isUsed: a,
			keyword: keyWord.value,
			page: have(a) ? revokePage.value : availablePage.value,
			pageSize: PageSize.value,
		})
		if (res.success) {
			if(have(a)) {
				revokePageSzie.value = Math.ceil(res.data.total / PageSize.value)
				if(res.data.total !== 0) {
					res.data.records.forEach((e : any) => {
						revokeList.value.push(e)
					});
				}
				if(revokePageSzie.value <= revokePage.value) {
					moreStatus.value = 'noMore'
					showMore.value = true
				} else {
					showMore.value = false
				}
			} else {
				availablePageSzie.value = Math.ceil(res.data.total / PageSize.value)
				if(res.data.total !== 0) {
					res.data.records.forEach((e : any) => {
						availableList.value.push(e)
					});
				}
				if(availablePageSzie.value <= availablePage.value) {
					moreStatus.value = 'noMore'
					showMore.value = true
				} else {
					showMore.value = false
				}
			}
		} else {
			uni.showToast({
				title: res.msg,
				icon: "none",
			});
		}
	}

	// 获取申请记录
	const record = ref<any>([])
	const recordPage = ref<number>(1)
	const recordPageSize = ref<number>(0)
	const getRecord = async () => {
		const res : any = await getCertificateApplyList({
			keyword: keyWord.value,
			page: recordPage.value,
			pageSize: PageSize.value,
		})
		if (res.success) {
			recordPageSize.value = Math.ceil(res.data.total / PageSize.value)
			if (recordPageSize.value <= recordPage.value) {
				if(res.data.total !== 0) {
					res.data.records.forEach((e : any) => {
						record.value.push(e)
					});
				}
				moreStatus.value = 'noMore'
				showMore.value = true
			} else {
				res.data.records.forEach((e : any) => {
					record.value.push(e)
				});
				showMore.value = false
			}
		} else {
			uni.showToast({
				title: res.msg,
				icon: "none",
			});
		}
	}

	// 激活证明
	const form = ref<any>({
		name: '',
		IDCard: '',
		tel: '',
		VCode: ''
	})

	// 选择删除证明
	const revokeChoice = ref<[]>([])
	const changeChoice = (e : any) => {
		revokeChoice.value = e.detail.value
	}
	const revokeProve = async () => {
		if(revokeChoice.value.length > 0) {
			const res: any = await enableOrDisableInfo({
				ids: revokeChoice.value
			})
			if(res.success) {
				availableList.value = []
				availablePage.value = 1
				getAvailable()
				revokeList.value = []
				revokePage.value = 1
				getAvailable(0)
				uni.showToast({
					title: '撤销证明成功',
				});
			} else {
				 uni.showToast({
				 	title: res.msg,
				 	icon: "none",
				 });
			}
		} else {
			uni.showToast({
				title: '请选择需要撤销的自产登记',
				icon: "none",
			});
		}
	}
	
	// 点击查找
	const lookup = () => {
		if(isTab.value === 0) {
			availableList.value = []
			availablePage.value = 1
			getAvailable()
		} else if(isTab.value === 1) {
			record.value = []
			recordPage.value = 1
			getRecord()
		} else if(isTab.value === 3) {
			revokeList.value = []
			revokePage.value = 1
			getAvailable(0)
		}
	}
	
	
	// 上拉刷新
	const showMore = ref<boolean>(false)
	const moreStatus = ref<string>('loading')
	const scrolltolower = () => {
		moreStatus.value = 'loading'
		showMore.value = true
		if(isTab.value === 0) {
			if(recordPageSize.value !== availablePage.value) {
				availablePage.value++
				getAvailable()
			} else {
				moreStatus.value = 'noMore'
				showMore.value = true
			}
		} else if(isTab.value === 1) {
			if(recordPageSize.value !== recordPage.value) {
				recordPage.value++
				getRecord()
			} else {
				moreStatus.value = 'noMore'
				showMore.value = true
			}
		} else if(isTab.value === 3) {
			if(recordPageSize.value !== availablePage.value) {
				revokePage.value++
				getAvailable(0)
			} else {
				moreStatus.value = 'noMore'
				showMore.value = true
			}
		}
	}

	// 新增证明
	const goAdd = () => {
		uni.navigateTo({
			url: '/pagesHome/src/selfProductionRegistration/addSelfProducedCertificate'
		});
	}
	
	// 查看可用记录详情
	const goAvailable = (e: any) => {
		uni.navigateTo({
			url: '/pagesHome/src/selfProductionRegistration/proveDetails?id=' + e.id
		});
	}
	
	// 查看申请记录详情
	const goRecord = (e: any) => {
		uni.navigateTo({
			url: '/pagesHome/src/selfProductionRegistration/addSelfProducedCertificate?id=' + e.id + '&show=1'
		});
	}

	onShow(() => {
		baseFontSize.value = getFontSize()
		keyWord.value = ''
		availableList.value = []
		record.value = []
		revokeList.value = []
		availablePage.value = 1
		recordPage.value = 1
		revokePage.value = 1
		getAvailable()
		getRecord()
		getAvailable(0)
	})
</script>

<style lang="scss" scoped>
	.top {
		position: sticky;
		top: 0rpx;
		z-index: 100;
		background-color: #fff;
		padding: 20rpx 0;
	}

	.marbox {
		margin: 24rpx 24rpx 0rpx 24rpx;
	}

	.search {
		background: #FFFFFF;
		border-radius: 100rpx;
		padding: 4rpx 6rpx;
		font-size: $text2;
		position: sticky;
		top: 98rpx;
		z-index: 100;

		input {
			width: 480rpx;
		}

		.keyBtn {
			padding: 8rpx 34rpx;
			line-height: 48rpx;
			background: $sbgcolor1;
			border-radius: 100rpx;
			color: #FFFFFF;
		}
	}

	.list {
		background: #FFFFFF;
		border-radius: $radius1;
		padding: 0 24rpx;

		.scroll {
			height: calc(100vh - 240rpx);
		}

		.row {
			padding: 24rpx 0;
			border-bottom: 2rpx solid $sbgcolor7;

			.to {
				font-size: $text2;
				color: $sbgcolor4;
				width: 320rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			text {
				font-size: $text2;
				color: $sbgcolor5;
			}

			.ctit {
				font-size: $text2;
				color: $sbgcolor4;
				width: 270rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.activation {
		padding: 0 24rpx;

		.tit {
			text-align: center;
			padding: 24rpx 0;
			font-weight: bold;
			font-size: $text3;
			line-height: $text3;
			color: $sbgcolor4;
		}

		.actbox {
			background: #FFFFFF;
			border-radius: $radius1;
			padding: 0 24rpx;

			.row {
				padding: 24rpx 0;
				border-bottom: 2rpx solid $sbgcolor7;
				
				.ztit {
					font-size: $text2;
					color: $sbgcolor5;
					line-height: $text2;
				}
				
				.ztext {
					width: 500rpx;
					font-size: $text2;
					line-height: $text2;
					color: $sbgcolor4;
				}
			}

			input {
				width: 400rpx;
				height: 80rpx;
				font-size: $text2;
				line-height: $text2;
			}
		}

		.zBtn {
			width: 226rpx;
			height: 80rpx;
			border-radius: $radius1;
			background-color: $sbgcolor1;
			font-size: $text2;
			color: #FFFFFF;
		}

		.sBtn {
			width: 702rpx;
			padding: 24rpx 0;
			border-radius: $radius2;
			background-color: $sbgcolor1;
			font-size: $text3;
			line-height: $text3;
			color: #FFFFFF;
			position: fixed;
			bottom: 92rpx;
		}
	}

	.cBtn {
		width: 702rpx;
		padding: 24rpx 0;
		border-radius: $radius2;
		background-color: $sbgcolor1;
		font-size: $text3;
		line-height: $text3;
		color: #FFFFFF;
		position: fixed;
		left: 24rpx;
		bottom: 92rpx;
	}

	.add {
		position: absolute;
		right: 80rpx;
		bottom: 104rpx;

		image {
			width: 80rpx;
			height: 80rpx;
		}
	}
</style>