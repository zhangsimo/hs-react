/** @format */

import React, { useState, useEffect, } from 'react'
import '../style.less'
import { Form, Modal, Spin, Row, Col, Input } from 'antd'
// import { formatDate } from '@/interface/customer'
// import * as api from '@/api'
interface IProps {

}
const ServiceProgress: React.FC<IProps> = props => {
  const [formMenu] = Form.useForm()
  const [codeVisible, setCodeVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    setLoading(false)


  })
  /*通过手机号获取客户数据*/
  // props.mobile
  // const getCustomerData = (mobileProp) => api.getCumstomerByMobile({ mobile: mobileProp, full: true }).then(res => {
  //   const customerInf = {
  //     employeeName: '',
  //     groupName: '',

  //   }
  //   const data = { ...res.data, ...customerInf }
  //   for (let [key] of Object.entries(data)) {
  //     const objVal = getDataTo(key, data);
  //     data[key] = objVal
  //   }
  //   formMenu.setFieldsValue({ ...data })
  // })


  // const getDataTo = (key, data) => {
  //   var gets = {
  //     'gender': function () {
  //       return data[key] ? data[key] === 1 ? '男' : '女' : '无'
  //     },


  //   };
  //   return (gets[key] || gets['default'])();
  // }

  const onMenuCancel = () => {
    setCodeVisible(false)
  }

  return (
    <div className='serviceProgress'>
      <Modal title='服务进度' visible={codeVisible} onCancel={onMenuCancel} width={890} getContainer={false} footer={null}>
        <Spin spinning={loading}>
          <Form form={formMenu} >
            <Row>
              <Col span={9}>
                <Form.Item name="name" label="商品编码" >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name="name" label="商品来源">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={9}>
                <Form.Item name="name" label="商品名称" >
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name="name" label="商品类型">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <Form.Item name="name" label="商品名称" labelCol={{ span: 6 }}>
                  <Input disabled></Input>
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
