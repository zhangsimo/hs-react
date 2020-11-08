/** @format */

import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Divider } from 'antd'
import UploadImg from '@/components/Upload/ImageQN'
import './style.less'
import * as api from '@/api'
interface IProps {
  customerId
}
const vipFiles: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [carInformation, setCarInformation] = useState<any>()
  const getCumstomerCarlistData = () => {
    // 1270257279043637249
    api.getCumstomerCarlistView({ 'id': props.customerId }).then(res => setCarInformation(res.data))
  }
  useEffect(() => {
    if (props.customerId) {
      getCumstomerCarlistData()
    }
  }, [props.customerId])
  return (
    <div className="block carInformation">
      <div className="block_content">
        <Form labelCol={{ span: 8 }} form={form} >
          {
            carInformation && carInformation.length > 0 ? carInformation.map(item => (
              <div>
                <Row>
                  <Col span={16}>
                    <h5 className='carh5'>VIN： {item.carInfo.vin ? item.carInfo.vin : '无'}</h5>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    车辆ID：{item.carInfo.id}
                  </Col>
                  <Col span={6}>
                    车牌号:{item.carInfo.carNo}
                  </Col>
                  <Col span={6}>
                    车型:{item.carInfo.carModel ? item.carInfo.carModel : '无'}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    发动机号:{item.carInfo.engineNumber ? item.carInfo.engineNumber : '无'}
                  </Col>
                  <Col span={6}>
                    车主姓名: {
                      item.bindCustomers.map(cusItem => (
                        cusItem.type !== 1 ? '' : cusItem.type === 1 && cusItem.customerName ? cusItem.customerName : '无'
                      ))
                    }
                  </Col>
                </Row>
                <Row>
                  <Col span={14}>
                    <div className="carphone">
                      {/* <p>行驶证照片:</p> */}
                      {
                        item.bindCustomers && item.bindCustomers.length > 0 ? item.bindCustomers.map(itemChild => (
                          itemChild.type === 1 ?
                            <div>
                              <Form.Item label="行驶证照片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
                                <Form.Item name={itemChild.vehicleCertificate1} style={{ display: 'inline-block' }}>
                                  {
                                    itemChild.vehicleCertificate1 ? <img src={itemChild.vehicleCertificate1 ? itemChild.vehicleCertificate1 : ''} className='pic' key={itemChild.vehicleCertificate1} /> :
                                      <UploadImg className="id-img-upload" title="请上传行驶证照片" disabled={true} />
                                  }
                                </Form.Item>
                                <Form.Item name={itemChild.vehicleCertificate2} style={{ display: 'inline-block' }}>
                                  {
                                    itemChild.vehicleCertificate2 ? <img src={itemChild.vehicleCertificate2 ? itemChild.vehicleCertificate2 : ''} className='pic' key={itemChild.vehicleCertificate2} /> :
                                      <UploadImg className="id-img-upload" title="请上传行驶证照片" disabled={true} />
                                  }
                                </Form.Item>
                              </Form.Item>
                            </div> : ''
                        )) : ''

                      }
                    </div>
                  </Col>
                  <Col span={6}>
                    上传日期:{item.bindCustomers && item.bindCustomers.length > 0 ? item.bindCustomers[0].uploadTime ? item.bindCustomers[0].uploadTime : '无' : '无'}
                  </Col>
                </Row>
                <Divider></Divider>
                <Row>
                  <Col span={12}>
                    <h5 className='carh5'>绑定客户</h5>
                  </Col>
                </Row>
                {

                  item.bindCustomers.map(customerItem => (
                    <div>

                      {
                        customerItem.type === 1 ? (
                          <div>
                            <Row>
                              <Col span={12}>
                                <div className='carflex'>
                                  <p>客户姓名：{customerItem.customerName}</p>
                                  <span className='carIconbg'></span>
                                  <span> 车主 </span>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={5}>
                                客户ID:{customerItem.customerId}
                              </Col>
                              <Col span={5}>
                                手机号:{customerItem.mobile}
                              </Col>
                            </Row>
                          </div>
                        ) : (
                            <div>
                              <Row>
                                <Col span={6}>
                                  <div className='carflex'>
                                    <p>客户姓名：{customerItem.customerName}</p>
                                    <span className='carIconbgme'></span>
                                    {
                                      props.customerId === customerItem.customerId ? <span className='me'> 我</span> : ''
                                    }

                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={5}>
                                  客户ID:{customerItem.customerId}
                                </Col>
                                <Col span={5}>
                                  手机号:{customerItem.mobile}
                                </Col>
                              </Row>
                            </div>
                          )
                      }

                    </div>
                  ))
                }
                <Divider></Divider>
              </div>
            )) : (<p>该客户暂无绑定相关车辆</p>)
          }
        </Form>
      </div>
    </div>
  )
}

export default vipFiles
