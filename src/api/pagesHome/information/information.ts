import {request} from "@/utils/request"

// 查看新闻内容
export const getArticleVisit = (data: {id: string}) => {
    return request("/user/articleVisit/v1/getArticleVisit", 'POST', data)
}

// 收藏新闻
export const addVisitCount = (data: {id: string;userId: string}) => {
    return request("/user/articleVisit/v1/addVisitCount", 'POST', data)
}

// 取消收藏
export const removeCoCount = (data: {id: string;userId: string}) => {
    return request("/user/articleVisit/v1/removeCoCount", 'POST', data)
}
