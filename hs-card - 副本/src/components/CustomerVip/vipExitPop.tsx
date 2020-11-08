/** @format */

import React, { useState, useEffect } from 'react'
import './style.less'
import { Form, Input, Modal, Spin, Row, Col, Button, Radio, } from 'antd'
import VipExitCode from './vipExitCode'


interface IProps {
  menuVisible,
  closeMenuVisible
}
// import * as api from '@/api'
const vipPop: React.FC<IProps> = props => {
  const [from] = Form.useForm()
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  const [title] = useState<string>('修改会员资料')
  const [loading, setLoading] = useState<boolean>(false)
  const [radioVal, setradioVal] = useState<string>('1')
  const [codeShow, setCodeShow] = useState<boolean>(false)
  useEffect(() => {
    setLoading(false)
    setMenuVisible(props.menuVisible)
    from.setFieldsValue({ menuNum: '12345678', menuName: '小米姐姐', menutel: '188888888' })
  })
  const reSet = () => {
    from.resetFields()
  }

  const getCodeShow = e => {
    setCodeShow(e)
  }
  const onMenuCancel = () => {
    reSet()
    setMenuVisible(false)
    setMenuVisible(props.closeMenuVisible)
  }
  const onChange = e => {
    setradioVal(e.target.value)
  }
  return (
    <div id='vipPop' className="vippopc block">
      <Modal title={title} visible={menuVisible} onCancel={onMenuCancel} width={720} getContainer={false}>
        <Spin spinning={loading}>
          <Form form={from} >
            <div className='borttom'>
              <Row>
                <Col span={12}>
                  <Form.Item name="menuNum" label="会员卡号">
                    <Input disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item name="menuName" label="会员姓名">
                    <Input></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <Form.Item name="menutel" label="会员手机号">
                    <Input disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button type="primary" onClick={() => setCodeShow(true)} >修改</Button>
                </Col>
              </Row>
            </div>

            <div>
              <h5 className='currenh5'>当前积分：2000</h5>
              <Radio.Group onChange={onChange} value={radioVal}>
                <Radio value={1}>
                  <Form.Item name="menuName" label="增加积分">
                    <Input></Input>
                  </Form.Item>
                </Radio>
                <Radio value={2}>
                  <Form.Item name="menuName" label="扣减积分">
                    <Input></Input>
                  </Form.Item>
                </Radio>
              </Radio.Group>
              <Row>
                <Col span={12}>
                  <Form.Item name="menuName" label="变动原因">
                    <Input></Input>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </Spin>
      </Modal>
      <VipExitCode codeShow={codeShow} setCodeShow={getCodeShow}></VipExitCode>
    </div>
  )
}

export default vipPop
