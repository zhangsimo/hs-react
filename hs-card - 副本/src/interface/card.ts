/** @format */

// /** @format */

import {IBase} from './common'

// 卡券详情
export interface ICardDetail extends IBase {
  cardId: number
  areaName: string //区域
  compCode: string //所属门店
  subTitle: string //卡券名称
  cardType: number //券类型
  cardStatus: string //状态
  remainNum: number //剩余库存
  createNum: number //创建量
  drawNum: number //已领量
  creator: string //
  consumNum: number //已消费量
  validStart: Date | string //固定有效开始时间
  validEnd: Date | string //固定有效结束时间
  compName: number //适用门店类型
  createCode: number //已提现
  isOnline: number
  channelName: string
  total: number
}

// 新增卡券
export interface ICardAdd extends IBase {
  cardId: number
  areaName: string //区域
  compCode: string //所属门店
  subTitle: string //卡券名称
  cardType: number //券类型
  cardStatus: string //状态
  remainNum: number //剩余库存
  createNum: number //创建量
  drawNum: number //已领量
  consumNum: number //已消费量
  validDays: number //有效期
  validStart: Date | string //固定有效开始时间
  validEnd: Date | string //固定有效结束时间
  applyType: number //适用门店类型
  createCode: number //已提现
  isOnline: number
}

// 已选的项目：
export interface IselectProject extends IBase {
  itemType: string
  itemName: string //项目类型(1 项目/ 2 工时/3 配件)
  itemCode: string //项目名称
  cardId: number //卡券ID
}
// 已选的工时：
export interface IselectGS extends IBase {
  // itemType: string
  // itemName: string //项目类型(1 项目/ 2 工时/3 配件)
  // itemCode: string //项目名称
  // cardId: number //卡券ID
}

// 卡券领取明细
export interface ICardGetDetails extends IBase {
  cardCode: number //卡券边码
  subTitle: string //卡券名称
  cardType: number //券类型
  cardStatus: string //状态
  channelName: string
  useCase: string
  clientName: string //客户姓名
  mobile: string //手机
  brand: string //车品牌
  carNo: string
  validStart: Date | string //固定有效开始时间
  validEnd: Date | string //固定有效结束时间
  drawDate: string
  useDate: string
  compName: string //适用门店类型
  veriStatus: number //B端核销状态
  veriDate: string //B端核销时间
  veriWay: number
}
