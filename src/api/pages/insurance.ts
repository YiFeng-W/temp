import { request } from "@/utils/request";

// 获取轮播图列表
export const getClaimRecords = (data: object) => {
  return request("/user/claim/v1/getClaimRecords", "POST", data);
};