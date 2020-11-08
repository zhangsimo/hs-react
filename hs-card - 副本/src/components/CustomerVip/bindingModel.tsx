/** @format */

import React, { useState, useEffect } from 'react'
import './style.less'
import { Form, Modal, Spin, Row, Col, Input } from 'antd'
import MobileModel from './mobileModel'
// import { formatDate } from '@/interface/customer'
import * as api from '@/api'
interface IProps {
  mobile,
  codeVisible,
  setCodeShow
}
const bindingModel: React.FC<IProps> = props => {
  const [formMenu] = Form.useForm()
  const [codeVisible, setCodeVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [customerName, setCustomerName] = useState<string>('')
  const [mobileBinding, setMobileBinding] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [IDimamges, setIDimamges] = useState<any[]>([])
  const [codeShow, setCodeShow] = useState<boolean>(false)

  useEffect(() => {
    setLoading(false)
    setMobileBinding(props.mobile)
    setCodeVisible(props.codeVisible)
    if (props.mobile) {
      getCustomerData(props.mobile)
    }
  }, [props.codeVisible])
  /*通过手机号获取客户数据*/
  // props.mobile
  const getCustomerData = (mobileProp) => api.getCumstomerByMobile({ mobile: mobileProp, full: true }).then(res => {
    const customerInf = {
      employeeName: '',
      groupName: '',

    }
    const data = { ...res.data, ...customerInf }
    for (let [key] of Object.entries(data)) {
      const objVal = getDataTo(key, data);
      data[key] = objVal
    }
    formMenu.setFieldsValue({ ...data })
  })

  const getCodeShow = e => {
    setCodeShow(e)
  }

  const getDataTo = (key, data) => {
    var gets = {
      'gender': function () {
        return data[key] ? data[key] === 1 ? '男' : '女' : '无'
      },
      'cars': function () {
        const cars: any = []
        data[key].map(item => {
          if (item.carNo) {
            cars.push(item.carNo)
          }
        })
        return cars.toString()
      },
      'mobile': function () {
        setTitle(data[key] + '，已被客户' + data.name + '绑定，请核实新建客户与客户' + data.name + '是否是同一人？')
        setMobileBinding(data[key])
        setCustomerName(data.name)
        return data[key]
      },
      // 'birthday': function () {
      //   // return data[key] && data[key] !== 'null' ? formatDate(data[key]) : "无"
      //   return data[key] && data[key] !== 'null' ? (data[key]) : "无"
      // },
      'files': function () {
        setIDimamges(data[key])
      },
      'employeeName': function () {
        return data.ascriptions[0].employeeName ? data.ascriptions[0].employeeName : "无"
      },
      'groupName': function () {
        return data.ascriptions[0].groupName ? data.ascriptions[0].groupName : '无'
      },
      "address": function () {
        const address = `${data.province}${data.city}${data.district}${data.address}`
        return data.province ? address : '无'
      },
      'default': function () {
        return data[key] ? data[key] : '无'
      }

    };
    return (gets[key] || gets['default'])();
  }

  const onMenuCancel = () => {
    setCodeVisible(false)
    props.setCodeShow(false)
  }
  const handleComfim = () => {
    setCodeShow(true)
  }
  return (
    <div id='bindingModel'>
      <Modal title={title} visible={codeVisible} onOk={handleComfim} onCancel={onMenuCancel} width={900} getContainer={false}>
        <Spin spinning={loading}>
          <Form form={formMenu} >
            <Row>
              <Col>
                <h5 className='title'>已存在的客户信息</h5>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item name="name" label="客户姓名">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="mobile" label="绑定手机号">
                  <Input disabled type="tel"></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="level" label="会员等级">
                  无
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item name="gender" label="性别">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="birthday" label="生日日期">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="地址">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item name="cars" label="客户车辆">
                <Input disabled></Input>
              </Form.Item>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item name="type" label="客户类型">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="sourceName" label="客户来源">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="compName" label="归属门店">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item name="employeeName" label="专属顾问">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="groupName" label="服务小组">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20}>
                <Form.Item label="身份证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
                  <Form.Item name="pic1" style={{ display: 'inline-block' }}>
                    {
                      IDimamges?.map(item => (
                        item.sourceType === "identity_card_front" ? <img src={item.fileUrl} alt={item.fileName} className='pic' key={item.sourceType} /> : ''
                      ))
                    }
                  </Form.Item>
                  <Form.Item name="pic2" style={{ display: 'inline-block' }}>
                    {
                      IDimamges?.map(item => (
                        item.sourceType === "identity_card_back" ? <img src={item.fileUrl} alt={item.fileName} className='pic' key={item.sourceType} /> : ''
                      ))
                    }
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={20}>
                <Form.Item label="驾驶证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
                  <Form.Item name="pic1" style={{ display: 'inline-block' }}>
                    {
                      IDimamges?.map(item => (
                        item.sourceType === "drive_card_front" ? <img src={item.fileUrl} alt={item.fileName} className='pic' key={item.sourceType} /> : ''
                      ))
                    }
                  </Form.Item>
                  <Form.Item name="pic2" style={{ display: 'inline-block' }}>
                    {
                      IDimamges?.map(item => (
                        item.sourceType === "drive_card_back" ? <img src={item.fileUrl} alt={item.fileName} className='pic' key={item.sourceType} /> : ''
                      ))
                    }
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className='btommsg'>若继续新建档案，<span>手机号“{mobileBinding}”将和客户{customerName}解除绑定关系</span>，将无法通过该手机查询到客户{customerName}的会员和车辆信息，请仔细核对</p>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <MobileModel codeShow={codeShow} setCodeShow={getCodeShow} mobile={props.mobile}></MobileModel>
    </div>
  )
}

export default bindingModel
