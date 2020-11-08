/** @format */

import React, { useState, useEffect, } from 'react'
import '../style.less'
import { Form, Modal, Spin, Row, Col, Input, Select, Table, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { checkMobile } from '@/interface/customer'
// import { CloseCircleOutlined } from '@ant-design/icons';
import * as api from '@/api'
interface IProps {
  title,
  orderId?,
  custormShow,
  custormCancel,
  custormCommit,
  customerInfoBO
}
// const inquiryMode = [
//   {
//     id: 'carNo',
//     name: '车牌'
//   },
//   {
//     id: 'mobile',
//     name: '客户'
//   }
// ]
const remainingOil = [
  {
    id: 'F',
    name: 'F'
  },
  {
    id: '1/2',
    name: '1/2'
  },
  {
    id: '1/3',
    name: '1/3'
  },
  {
    id: '1/4',
    name: '1/4'
  }
]
const addCustomer: React.FC<IProps> = props => {
  const [formMenu] = Form.useForm()
  const [inquiryKey, setInquiryKey] = useState<string>('')
  const [inquiryShow, setInquiryShow] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [customerId, setCustomerId] = useState<string>("0")
  const [Isdisabled, setIsDisabled] = useState<boolean>(false)
  useEffect(() => {
    setLoading(false)
    formMenu.resetFields()
    if (props.customerInfoBO) {
      formMenu.setFieldsValue(props.customerInfoBO)
      formMenu.setFieldsValue(props.customerInfoBO.customerId)
      setIsDisabled(true)
    }
  }, [props.customerInfoBO])
  //选择查询方式
  // const inquiryChange = (val) => {
  //   setInquiryKey(val)
  //   setSearchVal('')
  // }
  //选择客户
  const selectCustomer = (row) => {
    formMenu.setFieldsValue({ ...row })
    getByCarNoDetail(row.carNo)
    setInquiryShow(false)
  }
  const selectCustomerId = (row) => {
    setCustomerId(row.id)
    formMenu.setFieldsValue({ ...row })
    setInquiryShow(false)
  }
  const getByCarNoDetail = (carNo) => {
    api.getByCarNoDetail({
      carNo: carNo
    }).then(res => {
      const data: any = res.data
      if (data && data.customers) {
        setInquiryKey('mobile')
        setDataSource(data.customers)
        setInquiryShow(true)
      }
    })
  }
  // const getTableCustomData = (mobile) =>
  //   api.getCumstomerList({
  //     pageNo: 1,
  //     pageSize: 10,
  //     mobile: mobile
  //   }).then(res => {
  //     setDataSource(res.data.items)
  //   })
  const getOrderSearchSimply = (e) => {
    api.getOrderSearchSimply({
      query: e
    }).then(res => {
      const data: any = res.data
      if (data && data.length > 0) {
        setCustomerId(data[0].id)
      } else {
        setCustomerId('')
      }
      console.log(customerId)
      formMenu.setFieldsValue(data[0])
    })
  }
  const getTableCarNoData = (carNo) =>
    api.getCatSelectPageCar({
      pageNo: 1,
      pageSize: 10,
      carNo: carNo
    }).then(res => {
      setDataSource(res.data.items)
    })
  const carNoSearch = (e) => {
    setInquiryKey('carNo')
    inquirySearch(e, 'carNo')
  }
  const phoneSearch = (e) => {
    setInquiryKey('mobile')
    inquirySearch(e, 'mobile')
    setInquiryShow(false)
  }
  const inquirySearch = (e, type) => {
    // setSearchVal(e.currentTarget.value)
    if (e.currentTarget.value && e.currentTarget.value.length > 0) {
      if (type === 'mobile') {//&& e.currentTarget.value.length > 4
        if (e.currentTarget.value.length > 10) {
          // getTableCustomData(e.currentTarget.value)
          getOrderSearchSimply(e.currentTarget.value)
          // setInquiryShow(true)
        }
      } else {
        if (e.currentTarget.value.length > 2) {
          getTableCarNoData(e.currentTarget.value)
          setInquiryShow(true)
        }
      }
    } else {
      setInquiryShow(false)
    }
  }


  const onMenuCancel = () => {
    props.custormCancel()
  }
  const onMenuOK = () => {
    formMenu.validateFields().then(res => {
      let params = (formMenu.getFieldValue as any)()
      console.log(params, '---params')
      if (props.customerInfoBO && !params.mobile) {
        message.error('手机号码不能为空')//补充客户信息
        return
      }
      if (props.customerInfoBO && !checkMobile(params.mobile)) {
        message.error('请输入正确手机号码')
        return
      }
      if (customerId) {
        api.getOrderCustomerUpdate({ ...params, id: customerId }).then(res => {//简单修改客户
          getOrderUpdateInfo(params)//订单详情-订单信息修改
        })
      } else {
        api.getOrderCustomerCreate({ ...params, id: customerId }).then(res => {//简单创建客户
          getOrderUpdateInfo(params)//订单详情-订单信息修改
        })
      }
    })
      .catch(err => {
        message.warning('请填写车牌号')
      })
  }
  //订单详情-订单信息修改
  const getOrderUpdateInfo = (params) => {
    console.log(props.customerInfoBO.carId, '传过来的carID')
    if (props.orderId) {
      api.getOrderUpdateInfo({ realName: params.name, userPhone: params.mobile, orderId: props.orderId, customerId: customerId, carId: props.customerInfoBO.carId }).then(res => {//简单创建客户
        console.log(res, '----简单创建客户')
        props.custormCommit(params)
      })
    } else {
      props.custormCommit(params)
    }
  }
  const custormColumns: ColumnProps<any>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      render: (value, row) => {
        return <span onClick={() => selectCustomerId(row)}>{row.name}</span>
      }
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      render: (value, row) => {
        return <span onClick={() => selectCustomerId(row)}>{row.mobile}</span>
      }
    },
  ]
  const carNoColumns: ColumnProps<any>[] = [
    {
      title: '车牌号',
      dataIndex: 'carNo',
      align: 'center',
      render: (value, row) => {
        return <span onClick={() => selectCustomer(row)}>{row.carNo}</span>
      }
    },
    {
      title: 'VIN',
      dataIndex: 'vin',
      align: 'center',
      render: (value, row) => {
        return <span onClick={() => selectCustomer(row)}>{row.vin}</span>
      }
    },
  ]
  return (
    <div className='addCustomerPop'>
      <Modal title={props.title} visible={props.custormShow} onOk={onMenuOK} onCancel={onMenuCancel} width={800} getContainer={false}>
        <Spin spinning={loading}>
          <Form form={formMenu} >
            {/* {
              props.customerInfoBO ? '' :
                <Row>
                  <Col span={20}>
                    <Form.Item name="inquiryMode" label="查询客户/车辆" labelCol={{ span: 4 }} labelAlign='left'>
                      <div className='inquiryMode'>
                        <Select placeholder="请选择" style={{ width: '150px' }} onChange={inquiryChange} allowClear>
                          {
                            inquiryMode?.map(item => (
                              <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                            ))
                          }
                        </Select>
                        <Input value={searchVal} style={{ marginLeft: '10px', width: '200px' }} placeholder={inquiryKey === 'mobile' ? '请输入手机号码' : '请输入车牌号'} disabled={!inquiryKey ? true : false} onChange={inquirySearch} allowClear></Input>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
            } */}

            <Row>
              <Col span={10}>
                <Form.Item label="车辆信息" >
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item name="carNo" label="车牌号" rules={[{ required: true }]} labelCol={{ span: 8 }}>
                  <Input allowClear disabled={Isdisabled} onChange={carNoSearch} ></Input>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="vin" label="VIN" labelCol={{ span: 8 }}>
                  <Input allowClear disabled={Isdisabled}></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item name="carModel" label="车型" labelCol={{ span: 8 }}>
                  <Input allowClear disabled={Isdisabled}></Input>
                </Form.Item>
              </Col>

            </Row>
            <Row>
              <Col span={10}>
                <Form.Item label="客户信息" >
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item name="mobile" label="手机号" labelCol={{ span: 8 }}>
                  <Input allowClear onChange={phoneSearch}></Input>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="name" label="客户姓名" labelCol={{ span: 8 }}>
                  <Input allowClear></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item label="补充信息" >
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <Form.Item name="cameMileage" label="进厂里程数" labelCol={{ span: 8 }}>
                  <Input allowClear disabled={Isdisabled}></Input>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name="cameOil" label="剩余油量" labelCol={{ span: 8 }}>
                  <Select placeholder="选择剩余油量" disabled={Isdisabled}>
                    {
                      remainingOil?.map(item => (
                        <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>

          </Form>
          {
            inquiryShow ? <div className={inquiryKey === 'mobile' ? 'addCustomerpopTablePhone' : 'addCustomerpopTableCar'}>
              {/* <CloseCircleOutlined /> */}
              <Table
                size="middle"
                columns={inquiryKey === 'mobile' ? custormColumns : carNoColumns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{
                  hideOnSinglePage: true,
                }}
              />
            </div> : ''
          }
        </Spin>
      </Modal>

    </div>
  )
}

export default addCustomer
