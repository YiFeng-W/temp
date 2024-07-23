<template>
	<page-meta :root-font-size="`${baseFontSize}px`"></page-meta>
	<view class="padbg">
		<view class="pd">
			<view class="box">
				<view class="row1 flex-row items-center justify-between">
					<view>商品名称</view>
					<input v-model="form.productName" placeholder="请输入商品名称" :disabled="show" />
				</view>
				<view class="row2">请上传林权证或承包合同</view>
				<view v-if="show">
					<!-- <up-album :urls="imgList" singleSize="180rpx" multipleSize="180rpx"></up-album> -->
					<view class="flex-wrap" v-for="(item,id) in imgList" :key="id">
						<image :src="item" mode="aspectFill" class="img" @click="showImg"></image>
					</view>
				</view>
				<view v-else>
					<SmtUpload :fileList="fileList" @newFileList="newFileList" :maxCount="10" :upStyle="upStyle">
					</SmtUpload>
				</view>
			</view>
			<view v-if="!show" class="btn justify-center items-center" :class="forbidden?'forbidden':''" @click="add">提交
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getAuthInfo, getFontSize } from '@/utils/local-storage'
	import SmtUpload from '@/components/smt-upload/index.vue'
	import {
		getCertificateApplyDetail,
		addCertificateApply
	} from '@/api/pagesHome/selfProductionRegistration/index'

	// 根字体大小
	const baseFontSize = ref<number>(1)
	// 认证信息
	const authInfo = getAuthInfo()
	// 是否可操作
	const show = ref<boolean>(false)
	// 表单
	const form = ref({
		authFile: "",
		idcardAddress: "",
		idcardNumber: "",
		productName: "",
		realName: ""
	})

	// 判断是否为空
	const have = (e : any) => {
		return e !== null && e !== undefined && e !== ''
	}

	// 上传图片
	const fileList = ref<any>([])
	const newFileList = (a : any, b : any) => {
		const urlList : any = []
		b.forEach((e : any) => {
			urlList.push(e.visitUrl)
		});
		form.value.authFile = urlList
	}
	const upStyle = ref<any>({
		width: '140rpx',
		height: '140rpx'
	})

	// 图片列表
	const imgList = ref<any>([])
	// 根据id获取表单内容
	const getForm = async (id : string) => {
		const res : any = await getCertificateApplyDetail({ id: id })
		if (res.success) {
			imgList.value = []
			form.value = res.data
			res.data.authFile.forEach((e : any) => {
				imgList.value.push(e)
			})
		}
	}

	// 提交时禁用按钮？
	const forbidden = ref<boolean>(false)
	// 新增自产登记
	const add = async () => {
		if (have(form.value.productName) && have(form.value.authFile)) {
			uni.showLoading({
				title: '订单提交中',
				mask: true
			});
			forbidden.value = true
			const res : any = await addCertificateApply(form.value)
			if (res.success) {
				uni.hideLoading();
				forbidden.value = false
				uni.showModal({
					title: '提示',
					content: '提交成功',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
			} else {
				uni.hideLoading();
				forbidden.value = false
				uni.showToast({
					title: res.msg,
					icon: "none"
				})
			}
		} else {
			uni.showToast({
				title: '请填入完整信息',
				icon: "none"
			});
		}
	}
	
	// 查看图片
	const showImg = (id: any) => {
		uni.previewImage({
			current: id,
			urls: imgList.value
		})
	}

	onLoad((e : any) => {
		if (have(authInfo) && authInfo.authStatus === 1) {
			if (have(authInfo.idcardNumber)) {
				form.value.idcardAddress = authInfo.address
				form.value.idcardNumber = authInfo.idcardNumber
				form.value.realName = authInfo.name
			} else {
				form.value.idcardAddress = authInfo.legalAddress
				form.value.idcardNumber = authInfo.legalIdcardNumber
				form.value.realName = authInfo.legalPerson
			}
		}
		if (e.show === '1') {
			show.value = true
			getForm(e.id)
		}
	})
	onShow(() => {
		baseFontSize.value = getFontSize()
	})
</script>

<style lang="scss" scoped>
	.pd {
		padding: 24rpx;

		.box {
			padding: 24rpx;
			background-color: #fff;
			border-radius: $radius1;

			.row1 {
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid $sbgcolor7;
				font-size: $text2;

				input {
					text-align: end;
					width: 500rpx;
				}
			}
			
			.row2 {
				margin: 24rpx 0;
				font-size: $text2;
				color: $sbgcolor4;
				line-height: $text2;
			}
			
			.img {
				width: $imgw3;
				height: $imgh3;
			}
		}

		.btn {
			padding: 24rpx 0;
			width: 702rpx;
			line-height: $title2;
			background: $sbgcolor1;
			border-radius: $radius2;
			font-size: $title2;
			color: #FFFFFF;
			position: fixed;
			bottom: 92rpx;
		}
	}
</style>