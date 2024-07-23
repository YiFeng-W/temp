import {request} from "@/utils/request"

// 获取扫码订单列表
export const getQrOrderList = (data: object) => {
    return request("/user/qrcodeOrder/v1/getQrOrderList", 'POST', data)
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

// 获取代理订单列表
export const getProxyOrderList = (data: object) => {
    return request("/user/bnRubberStation/v1/proxyOrderList", 'POST', data)
}