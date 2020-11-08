/** @format */

import React, { useState, useEffect } from 'react'
import { Menu } from 'antd'
import { Link, useHistory } from 'react-router-dom'
// import * as allIcons from '@ant-design/icons/es'
import Icon from '@/components/Icon'
// import GlobalStore from '@/store/global'
// import {IMenuTree} from '@/interface/system'
import { getStore, setStore } from '@/utils/store'
import GlobalStore from '@/store/global'

const { SubMenu } = Menu

export default () => {
  const [current, setCurrent] = useState<any>()
  // const {menus} = GlobalStore.useContainer()
  const [activeSubMenu, setActiveSubMenu] = useState(getStore('activeSubMenu') || ['sum'])
  const history = useHistory()
  const routerUrl: any = history.location.pathname
  const { menus } = GlobalStore.useContainer()

  const handleClick = e => {
    setCurrent(e.key)
  }

  useEffect(() => {
    setCurrent(routerUrl)
  }, [routerUrl])

  // const renderMenuItem = ({id, path, title}) => {
  //   return (
  //     <Menu.Item key={id}>
  //       <Link to={path}>{title}</Link>
  //     </Menu.Item>
  //   )
  // }

  // const renderSubMenu = ({id, path, title, children}: IMenuTree) => {
  //   return (
  //     <Menu.SubMenu key={id} title={<span>{title}</span>}>
  //       <Menu.Item key="11">
  //         <Link to="/home">sss</Link>
  //       </Menu.Item>
  //     </Menu.SubMenu>
  //   )
  // }
  // console.log(history)
  const onOpenChange = strArr => {
    setActiveSubMenu(strArr)
    setStore('activeSubMenu', strArr)
  }

  useEffect(() => {
    if (history.location.pathname == '/card/getCardList') {
      setCurrent('getCardList')
    }
  }, [history.location.pathname])

  const createMenu = (menuData => {
    //创建菜单
    //let itemIndex = 0; //累计的每一项索引
    let submenuIndex = 0 //累计的每一项展开菜单索引
    let menu = []
    const create = (menuData, el) => {
      for (let i = 0; i < menuData.length; i++) {
        if (menuData[i].menuState == '0') {
          if (menuData[i].children) {
            //如果有子级菜单
            let children = []
            create(menuData[i].children, children)
            submenuIndex++
            el.push(
              <SubMenu
                key={`sub${submenuIndex}`}
                title={
                  <span style={{ height: '100%', display: 'block' }}>
                    {menuData[i].icon ? <Icon type={menuData[i].icon} /> : null}
                    {menuData[i].menuName}
                  </span>
                }>
                {children}
              </SubMenu>,
            )
          } else {
            //如果没有子级菜单
            //itemIndex++;

            el.push(
              <Menu.Item key={menuData[i].pageRouteUrl} title={menuData[i].menuName}>
                <Link to={menuData[i].pageRouteUrl}>
                  {menuData[i].icon ? <Icon type={menuData[i].icon} /> : null}
                  <span>{menuData[i].menuName}</span>
                </Link>
              </Menu.Item>,
            )
          }
        }
      }
    }

    create(menuData, menu)
    return menu
  })(menus)

  return (
    <Menu
      theme="dark"
      onClick={handleClick}
      onOpenChange={onOpenChange}
      selectedKeys={current}
      openKeys={activeSubMenu}
      mode="inline">
      {createMenu}
    </Menu>
  )
}
