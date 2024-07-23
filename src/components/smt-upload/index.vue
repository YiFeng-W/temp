<template>
	<view>
		<u-upload v-if="custom" :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
			:maxCount="maxCount" maxSize="5mb" :width="upStyle.width" :height="upStyle.height" :previewImage="!previewImage">
			<slot></slot>
		</u-upload>
		<u-upload v-else :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
			:maxCount="maxCount" maxSize="5mb" :width="upStyle.width" :height="upStyle.height" :previewImage="!previewImage">
		</u-upload>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue';
	import { getToken } from '@/utils/local-storage'
	import { onLoad } from '@dcloudio/uni-app';
	// 获取运行环境对应网关
	import { packApiUrl } from "@/config";

	// 父传子
	// let props = defineProps<{
	//   fileList: any;
	//   maxCount: number;
	//   upStyle: { width: string; height: string };
	//   uploadUrl?: string;
	// 	custom?: boolean;
	// 	previewImage?: boolean;
	// 	disabled?: boolean
	// }>()
	let props = defineProps({
		fileList: {
			type: Array,
			required: true
		},
		maxCount: {
			type: Number,
			default: 1,
			required: false
		},
		upStyle: {
			type: Object,
			default: {
				width: '160rpx',
				height: '160rpx'
			},
			required: false
		},
		uploadUrl: {
			type: String,
			default: packApiUrl('/user/upload/v1/uploadImages?classify=1'),
			required: false
		},
		custom: {
			type: Boolean,
			default: false,
			required: false
		},
		previewImage: {
			type: Boolean,
			default: false,
			required: false
		}
	})
	// 存储上传后返回的数据的内容
	let returnData = ref<any>([])
	// 上传图片
	let fileList1 : any = props.fileList;

	// 判断是否有值
	const have = (e : any) => {
		return e !== undefined && e !== null && e !== ''
	}

	// 子传父
	const emit = defineEmits(['newFileList'])

	// 删除图片
	const deletePic = (event : any) => {
		// fileList1 = props.fileList;
		fileList1.splice(event.index, 1);
		returnData.value.splice(event.index, 1)
		emit('newFileList', fileList1, returnData.value)
	};
	// 新增图片
	const afterRead = async (event : any) => {
		// fileList1 = props.fileList;
		// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
		if (have(getToken())) {
			let lists : any[] = [].concat(event.file);
			let fileListLen = fileList1.length;
			lists.map((item) => {
				fileList1.push({
					...item,
					status: 'uploading',
					message: '上传中',
				});
			});
			for (let i = 0; i < lists.length; i++) {
				const result : any = await uploadFilePromise(lists[i].url, i);
				let item = fileList1[fileListLen];
				fileList1.splice(fileListLen, 1, {
					...item,
					status: 'success',
					message: '',
					url: have(result.visitUrl) ? result.visitUrl : have(result.bankCardPath) ? result.bankCardPath : result
				});
				returnData.value.push(result)
				fileListLen++;
			}
			emit('newFileList', fileList1, returnData.value)
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	};
	const uploadFilePromise = (url : any, i : number) => {
		return new Promise((resolve, reject) => {
			let a = uni.uploadFile({
				url: props.uploadUrl, // 仅为示例，非真实的接口地址
				filePath: url,
				name: 'file',
				header: {
					'authentication': getToken(),
				},
				success: (res : any) => {
					if (res.statusCode === 200 && JSON.parse(res.data).success) {
						setTimeout(() => {
							const data = JSON.parse(res.data)
							if (have(data.data[0])) {
								resolve(data.data[0]);
							} else {
								resolve(data.data);
							}
						}, 1000);
					} else {
						uni.showToast({
							// title: res.msg,
							title: '图片上传失败,请上传正确的图片且图片大小不超过5mb',
							icon: "none",
							duration: 3000
						});
						for (var i : number = 0; i < fileList1.length; i++) {
							if (fileList1[i].thumb === url) {
								fileList1.splice(i, 1);
							}
						}
					}
				},
				fail(err : any) {
					uni.showToast({
						title: err.errMsg,
						icon: "none",
					});
				}
			});
		});
	};

	onLoad(() => {

	})
</script>

<style lang="scss" scoped></style>