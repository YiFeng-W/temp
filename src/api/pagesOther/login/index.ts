import { request } from "@/utils/request";

// 获取验证码
export const sendCode = (data: { phoneNumber: string }) => {
  return request("/user/sms/v1/sendCode", "POST", data);
};

// 用户注册
export const userRegister = (data: object) => {
  return request("/user/user/v1/userRegister", "POST", data);
};

// 用户登录
export const userLogin = (data: object) => {
  return request("/user/user/v1/userLogin", "POST", data);
};
