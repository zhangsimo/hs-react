/**
 * /* 用于控制按钮权限
 *
 * @format
 */

import GlobalStore from '@/store/global'

export default function hasPermi(permi: any): any {
  const {permissions} = GlobalStore.useContainer()
  let index = permissions.indexOf(permi)
  if (index != -1) {
    return false
  } else {
    return true
  }
}
