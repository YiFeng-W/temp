import { request } from "@/utils/request"

// 申请开具发票
export const issuEvoice = (data: object) => {
    return request("/user/blueInvoice/v1/addInvoiceAndManyProducts", 'POST', data)
}
//获取开票记录
export const getEvoiceRecords = (data: object) => {
    return request("/user/blueInvoice/v1/getBlueInvoiceList", 'POST', data)
}
// 发票详情
export const getEvoiceDetail = (data: object) => {
    return request("/user/blueInvoice/v1/getBlueInvoice", 'POST', data)
}
// 申请重开
export const reIssuEvoice = (data: object) => {
    return request("/user/blueInvoice/v1/addRedInvoice", 'POST', data)
}
// 发送邮件
export const sendEmail = (data: object) => {
    return request("/user/blueInvoice/v1/sendEmail", 'POST', data)
}
// 获取发票抬头列表
export const getUserInvoiceTitleList = (data: object) => {
    return request("/user/userInvoiceTitle/getUserInvoiceTitleList", 'POST', data)
}
// 删除发票抬头
export const deleteUserInvoiceTitle = (data: object) => {
    return request("/user/userInvoiceTitle/deleteUserInvoiceTitle", 'POST', data)
}
// 获取发票抬头详情
export const getUserInvoiceTitleDetail = (data: object) => {
    return request("/user/userInvoiceTitle/getUserInvoiceTitleDetail", 'POST', data)
}
// 新增发票抬头
export const addUserInvoiceTitle = (data: object) => {
    return request("/user/userInvoiceTitle/addUserInvoiceTitle", 'POST', data)
}
// 新增发票抬头
export const updateUserInvoiceTitle = (data: object) => {
    return request("/user/userInvoiceTitle/updateUserInvoiceTitle", 'POST', data)
}
