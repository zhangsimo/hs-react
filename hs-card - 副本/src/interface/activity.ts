/** @format */

// /** @format */

import {IBase} from './common'

// 活动详情
export interface IthemeDetails extends IBase {
  cardId: number
  areaName: string //区域
  compCode: string //所属门店
  subTitle: string //卡券名称
  total: number
}

// 卡券类型详情
export interface IActivityCardDetails extends IBase {
  id: number
  cardId: number
  mainTitle: string
  subTitle: string
  cardType: string
  validType: number
  validDays: string
  validStart: string
  validEnd: string
}

// 活动发送数据字段
