import { request } from "@/utils/request"

// 修改密码
export const updatePassword = (data: object) => {
    return request("/user/user/v1/updatePassword", 'POST', data)
}