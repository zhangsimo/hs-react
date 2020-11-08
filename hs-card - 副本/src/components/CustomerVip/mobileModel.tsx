/** @format */

import React, { useState, useEffect } from 'react'
import './style.less'
import { Form, Input, Modal, Spin, Row, Col, Button, message, } from 'antd'
import * as api from '@/api'
// import { concealPhone } from '@/interface/customer'
import { useHistory } from 'react-router-dom'
interface IProps {
  mobile,
  codeShow,
  setCodeShow
}
const mobileModel: React.FC<IProps> = props => {
  const history = useHistory()
  const [formMenu] = Form.useForm()
  const [disable, setDisable] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>('获取验证码')
  const [mobile, setMobile] = useState<string>('')
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    setLoading(false)
    setMenuVisible(props.codeShow)
    formMenu.setFieldsValue({ mobile: props.mobile })
    setMobile(props.mobile)
  })
  const reSet = () => {
    formMenu.resetFields()
  }
  const getCode = () => api.getCumstomerSendSmsCode({ 'mobile': mobile }).then(res => res.data)

  const onMenuCancel = () => {
    reSet()
    setMenuVisible(false)
    props.setCodeShow(false)
  }
  const handleComfim = () => {
    let params = (formMenu.getFieldValue as any)()
    api.getCumstomerValidateCodeSave(params).then(res => {
      console.log(res)
      if (res.code === 1) {
        message.success('核实客户手机号码验证成功！')
        history.push(`/customer/list`)
      } else {
        message.error('验证码有误！')
      }
    })
  }
  const handleClick = e => {
    getCode()
    setDisable(true)
    let count = 60;
    setMsg("还剩" + count + "s")
    let TimeO = setInterval(() => {
      setMsg("还剩" + --count + "s")
      if (count < 0) {
        clearInterval(TimeO);
        setMsg("获取验证码")
        setDisable(false)
      }
    }, 1000);
  }
  return (
    <div id='mobileModel'>
      <Modal visible={menuVisible} onCancel={onMenuCancel} onOk={handleComfim} width={450} getContainer={false}>
        <Spin spinning={loading}>
          <Form form={formMenu} >
            <Row>
              <Col span={18}>
                <Form.Item name="mobile" label="手机号">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={21}>
                <Form.Item name="smsCode" label="验证码">
                  <Input placeholder='请输入验证码'></Input>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button onClick={handleClick} type="primary" disabled={disable} className='codeBtn'>
                  {msg}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item labelCol={{ span: 3 }}>
                  <p className='point'>验证码将发送到客户手机，请客户提供验证码并录入</p>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default mobileModel
