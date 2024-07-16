import {request} from "@/utils/request"

// 获取当前用户自产证明信息列表
export const getCurrentUserCertificateInfoList = (data: any) => {
    return request("/user/certificateInfo/v1/getCurrentUserCertificateInfoList", 'POST', data)
}

// 当前登录用户自产证明列表
export const getCertificateApplyList = (data: any) => {
    return request("/user/certificateApply/v1/getCertificateApplyList", 'POST', data)
}

// 停用自产证明信息
export const enableOrDisableInfo = (data: {ids: []}) => {
    return request("/user/certificateInfo/v1/enableOrDisableInfo", 'POST', data)
}

// 获取自产证明详情
export const getCertificateApplyDetail = (data: {id: string}) => {
    return request("/user/certificateApply/v1/getCertificateApplyDetail", 'POST', data)
}

// 获取自产证明信息详情
export const getInfoDetail = (data: {id: string}) => {
    return request("/user/certificateInfo/v1/getInfoDetail", 'POST', data)
}

// 种植户自产证明提交
export const addCertificateApply = (data: {authFile: string;
																					 idcardAddress: string;
																					 idcardNumber: string;
																					 productName: string;
																					 realName: string}) => {
    return request("/user/certificateApply/v1/addCertificateApply", 'POST', data)
}
