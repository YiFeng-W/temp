import { request } from "@/utils/request"

// 获取当前用户银行卡信息详情
export const getUserBankInfoDetail = () => {
    return request("/user/userBankInfo/v1/getUserBankInfoDetail", 'POST')
}

// 添加银行卡信息
export const addUserBankInfo = (data: object) => {
    return request("/user/userBankInfo/v1/addUserBankInfo", 'POST', data)
}

// 修改银行卡信息
export const updateUserBankInfo = (data: object) => {
    return request("/user/userBankInfo/v1/updateUserBankInfo", 'POST', data)
}
