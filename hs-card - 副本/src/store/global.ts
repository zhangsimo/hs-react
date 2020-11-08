/**
 * app数据
 * 包括 app基本信息 路由信息
 *
 * @format
 */
import { useState, useEffect } from 'react'
import _ from 'lodash'
import { createContainer } from 'unstated-next'
import { getStore, setStore, removeStore } from '@/utils/store'
import * as api from '@/api'
import { IUser } from '@/interface'
// import { join } from 'path'
// import {toTreeDate} from '@/utils'

export const useGlobal = () => {
  const [activeNav, setActiveNav] = useState({ path: '/system', title: '系统' })
  // const [menusAll, setMenusAll] = useState<IMenuTree[]>([])
  const [menus, setMenus] = useState<any[]>([])
  /** 需要注册的路由 */
  // const [router, setRouter] = useState<IMenu[]>([])
  const [user, setUser] = useState<IUser>()
  const [token, setToken] = useState<string>(getStore('token'))
  const [dictType, setDictType] = useState<string[]>([])
  const [permissions, setPermissions] = useState<any[]>([])

  // console.log(setMenus)
  useEffect(() => {
    let isUnmounted = false
    if (token) {
      ; (async () => {
        if (!isUnmounted) {
          const userInfo = await api.getUserInfo() //获取用户信息
          const permi: any = await api.getRouteList() //获取菜单、动态路由表、按钮权限
          setMenus(permi.data.menuList)
          setPermissions(permi.data.permissionCodeList)
          setUser(userInfo.data)
          sessionStorage.setItem('memberId', userInfo.data.memberId)
          sessionStorage.setItem('compCode', userInfo.data.compCode)
          sessionStorage.setItem('areaCode', userInfo.data.areaCode)
          const dictType = await api.getDictType() //获取字典
          setDictType(dictType.data)
        }
      })()
    }
    return () => {
      isUnmounted = true
    }
  }, [token])

  const updateToken = data => {
    console.log(data)
    setStore('token', data)
    setToken(data)
  }

  const logout = () => {
    setToken('')
    removeStore('token')
    sessionStorage.clear()
  }

  return {
    user,
    // router,
    activeNav,
    setActiveNav,
    menus,
    dictType,
    token,
    updateToken,
    logout,
    permissions,
  }
}

export default createContainer(useGlobal)
