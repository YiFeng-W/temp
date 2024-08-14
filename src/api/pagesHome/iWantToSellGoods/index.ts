import { request } from '@/utils/request'

// 获取当前用户自产证明信息列表
export const getCurrentUserCertificateInfoList = (data: any) => {
  return request('/user/certificateInfo/v1/getCurrentUserCertificateInfoList', 'POST', data)
}

// 添加扫码订单
export const addQrCodeOrder = (data: any) => {
  return request('/user/qrcodeOrder/v1/addQrCodeOrder', 'POST', data)
}

// 获取扫码订单详情
// export const getQrOrderDetail = (data: {orderId?: string;orderNumber?: string}) => {
//     return request("/user/qrcodeOrder/v1/getQrOrderDetail", 'POST', data)
// }
export const getQrOrderDetail = (data: { orderId?: string, orderNumber?: string }) => {
  return request('/user/qrcodeOrder/v1/getOrderDetail', 'POST', data)
}

// 绑定订单
export const confirmpay = (data: any) => {
  return request('/user/qrcodeOrder/v1/confirmpay', 'POST', data)
}

// 获取订单扫码状态
export const getQrcodeStatus = (data: { orderId?: string, orderNumber?: string }) => {
  return request('/user/qrcodeOrder/v1/getQrcodeStatus', 'POST', data)
}

// 扫个人码绑定订单
export const bindOrder = (data: any) => {
  return request('/user/qrcodeOrder/v1/bindOrder', 'POST', data)
}

// 扫个人码绑定订单
export const getOpenid = (data: any) => {
  return request('/user/user/v1/getOpenid', 'POST', data)
}

// 修改订单商品图片集
export const updateProductImages = (data: any) => {
  return request('/user/qrcodeOrder/v1/updateProductImages', 'POST', data)
}

// 上传支付凭证并修改订单状态
// 胶站确认收款
export const uploadPayImage = (data: object) => {
  return request('/user/orderRubberExtand/v1/uploadPayImage', 'POST', data)
}

// 胶站生成销售订单
export const rubberStationGenOrder = (data: object) => {
  return request('/user/orderRubberExtand/v1/rubberStationGenOrder', 'POST', data)
}

// 获取胶厂列表
export const getRubberFactoryList = () => {
  return request('/user/rubberFactory/v1/getRubberFactoryList', 'POST')
}

// 获取胶站列表
export const getRubberStationMap = () => {
  return request('/user/bnRubberStation/v1/getRubberStationMap', 'POST')
}

// 获取收购统计信息
export const getStatisticsByType = (data: object) => {
  return request('/user/bnRubberStatisticsLog/v1/getStatisticsByType', 'POST', data)
}

// 根据用户信息获取胶站信息
export const getStationInfoByUser = (data: object) => {
  return request('/user/bnRubberStation/v1/getStationInfoByUser', 'POST', data)
}

// 胶站确认交易
export const confrimStatus = (data: { orderId: string }) => {
  return request('/user/orderRubberExtand/v1/updateCheckStatus', 'POST', data)
}


export const updateUnitPrice = (data: object) => {
  return request('/user/orderRubberExtand/v1/updateUnitPrice', 'POST', data)
}
