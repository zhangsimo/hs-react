/** @format */

import React, {useState, useEffect} from 'react'
import {Menu} from 'antd'
import {Link, useHistory} from 'react-router-dom'
// import * as allIcons from '@ant-design/icons/es'
import Icon from '@/components/Icon'
// import GlobalStore from '@/store/global'
// import {IMenuTree} from '@/interface/system'
import {getStore, setStore} from '@/utils/store'
import GlobalStore from '@/store/global'

const {SubMenu} = Menu

export default () => {
  const [current, setCurrent] = useState<any>()
  // const {menus} = GlobalStore.useContainer()
  const [activeSubMenu, setActiveSubMenu] = useState(getStore('activeSubMenu') || ['sum'])
  const history = useHistory()
  const routerUrl: any = history.location.pathname
  const {menus} = GlobalStore.useContainer()

  const handleClick = e => {
    setCurrent(e.key)
  }

  useEffect(() => {
    setCurrent(routerUrl)
  }, [routerUrl])

  // console.log(history)
  const onOpenChange = strArr => {
    setActiveSubMenu(strArr)
    setStore('activeSubMenu', strArr)
  }

  useEffect(() => {
    if (history.location.pathname == '/card/getCardList') {
      setCurrent('/card/getCardList')
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
          if (menuData[i].children && menuData[i].children[0].menuState == '0') {
            //如果有子级菜单
            let children = []
            create(menuData[i].children, children)
            submenuIndex++
            el.push(
              <SubMenu
                key={`sub${submenuIndex}`}
                title={
                  <span style={{height: '100%', display: 'block'}}>
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
      mode="inline"
      // defaultOpenKeys={['sum']}
      // defaultSelectedKeys={['dataSurvey']}
    >
      {/* <Menu.Item key="index">
        <MenuOutlined /> <Link to="/index">首页</Link>
      </Menu.Item> */}

      {createMenu}

      {/* <SubMenu
        key="client"
        title={
          <span>
            <UserOutlined />
            <span>客户管理</span>
          </span>
        }>
        <Menu.Item key="1">
          <Link to="/index">客户列表</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="vipMember"
        title={
          <span>
            <TeamOutlined />
            <span>会员管理</span>
          </span>
        }>
        <Menu.Item key="2">
          <Link to="/vipMember/list">会员列表</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="car"
        title={
          <span>
            <CarOutlined />
            <span>车辆管理</span>
          </span>
        }>
        <Menu.Item key="3">
          <Link to="/index">车辆列表</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="goods"
        title={
          <span>
            <ShopOutlined />
            <span>商品管理</span>
          </span>
        }>
        <Menu.Item key="4">
          <Link to="/index">商品列表</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="order"
        title={
          <span>
            <BarsOutlined />
            <span>订单管理</span>
          </span>
        }>
        <Menu.Item key="5">
          <Link to="/index">订单列表</Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/index">售后申请</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="card"
        title={
          <span>
            <CreditCardOutlined />
            <span>卡券管理</span>
          </span>
        }>
        <Menu.Item key="cardConfig">
          <Link to="/cardConfig">卡券列表</Link>
        </Menu.Item>
        <Menu.Item key="getCardList">
          <Link to="/getCardList">卡券明细</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="huodong"
        title={
          <span>
            <GiftOutlined />
            <span>活动管理</span>
          </span>
        }>
        <Menu.Item key="7">
          <Link to="/index">活动列表</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="bigClient"
        title={
          <span>
            <TeamOutlined />
            <span>大客户管理</span>
          </span>
        }>
        <Menu.Item key="8">
          <Link to="/index">大客户列表</Link>
        </Menu.Item>
        <Menu.Item key="9">
          <Link to="/index">大客户账号管理</Link>
        </Menu.Item>
        <Menu.Item key="10">
          <Link to="/index">大客户成员管理</Link>
        </Menu.Item>
        <Menu.Item key="11">
          <Link to="/index">大客户车辆管理</Link>
        </Menu.Item>
        <Menu.Item key="12">
          <Link to="/index">大客户权益管理</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="memSet"
        title={
          <span>
            <SettingOutlined />
            <span>会员设置</span>
          </span>
        }>
        <Menu.Item key="13">
          <Link to="/index">积分规则设置</Link>
        </Menu.Item>
        <Menu.Item key="14">
          <Link to="/index">积分清零设置</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="data"
        title={
          <span>
            <FundOutlined />
            <span>数据概况</span>
          </span>
        }>
        <Menu.Item key="dataSurvey">
          <Link to="/dataSurvey">卡券统计</Link>
        </Menu.Item>
      </SubMenu>

      <SubMenu
        key="system"
        title={
          <span>
            <FundOutlined />
            <span>系统管理</span>
          </span>
        }>
        <Menu.Item key="menu">
          <Link to="/system/menu">菜单管理</Link>
        </Menu.Item>
        <Menu.Item key="user">
          <Link to="/system/user">用户管理</Link>
        </Menu.Item>
        <Menu.Item key="role">
          <Link to="/system/role">角色权限</Link>
        </Menu.Item>
      </SubMenu> */}
    </Menu>

    // <Menu.Item key="0">
    //   <Link to="/dataSurvey">首页</Link>
    // </Menu.Item>
    // <Menu.Item key="1">
    //   <Link to="/cardConfig">卡券列表</Link>
    // </Menu.Item>
    // <Menu.Item key="2">
    //   <Link to="/getCardList">卡券明细</Link>
    // </Menu.Item>
    // <Menu.Item key="3">
    //   <Link to="/dataSurvey">卡券统计</Link>
    // </Menu.Item>
  )
}
