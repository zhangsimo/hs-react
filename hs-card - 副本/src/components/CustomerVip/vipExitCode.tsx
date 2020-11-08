/** @format */

import React, { useState, useEffect } from 'react'
import './style.less'
import { Form, Input, Modal, Spin, Row, Col, Button, } from 'antd'

// import * as api from '@/api'

interface IProps {
  codeShow,
  setCodeShow
}
const vipPop: React.FC<IProps> = props => {
  const [formMenu] = Form.useForm()
  const [disable, setDisable] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>('发送验证码')
  const [menuVisible, setMenuVisible] = useState<boolean>(false)

  const [title] = useState<string>('修改会员资料')
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    setLoading(false)
    setMenuVisible(props.codeShow)
  })
  const reSet = () => {
    formMenu.resetFields()
  }


  const onMenuCancel = () => {
    reSet()
    setMenuVisible(false)
    props.setCodeShow(false)
  }
  const handleClick = e => {
    setDisable(true)
    let count = 60;
    setMsg("还剩" + count + "s")
    let TimeO = setInterval(() => {
      setMsg("还剩" + --count + "s")
      if (count < 0) {
        clearInterval(TimeO);
        setMsg("发送验证码")
        setDisable(false)
      }
    }, 1000);
  }

  return (
    <div id='vipPop' className="vippopc block">
      <Modal title={title} visible={menuVisible} onCancel={onMenuCancel} width={500} getContainer={false}>
        <Spin spinning={loading}>
          <Form form={formMenu} >
            <Row>
              <Col span={12}>
                <Form.Item name="menuName" label="新手机号">
                  <Input></Input>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button onClick={handleClick} type="primary" disabled={disable}>
                  {msg}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item name="menuName" label="验证码">
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default vipPop
