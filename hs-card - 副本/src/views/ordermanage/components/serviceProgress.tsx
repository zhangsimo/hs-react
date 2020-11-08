/** @format */

import React, { useState, useEffect, } from 'react'
import '../style.less'
import { Form, Modal, Spin, Row, Col, Input, Steps } from 'antd'
// import { formatDate } from '@/interface/customer'
import * as api from '@/api'
const { Step } = Steps;
interface IProps {
  orderProductId,
  serviceShow,
  onServerCancel
}
const ServiceProgress: React.FC<IProps> = props => {
  const [current, setCurrent] = useState<number>(0)
  const [formMenu] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    if (props.serviceShow) {
      getOrderOrderProductId(props.orderProductId)
    }
  }, [props.serviceShow])
  const getOrderOrderProductId = (orderProductId) => api.getOrderOrderProductId(orderProductId).then(res => {
    const data: any = res.data
    // data.status = data.status === 2 ? 0 : data.status === 3 ? 1 : data.status === 4 ? 2 : data.status === 6 ? 3 : ''
    setCurrent(data.status)
    formMenu.setFieldsValue(data)
    setLoading(false)
  })
  const onMenuCancel = () => {
    props.onServerCancel(false)
  }

  return (
    <div className='serviceProgress'>
      <Modal title='服务进度' visible={props.serviceShow} onCancel={onMenuCancel} width={578} getContainer={false} footer={null}>
        <Spin spinning={loading}>
          <Form form={formMenu} >
            <Row>
              <Col span={22}>
                <Form.Item name="expectFinishDate" label="预计完工时间" labelCol={{ span: 5 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item name="workCode" label="工单号" labelCol={{ span: 5 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item name="orderId" label="订单号" labelCol={{ span: 5 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item name="childOrderCode" label="子订单号" labelCol={{ span: 5 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item name="orderProductId" label="订单商品ID" labelCol={{ span: 5 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item name="storeName" label="商品名称" labelCol={{ span: 5 }}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <div>
              <Steps progressDot current={current} style={{ width: '60%', margin: '20px 0px 20px -38px' }}>
                <Step title="待施工" className={current == 2 ? 'step3' : ''} />
                <Step title="领料中" className={current == 3 ? 'step2' : ''} />
                <Step title="施工中" className={current == 4 ? 'step3' : ''} />
                <Step title="已完工" className={current == 6 ? 'step3' : ''} />
              </Steps>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default ServiceProgress
