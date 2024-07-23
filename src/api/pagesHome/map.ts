import { request } from '@/utils/request'

export interface IMapItem {
  cityCode: string
  cityName: string
  code: string
  countyCode: string
  countyName: string
  createTime: string
  createUserId: number
  detailAddress: string
  doorHeadImage: string
  gommuresPrice: number
  id: number
  latitude: number
  longitude: number
  name: string
  phoneNumber: string
  provinceCode: string
  provinceName: string
  remark: string
  rubberPrice: number
  status: number
  updateTime: string
  updateUserId: number
  userName: string
  zipCode: string
}

export const getRubberStationMap = () => {
  return request<IRes<IMapItem[]>>('/user/bnRubberStation/v1/getRubberStationMap', 'POST')
}

export const getRubberFactoryMap = () => {
  return request<IRes<IMapItem[]>>('/user/rubberFactory/v1/getRubberFactoryList', 'POST')
}
