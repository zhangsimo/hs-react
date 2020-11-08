/** @format */

import React, {useState} from 'react'
// import {Link} from 'react-router-dom'
// import Breadcrumb from './breadcrumb'
import {useHistory} from 'react-router-dom'
import GlobalStore from '@/store/global'

import TagViewStore from '@/store/tag-view'
import {Tabs, Button, Modal, Form, Input} from 'antd'
import {UserOutlined} from '@ant-design/icons'
// import GlobalStore from '@/store/global'
// import Logo from '@/assets/image/logo.png'

const Header = () => {
  const {replace} = useHistory()
  const {logout, user} = GlobalStore.useContainer()
  const [form] = Form.useForm()

  const {tagViews, currentView, delView, delAllView} = TagViewStore.useContainer()
  // console.log('tagViewstagViews', tagViews);
  const history = useHistory()
  const onLogout = () => {
    logout()
    replace('/register/login')
    delAllView()
  }

  console.log(user)
  const [visible, setVisible] = useState(false)

  // const onCollapse = useCallback(async (collapsed: boolean) => {
  //   setCollapsed(collapsed)
  // }, [])

  // useEffect(() => {
  //   form.setFieldsValue({...user})
  //   console.log(user)
  // }, [])

  function onClose(key) {
    if (tagViews.length === 1) {
      return
    }
    let view = tagViews.find(item => item.pathname === key)
    // console.log('view-view-view', view);
    // if (key.includes('?')) {
    //   var arr = key.split('?')[0]
    //   view = tagViews.find(item => item.pathname === arr)
    // }
    if (!view) {
      return
    }
    delView(view)
    if (currentView.pathname === view.pathname) {
      tagViews[tagViews.length - 2] && history.push(tagViews[tagViews.length - 2])
    }
  }
  function onChangeTab(key) {
    // console.log(key);
    let a = null
    // if (key.includes('?')) {
    //   var arr = key.split('?')[0]
    //   a = tagViews.find(item => item.pathname === arr)
    //   a && history.push(key)
    // } else {
    // }
    
    a = tagViews.find(item => item.pathname === key)
    a && history.push(a)
    // console.log('a-a-a-a', a);
  }
  const onShowUser = e => {
    form.setFieldsValue({...user})
    setVisible(true)
  }

  const handleCancel = e => {
    setVisible(false)
  }

  return (
    <>
      <div className="logo">
        {/* <img /> */}
        <span className="logo-name">华胜运营管理后台</span>
      </div>
      <div className="tag-view">
        <Tabs
          hideAdd
          size="small"
          type="editable-card"
          activeKey={currentView.pathname}
          onChange={onChangeTab}
          onEdit={onClose}>
          {tagViews.map((view, index) => (
            <Tabs.TabPane
              tab={view.state && view.state.title}
              key={view.pathname}
              closable={index !== 0 ? true : false}
            />
          ))}
        </Tabs>
      </div>
      {/* <div className="breadcrumb">
        <Breadcrumb />
      </div> */}
      <div className="header-right">
        <div>
          <Button type="link" onClick={onShowUser}>
            <UserOutlined /> <span style={{color: '#333'}}>{user?.memberName}</span>
          </Button>
        </div>
        |
        <div className="sign-out">
          <Button type="link" onClick={onLogout}>
            退出
          </Button>
        </div>
      </div>

      <Modal title="用户信息" visible={visible} footer={null} onCancel={handleCancel}>
        <Form labelCol={{span: 5}} wrapperCol={{span: 14}} layout="horizontal" form={form} size="middle">
          <Form.Item label="用户名称" name="memberName">
            <Input placeholder="用户名称" disabled />
          </Form.Item>
          <Form.Item label="公司名称" name="compName">
            <Input placeholder="公司名称" disabled />
          </Form.Item>
          <Form.Item label="手机号码" name="mobile">
            <Input placeholder="手机号码" disabled />
          </Form.Item>
          <Form.Item label="职位名称" name="dutyName">
            <Input placeholder="职位名称" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Header
