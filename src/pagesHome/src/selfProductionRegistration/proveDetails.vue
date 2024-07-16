<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="flex-row justify-between row">
					<view>分类名称</view>
					<text>{{form.categoryName}}</text>
				</view>
				<view class="flex-row justify-between row">
					<view>创建时间</view>
					<text>{{form.createTime}}</text>
				</view>
				<view class="flex-row justify-between row">
					<view>是否使用过</view>
					<text>{{form.isUsed===0?'未使用':'使用过'}}</text>
				</view>
				<view class="flex-row justify-between row">
					<view>种植/承包面积（亩）</view>
					<text>{{form.plantArea}}</text>
				</view>
				<view class="flex-row justify-between row">
					<view>剩余数量（KG）</view>
					<text>{{form.remainQuantity}}</text>
				</view>
				<view class="flex-row justify-between row">
					<view>销售数量（KG）</view>
					<text>{{form.saleQuantity}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad,onShow } from '@dcloudio/uni-app';
	import { getInfoDetail } from '@/api/pagesHome/selfProductionRegistration/index'
	import { getFontSize } from '@/utils/local-storage'
	
	// 根字体大小
	const baseFontSize = ref<number>(1)
	const form = ref<any>({
		applyId: 0,
		categoryName: "",
		createTime: "",
		id: 0,
		isUsed: 0,
		plantArea: 0,
		plantCategoryId: 0,
		remainQuantity: 0,
		saleQuantity: 0,
		updateTime: "",
		userId: 0
	})
	
	const getForm = async (id: string) => {
		const res: any = await getInfoDetail({id: id})
		if(res.success) {
			form.value = res.data
		} else {
			uni.showToast({
				title: res.msg,
				icon: "none",
			});
		}
	}
	
	onLoad((e: any) => {
		getForm(e.id)
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.padbg {
		.pd {
			padding: 24rpx;

			.box {
				padding: 0 24rpx;
				background-color: #fff;
				border-radius: $radius1;

				.row {
					padding: 24rpx 0;
					border-bottom: 2rpx solid $sbgcolor6;

					view {
						font-size: $text2;
						color: $sbgcolor4;
					}

					text {
						font-weight: 500;
						font-size: $text2;
						color: $sbgcolor5;
					}
				}
			}
		}
	}
</style>