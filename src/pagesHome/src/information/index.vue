<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="form">
			<scroll-view scroll-y :lower-threshold="50" class="scroll" @scrolltolower="scrolltolower"
				v-if="newList.length!==0">
				<view class="box flex-row justify-between" v-for="(item,id) in newList" :key="id"
					@click="goConsultDetails(item.id)">
					<image :src="item.imagePath" mode="scaleToFill"></image>
					<view class="flex-col justify-between content">
						<view class="tit">{{item.title}}</view>
						<view class="text">
							<text>{{ item.contentSource }}</text>
							<text style="margin-left: 20rpx;">{{ newDate(item.createTime) }}</text>
						</view>
					</view>
				</view>
				<view v-if="showMore">
					<uni-load-more :status="moreStatus"></uni-load-more>
				</view>
			</scroll-view>
			<view v-if="newList.length===0" class="scroll">
				<voidPrompt></voidPrompt>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getDetailForArticles } from '@/api/pages/index'
	import dayjs from 'dayjs';
	import voidPrompt from '@/components/void-prompt/index.vue'
	import { getFontSize } from '@/utils/local-storage'

	// 根字体大小
	const baseFontSize = ref<number>(1)

	const page = ref<number>(1)
	const pageSize = ref<number>(20)
	const pageCount = ref<number>(0)
	const newList = ref<any>([])
	// 获取新闻列表
	const getNewList = async () => {
		const res : any = await getDetailForArticles({
			page: page.value,
			pageSize: pageSize.value,
			status: 1
		})
		if (res.success) {
			pageCount.value = Math.ceil(res.data.total / pageSize.value)
			res.data.records.forEach((item : any) => {
				newList.value.push(item)
			})
			if (pageCount.value === page.value) {
				moreStatus.value = 'noMore'
				showMore.value = true
			} else {
				moreStatus.value = 'more'
				showMore.value = false
			}
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			moreStatus.value = 'more'
			showMore.value = false
		}
	}

	// 显示加载状态
	const showMore = ref<boolean>(false)
	// 加载状态
	const moreStatus = ref<string>('loading')
	// 下拉触底时加载
	const scrolltolower = () => {
		moreStatus.value = 'loading'
		showMore.value = true
		if (pageCount.value <= page.value) {
			moreStatus.value = 'noMore'
			showMore.value = true
		} else {
			page.value++
			moreStatus.value = 'loading'
			showMore.value = true
			getNewList()
		}
	}

	// 时间格式转
	const newDate = (e : any) => {
		const sj = dayjs(e).format('YYYY-MM-DD')
		return sj
	}

	// 跳转新闻详情
	const goConsultDetails = (e : string) => {
		uni.navigateTo({
			url: '/pagesHome/src/information/details?id=' + e
		});
	}

	onLoad(() => {
		getNewList()
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.form {
		background-color: #fff;
		padding: 0rpx 24rpx;

		.scroll {
			height: calc(100vh);

			.box {
				padding-top: 24rpx;

				image {
					width: 220rpx;
					height: 172rpx;
				}

				.content {
					width: 460rpx;
				}

				.tit {
					font-size: $text3;
					font-weight: 500;
					color: #000;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					/* 定义显示的行数 */
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.text {
					font-size: $text2;
					color: $sbgcolor5;
					text-align: end;
				}
			}
		}
	}
</style>