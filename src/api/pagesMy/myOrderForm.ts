import {request} from "@/utils/request"

// 获取扫码订单列表
export const getQrOrderList = (data: object) => {
    return request("http://47.109.129.34:8091/user/qrcodeOrder/v1/getQrOrderList", 'POST', data)
}

// 取消订单
export const cancelQrOrder = (data: {
	id: number|string
}) => {
    return request("/user/qrcodeOrder/v1/cancelQrOrder", 'POST', data)
}

// 查看订单二维码
export const getOrderQrcode = (data: {
	orderNumber: number|string
}) => {
    return request("/user/qrcodeOrder/v1/getOrderQrcode", 'POST', data)
}
