/** @format */

// /** @format */

import {IBase} from './common'

// 卡券详情
export interface IMenuDetails extends IBase {
  menuId: number //菜单ID
  id?: number // ID,添加时可以没有id
  parentId: number | null //父级Id
  menuName: string //卡券名称
  type: string //类型
  menuState: string //状态
  icon: string //图标
  sortNum: number //排序
  permissionCode: number //权限码
  delFlag: number // 是否删除
  children?: Menu[] //
  remark: string
  clientId: string
  assemblyUrl: string //组件路径
  pageRouteUrl: string //页面路由
}

// 菜单对象
export interface Menu extends IMenuDetails {
  id: number // ID
}

/**
 * 字典
 */
export interface IDict extends IBase {
  /** 名称 */
  dictLabel: string
  /** 值 */
  dictValue: string
}

// 角色详情
export interface IRolsDetails extends IBase {
  roleName: string //角色名称
  roleId?: number //角色ID
  sortNum: string //显示顺序
  roleDesc: string //角色描述
  roleCode: string //角色编号
  dsScope: number //数据范围:(1:全部数据权限, 2:自定义数据权限,3:本部门数据权限,4:本部门以及一下数据权限)
  delFlag: string //删除标识: 0正常, 0:删除
  clientId: string //应用编号
}

// 用户详情
export interface IUser extends IRolsDetails {
  memberId: string
  userId: string
  memberName: string
  loginName: string
  dutyCode: string
  dutyName: string
  compCode: string
  compName: string
  compTel: string
  deptCode: string
  deptName: string
  areaCode: string
  dutType: number
  faceImage: string
  customId: string
  serialNumber: string
  email: string
  nickName: string
  dutyFunctionId: string
  dutyRankId: string
  appAddress: string
  deployType: number
  versionCanaryType: number
  deployStatus: number
  areaName: string
  appUpDes: string
  h5Address: string
  versionCode: string
  versionCanaryCode: string
  token: string
  createTime: string
  profileId: string
  roleList: IRolsDetails[]
  carnoCode: string
  userState: string //状态
  clientId: string //应用编号
}

export type IDictType = {
  [key in string]: any
}
export type IDictCategoryType = {
  [key in string]: any
}
