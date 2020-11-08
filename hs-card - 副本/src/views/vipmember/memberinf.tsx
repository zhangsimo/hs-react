import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Input, Space, Button, Divider } from 'antd'
import UploadImg from '@/components/Upload/ImageQN'
import BindingModel from '@/components/CustomerVip/bindingModel'
import { useHistory } from 'react-router-dom'
import './style.less'
import * as api from '@/api'
// import { formatDate } from '@/interface/customer'
import TagViewStore from '@/store/tag-view'

interface IProps {
  // IsEdit//是否编辑
  customerId,
  memberId
}
const PageDataMemberinf: React.FC<IProps> = props => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [codeVisible, setCodeVisible] = useState<boolean>(false)
  const [mobile, setMobile] = useState('')
  const [IDimamges, setIDimamges] = useState<any[]>([])
  const [cars, setCars] = useState<any[]>([])
  const [driverimages, setDriverimages] = useState<any[]>([])
  const [isExit, setIsExit] = useState<boolean>(false)
  const { delView } = TagViewStore.useContainer()
  const closePage = () => {
    delView({ pathname: "/vipmember/detail", state: { title: '会员详情' } })
    history.push('/vipmember/list')
  }
  useEffect(() => {
    setMobile('')
    if (props.memberId) {
      getMemberIdDetail()
      setIsExit(true)
      sessionStorage.setItem('memberId', props.memberId)
    }
  }, [props.memberId])
  // 编辑-解构数据
  const getDataTo = (key, data) => {
    var gets = {
      'cars': function () {
        setCars(data.customer ? data.customer.cars : [])
        return data.customer ? data.customer.cars : ''
      },
      'compName': function () {
        return data.customer && data.customer && data.customer.compName ? data.customer.compName : "无"
      },
      'employeeName': function () {
        return data.customer && data.customer.ascriptions && data.customer.ascriptions.length > 0 && data.customer.ascriptions[0].employeeName ? data.customer.ascriptions[0].employeeName : "无"
      },
      'groupName': function () {
        return data.customer && data.customer.ascriptions && data.customer.ascriptions.length > 0 && data.customer.ascriptions[0].groupName ? data.customer.ascriptions[0].groupName : '无'
      },
      'sourceName': function () {
        return data.customer && data.customer && data.customer.sourceName ? data.customer.sourceName : '无'
      },
      'remark': function () {
        return data.customer && data.customer && data.customer.remark ? data.customer.remark : '无'
      },
      'birthday': function () {
        return data.customer && data.customer.birthday ? data.customer.birthday : '无'
      },
      'customermobile': function () {
        return data.customer && data.customer.mobile ? data.customer.mobile : '无'
      },
      // 'activeTime': function () {
      //   return formatDate(data[key])
      // },
      'files': function () {
        if (data.customer && data.customer.files.length > 0) {
          setIDimamges(data.customer.files.filter(f => f.sourceType === "identity_card_front" || f.sourceType === "identity_card_back"))
          setDriverimages(data.customer.files.filter(f => f.sourceType === "drive_card_front" || f.sourceType === "drive_card_back"))
          data.customer.files.map(item => {
            if (item.sourceType === "identity_card_front") {
              data.pic1 = item.fileUrl
            } else if (item.sourceType === "identity_card_back") {
              data.pic2 = item.fileUrl
            } else if (item.sourceType === "drive_card_front") {
              data.pic3 = item.fileUrl
            } else {
              data.pic4 = item.fileUrl
            }
          })
        }
        return data.customer ? data.customer.files : ''
      },
      'addressLink': function () {
        const addressLink = data.customer ? `${data.customer.province}${data.customer.city}${data.customer.district}${data.customer.street}${data.customer.address}` : ''
        return addressLink ? addressLink : '无'
      },
      'idNumber': function () {
        return data.customer && data.customer.idNumber ? data.customer.idNumber : '无'
      },
      // 'updateTime': function () {
      //   return data[key] ? formatDate(data[key]) : ""
      // },
      'default': function () {
        return data[key] ? data[key] : '无'
      }

    };
    return (gets[key] || gets['default'])();
  }
  //请求会员数据-
  const getMemberIdDetail = () => {
    api.getMemberId({ id: props.memberId }).then(res => {
      const customerInf = {
        customerId: props.customerId,
        wxUnionId: res.data.customer && res.data.customer.wxUnionId ? res.data.customer.wxUnionId : '',
        customerName: res.data.customer && res.data.customer.name ? res.data.customer.name : '',
        gender: '',
        employeeName: '',
        groupName: '',
        addressLink: '',
        sourceName: '',
        compName: '',
        birthday: '',
        idNumber: '',
        customermobile: '',
        remark: '',
        files: '',
        cars: '',
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: '',

      }
      const data = { ...customerInf, ...res.data }
      for (let [key] of Object.entries(data)) {
        const objVal = getDataTo(key, data);
        data[key] = objVal
      }


      form.setFieldsValue({ ...data })
    })
  }


  //手机号已被绑定情况下弹窗回调
  const setCodeShow = (val) => {
    setCodeVisible(val)
  }

  return (
    <div className="memberinf block" >
      <div className="block_content">
        <Form labelCol={{ span: 6 }} form={form}>
          <Row>
            <Col span={7}>
              <Form.Item name="code" label="会员卡号" labelCol={{ span: 7 }}>
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="name" label="会员姓名" labelCol={{ span: 7 }}>
                <Input allowClear disabled={isExit}></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="mobile" label="手机号" labelCol={{ span: 7 }}>
                <Input allowClear disabled={isExit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item label="注册日期" name='activeTime' labelCol={{ span: 7 }}>
                <Input disabled={isExit} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="会员等级" name='level' labelCol={{ span: 7 }}>
                <Input disabled={isExit} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="成长值" name='growthVal' labelCol={{ span: 7 }}>
                无
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item label="会员积分" name='point' labelCol={{ span: 7 }}>
                <Input disabled={isExit} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="信用值" name='' labelCol={{ span: 7 }}>
                无
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item label="备注" name='remark' labelCol={{ span: 7 }}>
                <Input disabled={isExit} />
              </Form.Item>
            </Col>
          </Row>
          <Divider></Divider>
          <Row>
            <Col span={7}>
              <Form.Item name="customerId" label="客户ID" >
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="openID" label="openID" >
                无
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="wxUnionId" label="unionID" >
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
          </Row>


          <Row>
            <Col span={7}>
              <Form.Item name="customerName" label="客户姓名" >
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="customermobile" label="手机号" >
                <Input allowClear max={11} disabled={isExit}></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="gender" label="性别" >
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="birthday" label="生日日期" >
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="addressLink" label="地址"  >
                <Input allowClear disabled={isExit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="type" label="客户类型" >
                无
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="compName" label="归属门店"  >
                <Input allowClear max={11} disabled={isExit}></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="employeeName" label="归属员工" >
                <Input allowClear max={11} disabled={isExit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="" label="分类" >
                无
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="sourceName" label="客户来源"  >
                <Input allowClear max={11} disabled={isExit}></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="groupName" label="服务小组"  >
                <Input allowClear max={11} disabled={isExit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="gender" label="客户车辆" >
                {
                  cars?.map(item => (
                    <span className="spacing">{item.carNo}</span>
                  ))
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="gender" label="意向级别" >
                <Input allowClear disabled></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="mobile" label="标签" >
                无
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="mobile" label="跟踪优先" >
                无
              </Form.Item>
            </Col>
          </Row>

          <Divider></Divider>
          <Row>
            <Col span={7}>
              <Form.Item name="idNumber" label="身份证号码">
                <Input allowClear max={19} disabled={isExit}></Input>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="身份证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
                <Form.Item name="pic1" style={{ display: 'inline-block' }}>
                  <UploadImg className="id-img-upload" title="请上传身份证正面" disabled='true' />
                </Form.Item>
                <Form.Item name="pic2" style={{ display: 'inline-block' }}>
                  <UploadImg className="id-img-upload" title="请上传身份证反面" disabled='true' />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="身份证上传日期" name='updateTime' labelCol={{ span: 7 }}>
                {
                  // IDimamges.length > 0 ? formatDate(IDimamges[0].createTime) : '无'
                  IDimamges.length > 0 ? (IDimamges[0].createTime) : '无'
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="驾驶证图片" labelCol={{ span: 3 }} style={{ marginBottom: 0 }}>
                <Form.Item name="pic3" style={{ display: 'inline-block' }}>
                  <UploadImg className="id-img-upload" title="请上传驾驶证正面" disabled='true' />
                </Form.Item>
                <Form.Item name="pic4" style={{ display: 'inline-block' }}>
                  <UploadImg className="id-img-upload" title="请上传驾驶证反面" disabled='true' />
                </Form.Item>
              </Form.Item>
            </Col>
            {isExit ?
              <Col span={8}>
                <Form.Item label="驾驶证上传日期" name='' labelCol={{ span: 7 }} >
                  {
                    driverimages.length > 0 ? (driverimages[0].createTime) : '无'
                    // driverimages.length > 0 ? formatDate(driverimages[0].createTime) : '无'
                  }
                </Form.Item>
              </Col> : ''}
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item label="备注:" name='remark' colon={false} labelCol={{ span: 2 }} >
                <Input.TextArea rows={4} disabled={isExit} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <div className='btmBtn'>
                <Space size="large">
                  {/* {!isExit ? (<Button onClick={save} type="primary">保存</Button>) : (<Button onClick={exit} type="primary">修改</Button>)} */}
                  <Button onClick={closePage}>
                    关闭
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>

        </Form>
      </div>
      <BindingModel codeVisible={codeVisible} setCodeShow={setCodeShow} mobile={mobile}></BindingModel>
    </div>
  )
}

export default PageDataMemberinf
