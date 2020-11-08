/** @format */
import React from 'react'
import { Form, Input, Button } from 'antd'
import { useHistory } from 'react-router-dom'
import GlobalStore from '@/store/global'
import { loginApi } from '@/api/auth'
import './login.less'
import { useBoolean } from '@umijs/hooks'
import { CLIENT_SECRET } from '@/config'
import TagViewStore from '@/store/tag-view'
const NormalLoginForm = () => {
  const { delAllView } = TagViewStore.useContainer()
  const loading = useBoolean(false)
  const { updateToken } = GlobalStore.useContainer()
  const { replace } = useHistory()
  const onFinish = values => {
    loading.setTrue()
    loginApi({
      ...values,
      clientId: '6da855d8-557b-4bde-a24c-6a39a4acfda2',
      clientSecret: CLIENT_SECRET,
      platform: 45,
    })
      .then((res: any) => {
        loading.setFalse()
        updateToken(res.data.accessToken)
        delAllView()
        replace('/index/index')
      })
      .catch(err => {
        loading.setFalse()
      })
  }

  return (
    <div id="login-container">
      <div className="loginBox">
        {/* <img src={loginPic} /> */}
        <Form className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
          {/* <Form.Item>
            <span className="login-title">华胜运营管理后台</span>
          </Form.Item> */}
          <div className="login-title">
            <span>华胜运营管理后台</span>
          </div>
          <Form.Item name="loginName" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="account" className="input-wedth" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input type="password" placeholder="Password" className="input-wedth" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={loading.state} htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default NormalLoginForm
