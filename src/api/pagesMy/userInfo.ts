import {request} from "@/utils/request"

// 获取个人信息认证
export const getAuthIndividual = (data: object) => {
    return request("/user/authIndividual/v1/get", 'POST', data)
}

// 添加个人信息认证
export const addAuthIndividual = (data: object) => {
    return request("/user/authIndividual/v1/add", 'POST', data)
}

// 获取企业认证详情
export const getCurrentUserAuthCompany = () => {
    return request("/user/authCompany/v1/getCurrentUserAuthCompany", 'POST')
}

// 提交企业认证
export const addAuthCompany = (data: object) => {
    return request("/user/authCompany/v1/addAuthCompany", 'POST', data)
}

// 生成身份信息码
export const generateIdCardQrCode = () => {
    return request("/user/user/v1/generateIdCardQrCode", 'POST')
}

// 根据ID获取胶农信息
export const getUserInfo = (data: object) => {
    return request("/user/bnRubberStation/v1/getUserInfo", 'POST',  data)
}
