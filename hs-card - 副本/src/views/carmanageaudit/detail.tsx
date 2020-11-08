/** @format */
import React, {useState, useEffect} from 'react'
import {Form, Row, Col, Input, Space, Button, message} from 'antd'
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import UploadImg from '@/components/Upload/ImageQN'
import TagViewStore from '@/store/tag-view'
import './style.less'
import * as api from '@/api'
import {useHistory} from 'react-router-dom'
import useSearchParam from '@/hooks/useSearchParam'
import hasPermi from '@/components/directive'
// import Edit from '../demo/Edit'
interface IProps {}
const PageDataAddfile: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [isEdit, setisEdit] = useState<boolean>(false)
  const [auditStatus, setAuditStatus] = useState<number>(0)
  const history = useHistory()
  const paramVin = useSearchParam('vin')
  const paramCarId = useSearchParam('carId')
  const vin = paramVin ? paramVin : sessionStorage.getItem('vin') ? sessionStorage.getItem('vin') : ''
  const carId: any = paramCarId ? paramCarId : sessionStorage.getItem('carId') ? sessionStorage.getItem('carId') : ''

  const {delView} = TagViewStore.useContainer()
  useEffect(() => {
    if (carId) {
      getCarQueryCarInfo(vin, carId)
      setisEdit(true)
      sessionStorage.setItem('carId', carId)
    }
  }, [carId])

  useEffect(() => {
    if (vin) {
      sessionStorage.setItem('vin', vin)
    }
  }, [vin])

  const getCarQueryCarInfo = (vin, carId) => {
    api.getCatBackendCarDetail(carId).then(res => {
      const data: any = res.data
      setAuditStatus(data.status)
      for (let [key] of Object.entries(data)) {
        data[key] = data[key] ? data[key] : '无'
      }
      if (data.status === '无') {
        data.confirmRemark = data.confirmRemark !== '无' ? data.confirmRemark : ''
      }
      form.setFieldsValue(data)
    })
  }
  const closeTabs = () => {
    delView({pathname: '/carmanageaudit/detail', state: {title: '审核详情'}})
    history.push('/carmanageaudit/list')
  }

  const audit = status => {
    form
      .validateFields()
      .then(res => {
        let params = (form.getFieldValue as any)()
        console.log('params:', params)
        let paramsNew = {
          confirmRemark: params.confirmRemark && params.confirmRemark !== '无' ? params.confirmRemark : '',
          id: carId,
          status: status,
        }
        api.confirmChangeCarNo(paramsNew).then(res => {
          console.log('res:', res)
          if (res.code == 1) {
            message.success('提交成功！')
            closeTabs()
          } else {
            message.error('提交失败！')
          }
        })
      })
      .catch(err => {
        console.log('err:', err)
        message.warning('请完善相关信息')
      })
  }
  return (
    <div className="addcar block">
      <div className="block_title">
        <span>审核详细</span>
      </div>
      <div className="block_content">
        <div className="carInftit">车辆信息</div>
        <Form labelCol={{span: 8}} form={form}>
          <Row>
            {isEdit ? (
              <Col span={7}>
                <Form.Item name="carId" label="车辆ID" labelAlign="left" labelCol={{span: 4}}>
                  <Input disabled></Input>
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
            <Col span={7}>
              <Form.Item name="vin" label="VIN码" rules={[{required: true}]} labelAlign="left">
                <Input disabled={isEdit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="carModel" label="车型" labelCol={{span: 4}} labelAlign="left" rules={[{required: true}]}>
                <Input disabled></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="engineNumber" label="发动机号" labelAlign="left">
                <Input disabled={isEdit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item name="carNo" label="车牌号" labelCol={{span: 2}} rules={[{required: true}]} labelAlign="left">
                <Input disabled={isEdit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item
                name="orgCarNo"
                label="替换车牌号"
                rules={[{required: true}]}
                labelCol={{span: 2}}
                labelAlign="left">
                <Input disabled={isEdit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="行驶证图片" labelCol={{span: 2}} style={{marginBottom: 0}} labelAlign="left">
                <Form.Item name="driveCard1" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传行驶证正面" disabled={isEdit} />
                </Form.Item>
                <Form.Item name="driveCard2" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传行驶证反面" disabled={isEdit} />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="driveCardTime" label="行驶证上传日期" labelCol={{span: 6}}>
                <Input disabled={isEdit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="车辆图片" labelCol={{span: 2}} style={{marginBottom: 0}} labelAlign="left">
                <Form.Item name="carPic1" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传车辆照片" disabled={isEdit} />
                </Form.Item>
                <Form.Item name="carPic2" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传车辆照片" disabled={isEdit} />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="carPicTime" label="车辆上传日期" labelCol={{span: 6}}>
                <Input disabled={isEdit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item label="替换车牌原因:" name="commitRemark" colon={false} labelCol={{span: 2}}>
                <Input.TextArea rows={2} disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item label="备注:" name="confirmRemark" colon={false} labelCol={{span: 2}}>
                <Input.TextArea rows={4} disabled={auditStatus > 0 ? true : false} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <p className="auditStatus">{auditStatus > 1 ? '审核不通过' : auditStatus > 0 ? '审核通过' : '待审核'}</p>
            </Col>
          </Row>

          <Row>
            <Col span={18}>
              <Form.Item label=" " colon={false} labelCol={{span: 24}}>
                <Space size="large">
                  <Button
                    onClick={() => audit(1)}
                    type="primary"
                    disabled={hasPermi('carmanageaudit:details:pass') && auditStatus !== 0 ? true : false}>
                    审核通过
                  </Button>
                  <Button
                    onClick={() => audit(2)}
                    type="primary"
                    disabled={hasPermi('carmanageaudit:details:nopass') && auditStatus !== 0 ? true : false}
                    danger>
                    审核不通过
                  </Button>
                  <Button onClick={closeTabs}>关闭</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default PageDataAddfile
