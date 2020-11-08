/** @format */

import React, { useState, useEffect, } from 'react'
import '../style.less'
import { Form, Modal, Spin, Row, Col, Input, Radio, message } from 'antd'
// import { formatDate } from '@/interface/customer'
import * as api from '@/api'
interface IProps {
  receiptShow,
  onReceiptCancel,
  receiptPopData,
  onReceiptPaySuccess
}
const payType = [
  { id: 'W01', name: '微信支付' },
  { id: 'A01', name: '支付宝支付' },
  { id: 'U01', name: '银联支付' },
  { id: 'C01', name: '现金支付' },
  { id: 'B01', name: '余额支付' },
  { id: 'T01', name: '挂账' },
]

const ServiceProgress: React.FC<IProps> = props => {
  const [formMenu] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  // const [magVisible, setMagVisible] = useState<boolean>(false)
  useEffect(() => {
    setLoading(false)
    if (props.receiptPopData) {
      formMenu.setFieldsValue({ orderId: props.receiptPopData.orderId, payableAmt: props.receiptPopData.payableAmt, payType: '', paidAmt: props.receiptPopData.paidAmt })
    }
  }, [props.receiptPopData])
  const getOrderReceipt = (params) => api.getOrderReceipt(params).then(res => {
    if (res.code === 1) {
      message.success('支付成功')
      props.onReceiptPaySuccess(false)
    } else {
      message.error('支付失败')
    }

  })
  const onMenuCancel = () => {
    props.onReceiptCancel(false)
  }
  const onMenuOk = () => {
    formMenu.validateFields().then(res => {
      let params = (formMenu.getFieldValue as any)()
      if (!params.payType) {
        message.error('请选择付款方式')
        return
      }
      getOrderReceipt(params)
    })
  }

  return (
    <div className='payWay'>
      <Modal title='选择支付方式' visible={props.receiptShow} onCancel={onMenuCancel} onOk={onMenuOk} width={600} getContainer={false} >
        <Spin spinning={loading}>
          <Form form={formMenu} >
            <Row>
              <Col span={24}>
                <Form.Item name="orderId" label="订单号" labelCol={{ span: 3 }}>
                  <Input disabled style={{ width: '300px' }}></Input>
                </Form.Item>
              </Col>
            </Row>
            <div className='fontColor'>
              <Row>
                <Col span={12}>
                  <Form.Item name="payableAmt" label="应付金额" labelCol={{ span: 6 }}>
                    <Input disabled></Input>
                  </Form.Item>
                </Col>
								<Col span={12}>
								  <Form.Item name="payableAmt" label="实付金额" labelCol={{ span: 6 }}>
								    <Input disabled></Input>
								  </Form.Item>
								</Col>
              </Row>
              
            </div>
						<Row>
							<Col span={24}>
								<Form.Item name="payType" label="余额抵扣" labelCol={{ span: 3 }}>
									<Input size="small" style={{ width: '150px', marginRight: '8px' }} ></Input>
									剩余可用余额：￥50
								</Form.Item>
							</Col>
						</Row>
            <Row>
              <Col span={24}>
                <Form.Item name="payType" label="付款方式" labelCol={{ span: 3 }}>
                  <Radio.Group>
                    {
                      payType.map(item => (
                        <Radio value={item.id}>{item.name}</Radio>
                      ))
                    }
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

    </div>
  )
}

export default ServiceProgress
