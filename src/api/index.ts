import {request} from "@/utils/request"

// 当前用户认证信息
export const userAuthInfo = () => {
    return request("/user/user/v1/userAuthInfo", 'POST')
}

// 获取个人信息认证
export const getPersonalAuthentication = (data: {id: string}) => {
    return request("/user/authIndividual/v1/get", 'POST', data)
}

// 获取企业认证详情
export const getCurrentUserAuthCompany = () => {
    return request("/user/authCompany/v1/getCurrentUserAuthCompany", 'POST')
}

// 获取密码盐
export const saveApplyInfo = () => {
    return request("/user/salt/v1/saveApplyInfo", 'POST')
}