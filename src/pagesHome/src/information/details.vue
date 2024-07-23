<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="bg">
			<view class="box">
				<view class="title">{{ data.title }}</view>
				<view class="subtitle">
					<text>{{ data.createTime }}</text>&emsp13;
					<text>来源：</text>
					<text>{{ data.contentSource }}</text>
				</view>
				<up-parse :content="data.content" class="content"></up-parse>
				<view class="flex-row items-center operation">
					<view class="flex-row items-center">
						<image src="@/pagesHome/static/browse.png" mode="scaleToFill" />
						<text>{{ data.visitCount }}</text>
					</view>
					<!-- <view class="flex-row items-center margin">
                        <image src="@/pagesHome/static/like.png" mode="scaleToFill" />
                        <text>20</text>
                    </view> -->
					<view class="flex-row items-center margin">
						<image v-if="favorite" src="@/pagesHome/static/favorite.png" mode="scaleToFill" @click="collectNews" />
						<image v-else src="@/pagesHome/static/collection.png" mode="scaleToFill" @click="collectNews" />
						<text>{{ data.colletCount }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getUserInfo, getFontSize } from '@/utils/local-storage';
	import { getArticleVisit, addVisitCount, removeCoCount } from '@/api/pagesHome/information/information'

	// 新闻id
	const id = ref<string>('')
	// 用户信息
	const userInfo = getUserInfo()
	// 根据id获取内容
	const data = ref({
		title: '',
		createTime: '',
		contentSource: '',
		content: '',
		visitCount: '',
		colletCount: '',
		isCollected: false
	})
	const favorite = ref<boolean>(false)
	// 根字体大小
	const baseFontSize = ref<number>(1)

	// 获取咨迅详情
	const getContent = async () => {
		const dt = {
			id: id.value,
			userId: userInfo.id
		}
		const res : any = await getArticleVisit({ id: id.value })
		if (res.success) {
			data.value = res.data
			favorite.value = data.value.isCollected
		} else {
			uni.$u.toast(res.msg)
		}
	}

	// 收藏新闻
	const collectNews = async () => {
		const dt = {
			id: id.value,
			userId: userInfo.id
		}
		if (favorite.value) {
			const res : any = await removeCoCount(dt)
			if (res.success) {
				favorite.value = false
			} else {
				uni.showToast({
					title: res.msg,
					icon: "none"
				});
			}
		} else {
			const res : any = await addVisitCount(dt)
			if (res.success) {
				favorite.value = true
			} else {
				uni.showToast({
					title: res.msg,
					icon: "none"
				});
			}
		}
	}

	onLoad((e : any) => {
		id.value = e.id
		getContent()
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.bg {
		background-color: $sbgcolor1;
		padding: 24rpx;

		.box {
			background-color: #fff;
			border-radius: 16rpx;
			padding: 24rpx 24rpx 144rpx 24rpx;
			font-weight: 500;
			font-size: $text3;
			color: $sbgcolor4;
			min-height: calc(100vh - 216rpx);

			.title {
				font-weight: bold;
				font-size: $text5;
				color: #000000;
			}

			.subtitle {
				font-weight: 500;
				font-size: $text2;
				color: $sbgcolor5;
				margin-top: 16rpx;
			}

			.content {
				font-weight: 500;
				font-size: $text3;
				color: #000000;
				margin-top: 44rpx;
				text-indent: 1ch;
			}

			.operation {
				margin-top: 44rpx;
				font-weight: 500;
				font-size: $text2;
				color: $sbgcolor4;

				image {
					width: 32rpx;
					height: 32rpx;
					margin-right: 12rpx;
				}

				.margin {
					margin-left: 36rpx;
				}
			}
		}
	}
</style>@/api/pagesHome/information/information