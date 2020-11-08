/** @format */
import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Input, Space, Button, message, Modal } from 'antd'
import { checkMobile } from '@/interface/customer'
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import UploadImg from '@/components/Upload/ImageQN'
import TagViewStore from '@/store/tag-view'
import './style.less'
import * as api from '@/api'
import { useHistory } from 'react-router-dom'
import hasPermi from '@/components/directive'
// import Edit from '../demo/Edit'
interface IProps {
  IsEdit
  carId
  vin
}
const PageDataAddfile: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [isEdit, setisEdit] = useState<boolean>(false)
  const [isShowphoto, setIshowphoto] = useState<boolean>(false)
  const [simpleCusCarDtos, setSimpleCusCarDtos] = useState<Array<any>>([])
  const [dataVin, setDataVin] = useState<string>('')
  const [haveOwner, setHaveOwner] = useState<boolean>(false)
  const [carOwner, setCarOwner] = useState<string>('')
  const history = useHistory()
  const { delView } = TagViewStore.useContainer()
  useEffect(() => {
    if (props.carId) {
      getCarQueryCarInfo(props.vin, props.carId)
      setisEdit(true)
      sessionStorage.setItem('carId', props.carId)
    }
  }, [props.carId])

  const onChangeVin = event => {
    const value = event.target.value
    if (!value) {
      return
    }
    const fetchData = async () => {
      try {
        const res: any = await api.getOneCarDetail({ vin: value })
        if (res.data.id) {
          Modal.error({
            title: '提示',
            content: 'VIN已被建档，不能重复使用',
          })
          form.setFieldsValue({ vin: '', carModel: '' })
        } else {
          getCarmodelbyvin(value)
        }
      } catch (err) {
        form.setFieldsValue({ vin: '', carModel: '' })
      }
    }
    fetchData()
  }

  const getCarmodelbyvin = vin => {
    api
      .getCarmodelbyvin({ vin: vin })
      .then(res => {
        const data: any = res.data
        if (data.carmodelname) {
          form.setFieldsValue({ carModel: data.carmodelname })
        }
      })
      .catch(err => {
        form.setFieldsValue({ carModel: '', vin: '' })
      })
  }

  const getCarQueryCarInfo = (vin, carId) => {
    api.getCarQueryCarInfo({ carId: carId, vin: vin }).then(res => {
      const data: any = res.data
      setDataVin(data.vin)
      setSimpleCusCarDtos(data.simpleCusCarDtos)
      const customerInf = data.simpleCusCarDtos.filter(f => f.type === 1)
      const params = {
        customerName: customerInf && customerInf.length > 0 ? customerInf[0].customerName : '',
        mobile: customerInf && customerInf.length > 0 ? customerInf[0].mobile : '',
        uploadTime: data.simpleCusCarDtos.length > 0 ? data.simpleCusCarDtos[0].uploadTime : '',
        vehicleCertificate1: data.simpleCusCarDtos.length > 0 ? data.simpleCusCarDtos[0].vehicleCertificate1 : '',
        vehicleCertificate2: data.simpleCusCarDtos.length > 0 ? data.simpleCusCarDtos[0].vehicleCertificate2 : '',
      }
      const datas = { ...data, ...params }
      for (let [key] of Object.entries(datas)) {
        datas[key] = datas[key] ? datas[key] : '无'
      }
      form.setFieldsValue(datas)
    })
  }
  const onChangeEngineNumber = event => { }
  const onChangeMobile = event => {
    if (!event.target.value) {
      return
    }
    if (event.target.value && !checkMobile(event.target.value)) {
      message.error('请输入正确手机号码')
      return
    }
    api.getCumstomerByMobile({ mobile: event.target.value }).then(res => {
      const data: any = res.data
      if (data.id) {
        setHaveOwner(true)
        setCarOwner(data.name)
        setIshowphoto(true)
      }
    })
  }
  const closeTabs = () => {
    delView({ pathname: '/carmanage/add', state: { title: '创建车辆' } })
    history.push('/carmanage/list')
  }

  const closeTabsDetail = () => {
    delView({ pathname: '/carmanage/detail', state: { title: '车辆档案详细' } })
    history.push('/carmanage/list')
  }
  const phoneOnOk = () => {
    setIshowphoto(false)
    form.setFieldsValue({ customerName: carOwner })
  }
  const phoneOnCancel = () => {
    setIshowphoto(false)
    setHaveOwner(false)
    form.setFieldsValue({ mobile: '' })
  }
  const saveOrUpdateCustomerCar = (item: any) => {
    api
      .saveOrUpdateCustomerCar({
        carId: props.carId,
        customerId: item.customerId.toString(),
        id: item.customerCarId.toString(),
        status: 2,
        type: 2,
      })
      .then(res => {
        if (res.code === 1) {
          message.success('解绑成功！')
          getCarQueryCarInfo(props.vin, props.carId)
        } else {
          message.error('解绑失败！')
        }
      })
  }
  const edit = () => {
    form.validateFields().then(res => {
      let params = (form.getFieldValue as any)()
      for (let [key] of Object.entries(params)) {
        params[key] = params[key] !== '无' ? params[key] : ''
      }
      setisEdit(false)
      form.setFieldsValue(params)
    })
  }
  const save = () => {
    form
      .validateFields()
      .then(res => {
        let params = (form.getFieldValue as any)()
        if (params.mobile && !checkMobile(params.mobile)) {
          message.error('请输入正确手机号码')
          return
        }
        if (params.vehicleCertificate1 || params.vehicleCertificate2) {
          if (!params.customerName || !params.mobile) {
            message.error('请填写车主信息')
            return
          }
        }
        if (props.carId) {
          params = { ...params, ...{ id: props.carId } }
        }
        api.saveOrUpdateCar(params).then(res => {
          if (res.code == 1) {
            message.success('保存成功！')
            if (props.carId) {
              closeTabsDetail()
            } else {
              closeTabs()
            }
          } else {
            message.error('保存失败！')
          }
        })
      })
      .catch(err => {
        message.warning('请完善相关信息')
      })
  }
  return (
    <div className="addcar block">
      <Modal
        title="提示"
        centered
        destroyOnClose
        okText="直接使用"
        cancelText="关闭"
        visible={isShowphoto}
        onOk={phoneOnOk}
        onCancel={phoneOnCancel}
        width={390}>
        手机号已存在，是否直接使用
      </Modal>
      <div className="block_title">
        <span> {props.carId ? '车辆档案详细' : '创建车辆档案'}</span>
      </div>
      <div className="block_content carDetail">
        <div className="carInftit">车辆信息</div>
        <Form labelCol={{ span: 8 }} form={form}>
          <Row>
            {props.carId ? (
              <Col span={4}>
                <Form.Item name="carId" label="车辆ID" labelAlign="left">
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            ) : (
                ''
              )}
            <Col span={5}>
              <Form.Item name="vin" label="VIN码" rules={[{ required: true }]} labelAlign="left">
                <Input onBlur={event => onChangeVin(event)} disabled={props.carId ? true : isEdit} allowClear></Input>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="carNo" label="车牌号" rules={[{ required: true }]} labelAlign="left">
                <Input disabled={props.carId ? true : isEdit} allowClear></Input>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="engineNumber" label="发动机号" labelAlign="left">
                <Input onChange={event => onChangeEngineNumber(event)} disabled={isEdit} allowClear></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item name="carModel" label="车型" labelAlign="left" labelCol={{ span: 2 }} rules={[{ required: true }]}>
                <Input disabled className="carModel"></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="customerName" label="车主姓名" labelCol={{ span: 5 }} labelAlign="left">
                <Input disabled={haveOwner ? true : isEdit} style={{ width: '230px' }} allowClear></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="mobile" label="手机号" labelCol={{ span: 5 }} labelAlign="left">
                <Input
                  onBlur={event => onChangeMobile(event)}
                  disabled={haveOwner ? true : isEdit}
                  style={{ width: '230px' }}
                  allowClear></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="行驶证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }} labelAlign="left">
                <Form.Item name="vehicleCertificate1" style={{ display: 'inline-block' }}>
                  <UploadImg className="id-img-upload" title="请上传行驶证正面" disabled={isEdit} />
                </Form.Item>
                <Form.Item name="vehicleCertificate2" style={{ display: 'inline-block' }}>
                  <UploadImg className="id-img-upload" title="请上传行驶证反面" disabled={isEdit} />
                </Form.Item>
              </Form.Item>
            </Col>
            {isEdit ? (
              <Col span={10}>
                <Form.Item name="uploadTime" label="行驶证上传日期" labelCol={{ span: 6 }}>
                  <Input disabled={isEdit}></Input>
                </Form.Item>
              </Col>
            ) : (
                ''
              )}
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item label="备注:" name="remark" colon={false} labelCol={{ span: 2 }}>
                <Input.TextArea rows={4} disabled={isEdit} />
              </Form.Item>
            </Col>
          </Row>
          {props.carId ? (
            <div>
              <div className="carInftit carInftitbm">车辆绑定的客户</div>
              {simpleCusCarDtos?.map(item => (
                <div key={item.customerId}>
                  <Row>
                    <Col span={6}>
                      <div className="carflex">
                        <p>客户姓名：{item.customerName}</p>
                        {item.type === 1 ? (
                          <div>
                            <span className="carIconbg"></span>
                            <span> 车主 </span>
                          </div>
                        ) : (
                            <span className="me" onClick={() => saveOrUpdateCustomerCar(item)}>
                              {' '}
                            解除绑定{' '}
                            </span>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={5}>
                      <Form.Item label="客户ID" labelCol={{ span: 5 }}>
                        {item.customerId}
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="手机号">{item.mobile}</Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
              <Row>
                <Col span={5}>
                  <Button type="primary" onClick={() => history.push('/carmanage/addcustomer?id=' + props.carId)}>
                    新增绑定客户 +
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
              ''
            )}

          {isEdit ? (
            <Row>
              <Col span={24}>
                <Form.Item name="remark" label="">
                  <div className="storepoint">
                    <Input disabled={isEdit}></Input>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          ) : (
              ''
            )}
          <Row>
            <Col span={24}>
              <Form.Item label=" " colon={false} labelCol={{ span: 24 }}>
                {!isEdit ? (
                  <Space size="large">
                    <Button type="primary" onClick={save} disabled={hasPermi('carmanage:add:save')}>
                      保存
                    </Button>
                    <Button onClick={closeTabs}>取消</Button>
                  </Space>
                ) : (
                    <Space size="large">
                      <Button onClick={edit} type="primary" disabled={hasPermi('carmanage:details:edit')}>
                        修改档案
                    </Button>
                      <Button
                        onClick={() => history.push(`/carmanage/changcarplate?vin=${dataVin}&carId=${props.carId}`)}
                        type="primary"
                        disabled={hasPermi('carmanage:details:editCarNo')}>
                        变更车牌
                    </Button>
                      <Button onClick={closeTabsDetail}>关闭</Button>
                    </Space>
                  )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default PageDataAddfile
