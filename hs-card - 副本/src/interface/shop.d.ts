/** @format */

import {IBase} from './common'

export interface IShop extends IBase {
  id: number
  /** 学校id */
  tenant_id: number
  /** 商店分类 */
  category_id: number
  /** 商店管理员id */
  user_id: number
  /** 名称 */
  name: string
  /** 商店logo */
  logo: string
  /** 电话  */
  mobile: string
  /** 介绍 */
  intro: string
  /** 地址 */
  address: string
  /** 经度 */
  longitude: number
  /** 纬度 */
  latitude: number
  /** 营业时间 */
  business_hours: string
  /** 通知 */
  notice: string
  /** 运费 */
  postage: number
  /** 销量 */
  sale_count: number
  /**
   * 状态
   * 1 营业 2 不营业 0 关闭
   */
  status: 0 | 1 | 2
  /** 是否删除 1：删除 */
  is_del: 0 | 1
  /** 排序 */
  sort: number
  /** 备注 */
  remark: string
}

export type DtoShopCreate = Omit<IShop, 'id' | 'is_del' | 'sale_count' | 'category_id'>
export type DtoShopUpdate = Omit<IShop, 'id' | 'tenant_id' | 'sale_count' | 'is_del'>

/**
 * 优惠券， 满减
 */
export interface ICoupon extends IBase {
  id: number
  /** 学校id */
  college_id: number
  /** 门店 */
  shop_id: number
  name: string
  /** 优惠券类型， 1： 店铺优惠券 2： 新人店铺优惠券 */
  used: 1 | 2
  /** 满多少金额 */
  amount: number
  /** 优惠金额 */
  discounts_amount: number
  /** 开始使用时间 */
  valid_start_time: string
  /** 结束使用时间 */
  valid_end_time: string
  /**
   * 状态
   * 1 启用 0 不启用
   */
  status: 0 | 1
  /** 排序 */
  sort: number
}

/** 创建 */
export type DtoCouponCreate = Omit<ICoupon, 'id' | 'college_id' | 'shop_id'>
/** 更新 */
export type DtoCouponUpdate = Omit<ICoupon, 'id' | 'college_id' | 'shop_id'>

/**
 * 评论
 */
export interface IComment extends IBase {
  id: number
  /** 订单id */
  order_id: number
  /** 学校id */
  college_id: number
  /** 商店 */
  shop_id: number
  /** 商店管理员id */
  user_id: number
  user_name: string
  user_icon: string
  /** 评论 */
  comment: string
  /** 附件 */
  attach: string
  /** 回平 */
  answer: string
  /**
   * 状态
   * 1 启用 0 不启用
   */
  status: 0 | 1
  /** 排序 */
  sort: number
}

/** 创建评论 */
export type DtoCommentCreate = Pick<
  IComment,
  'order_id' | 'college_id' | 'shop_id' | 'user_icon' | 'comment' | 'attach'
>
/** 更新评论 */
export type DtoCommentUpdate = Pick<IComment, 'comment' | 'attach' | 'answer' | 'status'>
/** 回答 */
export type DtoAnswerCreate = Pick<IComment, 'answer'>
