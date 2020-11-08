/** @format */

// 卡券详情
export interface IVipMember {
  menuId: number //菜单ID
  id: number //当前节点id
  parentId: number //父级Id
  menuName: string //卡券名称
  type: string //类型
  menuState: string //状态
  icon: string //图标
  sortNum: number //排序
  permissionCode: number //权限码
  delFlag: number // 是否删除
  children: string[] //
  remark: string
  clientId: string
  assemblyUrl: string //组件路径
  pageRouteUrl: string //页面路由
}
