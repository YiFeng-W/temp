import { request } from "@/utils/request";

// 获取新闻列表
export const getDetailForArticles = (data: {
  page: number;
  pageSize: number;
  status: number;
}) => {
  return request("/user/articleVisit/v1/getDetailForArticles", "POST", data);
};

// 获取轮播图列表
export const getUserBannerList = () => {
  return request("/user/homeBanner/v1/getUserBannerList", "POST");
};

// 获取ICON图标列表
export const getHomeIconList = (platform: number) => {
  return request("/user/HomeIcon/v1/getHomeIconList?platform=" + platform, "POST");
};

// 获取今日胶价
export const getProductPriceTrendDetail = () => {
  return request("/user/productPriceTrend/v1/getProductPriceTrendDetail", "POST");
};

// 获取今日胶价
export const bindSeller = (data: object) => {
  return request("/user/bnRubberStation/v1/bindSeller", "POST", data);
};

// 获取站点详情
export const getRubberStationDetail = () => {
  return request("/user/bnRubberStation/v1/getRubberStationDetail", "POST");
};
// 获取站点统计信息
export const getRubberStationToatl = () => {
  return request("/user/bnRubberStation/v1/getTodayOrdersInfo", "GET");
};
// 设置胶站价格
export const getSetPrice = (data: object) => {
  return request("/user/bnRubberStation/v1/updateRubberStation", "POST", data);
};

// 获取胶厂信息
export const getFactoryInfo = () => {
  return request("http://47.109.129.34:8091/user/rubberFactory/v1/getRubberFactoryDetail", "GET");
};

// 获取胶厂收胶价格
export const getRubberPrice = (data: { id: any }) => {
  return request("/user/rubberFactory/v1/getRubberPrice", "POST", data);
};

// 获取胶厂今日收胶订单信息
export const getTodayOrdersInfo = () => {
  return request("http://47.109.129.34:8091/user/rubberFactory/v1/getTodayOrdersInfo", "GET");
};

// 设置胶厂收胶价格
export const getSetPriceJC = (data: { id: any, rubberPrice: number }) => {
  return request("/user/rubberFactory/v1/setRubberPrice", "POST", data);
};

// 获取橡胶2409期货数据
export const getRU2409 = () => {
  return request("http://47.109.129.34:8091/user/futures/price", "GET");
};

// 获取当月订单统计
export const orderSummary = (data: object) => {
  return request("http://47.109.129.34:8091/user/orderStatistics/month/summary", "POST", data);
}

// 获取当月订单统计
export const orderListByDay = (data: object) => {
  return request("http://47.109.129.34:8091/user/orderStatistics/day/orderPage", "POST", data);
}