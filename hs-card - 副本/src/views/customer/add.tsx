/** @format */

import React, {useState, useEffect} from 'react'
import {useRequest} from '@umijs/hooks'
import {Form, Row, Col, Input, Space, Button, Select, message, DatePicker, Divider} from 'antd' //Divider
import UploadImg from '@/components/Upload/ImageQN'
import SelectComp from '@/components/Select/comp'
import SelectMember from '@/components/Select/member'
import BindingModel from '@/components/CustomerVip/bindingModel'
import {region, checkMobile} from '@/interface/customer' //formatDate
import {useHistory} from 'react-router-dom'
import TagViewStore from '@/store/tag-view'
import moment from 'moment'
import './style.less'
import * as api from '@/api'
const {province, city, area, town} = require('province-city-china/data')
const provinceOld = province
const cityOld = city
const areaOld = area
const townOld = town
const classfy = []

interface IProps {
  IsEdit //是否编辑
  customerId
}
const PageDataAddCustomer: React.FC<IProps> = props => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [currentCity, setCurrentCity] = useState<any[]>([])
  const [currentArea, setCurrentArea] = useState<any[]>([])
  const [currentTown, setCurrentTown] = useState<any[]>([])
  const [groupList, setGroupList] = useState<any[]>([])
  const [currentProvinceId, setCurrentProvinceId] = useState<string>('')
  const [birthday, setBirthday] = useState<string>('')
  const [currentCityId, setCurrentCityId] = useState<string>('')
  const [compCode, setCompCode] = useState('')
  const [codeVisible, setCodeVisible] = useState<boolean>(false)
  const [mobile, setMobile] = useState('')
  // const [IDimamges, setIDimamges] = useState<any[]>([])
  const [IDtime, setIDtime] = useState<string>('')
  const [drivtime, setDrivtime] = useState<string>('')
  const [addressLink, setAddressLink] = useState('')
  const [isExit, setIsExit] = useState<boolean>(false)
  const {delView} = TagViewStore.useContainer()
  // const IsEditSign = props.IsEdit
  useEffect(() => {
    if (props.customerId) {
      getCumstomerDetail()
      setIsExit(true)
      sessionStorage.setItem('customerId', props.customerId)
    }
  }, [props.customerId])

  useEffect(() => {
    if (compCode) {
      setCompCode(compCode)
    }
  }, [compCode])
  //编辑 -- 根据id 请求客户数据
  const getCumstomerDetail = () => {
    api.getCumstomerId({id: props.customerId}).then(res => {
      const customerInf = {
        employeeName: '',
        groupName: '',
        groupId: '',
        openID: '无',
        sort: '无',
        addressLink: '',
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: '',
      }
      const data = {...customerInf, ...res.data}
      for (let [key] of Object.entries(data)) {
        const objVal = getDataTo(key, data)
        data[key] = objVal
      }
      form.setFieldsValue({...data})

      // if (data.pic1 && data.pic1 !== '无' || data.pic2 && data.pic2 !== '无') {
      //   setIDsign(true)

      // }
      // if (data.pic3 && data.pic3 !== '无' || data.pic4 && data.pic4 !== '无') {
      //   setDrivsign(true)
      // }
    })
  }
  // 编辑-解构数据
  const getDataTo = (key, data) => {
    var gets = {
      gender: function() {
        return data[key] ? (data[key] === 1 ? '男' : '女') : '无'
      },
      cars: function() {
        return data[key] ? data[key].toString() : '无'
      },
      compCode: function() {
        setCompCode(data[key] ? data[key] : '')
        if (data[key]) {
          getGroupList(data[key])
        }
        return data[key] ? data[key] : '无'
      },
      employeeName: function() {
        return data.ascriptions && data.ascriptions.length > 0 && data.ascriptions[0].employeeName
          ? data.ascriptions[0].employeeName
          : '无'
      },
      groupId: function() {
        return data.ascriptions && data.ascriptions.length > 0 && data.ascriptions[0].groupName
          ? data.ascriptions[0].groupName
          : '无'
      },
      birthday: function() {
        if (data[key]) {
          setBirthday(data[key])
        } else {
          setBirthday('无')
        }
        return data[key] ? moment(data[key], 'YYYY-MM-DD') : ''
      },
      files: function() {
        // setIDimamges(data[key])
        data[key].map(item => {
          if (item.sourceType === 'identity_card_front') {
            data.pic1 = item.fileUrl
            setIDtime(item.createTime)
          } else if (item.sourceType === 'identity_card_back') {
            data.pic2 = item.fileUrl
            setIDtime(item.createTime)
          } else if (item.sourceType === 'drive_card_front') {
            data.pic3 = item.fileUrl
            setDrivtime(item.createTime)
          } else {
            data.pic4 = item.fileUrl
            setDrivtime(item.createTime)
          }
        })
        return data[key]
      },

      addressLink: function() {
        const addressLink = `${data.province}${data.city}${data.district}${data.street}${data.address}`
        return setAddressLink(addressLink ? addressLink : '无')
      },
      // 'updateTime': function () {
      //   return data[key] ? formatDate(data[key]) : ""
      // },
      default: function() {
        return data[key] ? data[key] : '无'
      },
    }
    return (gets[key] || gets['default'])()
  }

  //获取客户来源
  const {data: customerArray} = useRequest((paginate, formData) =>
    api.getDictList({...paginate, ...formData, dictType: 'customer_source'}).then(res => res.data),
  )
  //选择归属门店
  const onChangeCompCode = value => {
    setCompCode(value)
    getGroupList(value)
    form.setFieldsValue({employeeName: '', groupId: ''})
  }
  //获取小组
  const getGroupList = value => {
    api.getCompGroupMember({compCode: value}).then(res => setGroupList(res.data))
  }
  //选择日期
  const dataChange = (date, dateString: string) => {
    console.log(typeof dateString, '=======typeof(dateString)')
    setBirthday(dateString)
  }
  //选择省- 市数据
  const changeProvince = (id, option) => {
    setCurrentProvinceId(option.id)
    const params = {
      id: option.id,
      data: cityOld,
      type: 'province',
      currentProvinceId: option.id,
      currentCityId: currentCityId,
      column: {
        province: option.value,
        name: option.children,
        city: '01',
      },
    }
    //解决直辖市问题
    let city = region(params)
    if (city && city.length === 1) {
      setCurrentCityId('01')
    }
    setCurrentCity(region(params))
    form.setFieldsValue({district: '', city: '', street: ''})
  }
  //选择市--区数据
  const changeCity = (id, option) => {
    setCurrentCityId(option.id)
    const params = {
      id: option.id,
      data: areaOld,
      type: 'city',
      currentProvinceId: currentProvinceId,
      currentCityId: option.id,
      column: '',
    }
    setCurrentArea(region(params))
    form.setFieldsValue({district: '', street: ''})
  }
  //区数据--街道数据
  const changeArea = (id, option) => {
    const params = {
      id: option.id,
      data: townOld,
      type: 'town',
      currentProvinceId: currentProvinceId,
      currentCityId: currentCityId,
      column: '',
    }
    setCurrentTown(region(params))
    form.setFieldsValue({street: ''})
  }
  //专属顾问
  const getemployeename = (val, option) => {
    form.setFieldsValue({employeeCode: option.value, employeeName: option.children})
  }
  useEffect(() => {
    form.setFieldsValue({
      employeeName: undefined,
      groupId: undefined,
    })
    if (compCode) {
      getGroupList(compCode)
    }
  }, [compCode])
  //手机号已被绑定情况下弹窗回调
  const setCodeShow = val => {
    setCodeVisible(val)
  }
  //封装图片方法用于接口
  const getIDImages = (type, data) => {
    var get = {
      1: function() {
        return {
          type: 'image',
          sourceType: 'identity_card_front',
          fileName: '身份证正面',
          fileUrl: data['pic1'],
        }
      },
      2: function() {
        return {
          type: 'image',
          sourceType: 'identity_card_back',
          fileName: '身份证反面',
          fileUrl: data['pic2'],
        }
      },
      3: function() {
        return {
          type: 'image',
          sourceType: 'drive_card_front',
          fileName: '驾驶证正面',
          fileUrl: data['pic3'],
        }
      },
      4: function() {
        return {
          type: 'image',
          sourceType: 'drive_card_back',
          fileName: '驾驶证反面',
          fileUrl: data['pic4'],
        }
      },
    }
    return get[type]()
  }
  const closePage = () => {
    delView({pathname: '/customer/add', state: {title: '新增客户'}})
    history.push('/customer/list')
  }
  const closePageDetail = () => {
    delView({pathname: '/customer/detail', state: {title: '客户档案详情'}})
    history.push('/customer/list')
  }
  //修改
  const exit = () => {
    setBirthday('')
    let data = (form.getFieldValue as any)()
    for (let [key] of Object.entries(data)) {
      if (data[key] === '无') {
        data[key] = ''
      }
    }
    console.log(data)
    // if (IDimamges.length > 0) {
    //   IDimamges.map(item => {
    //     if (item.sourceType === "identity_card_front") {
    //       data.pic1 = item.fileUrl
    //     } else if (item.sourceType === "identity_card_back") {
    //       data.pic2 = item.fileUrl
    //     } else if (item.sourceType === "drive_card_front") {
    //       data.pic3 = item.fileUrl
    //     } else {
    //       data.pic4 = item.fileUrl
    //     }
    //   })
    // }
    form.setFieldsValue(data)
    setIsExit(false)
  }
  //保存
  const save = () => {
    form
      .validateFields()
      .then(res => {
        let params = (form.getFieldValue as any)()

        let picArr: Array<any> = []
        if (!checkMobile(params.mobile)) {
          message.error('请输入正确手机号码')
          return
        }
        setMobile(params.mobile)
        for (let i = 1; i <= 4; i++) {
          if (params['pic' + i]) {
            const IDImages = getIDImages(i, params)
            picArr.push(IDImages)
          }
        }
        //编辑情况 传客户id
        if (props.customerId) {
          params.id = props.customerId
        }
        params.files = picArr
        params.gender = params.gender ? (params.gender === '男' ? '1' : '2') : ''
        params.birthday = birthday !== '无' ? birthday : params.birthday

        params.ascription = {
          compCode: params.compCode,
          employeeCode: params.employeeCode,
          employeeName: params.employeeName,
          groupId: params.groupId ? params.groupId : '',
        }
        delete params.groupId
        // delete params.pic1
        // delete params.pic2
        // delete params.pic3
        // delete params.pic4
        // delete params.compCode
        // delete params.employeeCode
        // delete params.employeeName
        delete params.createTime
        delete params.updateTime
        api
          .saveCustomerInfo(params)
          .then(res => {
            //解决时间组件问题
            params.birthday = params.birthday ? moment(params.birthday, 'YYYY-MM-DD') : ''
            if (res.code === 1) {
              message.success('保存成功')
              if (props.customerId) {
                closePageDetail()
              } else {
                closePage()
              }
            } else if (res.code == 60008) {
              setCodeVisible(true)
            } else {
              message.error('保存失败')
            }
          })
          .catch(err => {})
      })
      .catch(err => {
        message.warning('请完善相关信息')
      })
  }
  return (
    <div className="addCustomer block">
      {!props.IsEdit ? (
        <div className="block_title">
          <span>创建客户档案</span>
        </div>
      ) : (
        ''
      )}

      <div className="block_content">
        <Form labelCol={{span: 6}} form={form}>
          {isExit ? (
            <div>
              <Row>
                <Col span={7}>
                  <Form.Item name="id" label="客户ID" rules={[{required: true}]}>
                    <Input allowClear disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="openID" label="openID" rules={[{required: true}]}>
                    <Input allowClear disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="wxUnionId" label="unionID" rules={[{required: true}]}>
                    <Input allowClear disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ) : (
            ''
          )}
          <Row>
            <Col span={7}>
              <Form.Item name="name" label="客户姓名" rules={[{required: true}]}>
                <Input allowClear disabled={isExit}></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="mobile" label="手机号" rules={[{required: true}]}>
                <Input allowClear max={11} disabled={isExit}></Input>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="source" label="客户来源" rules={[{required: true}]}>
                <Select placeholder="选择客户来源" allowClear disabled={isExit}>
                  {customerArray?.map(item => (
                    <Select.Option value={item.dictValue} key={item.dictValue}>
                      {item.dictLabel}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={7}>
              <Form.Item name="gender" label="性别">
                <Select disabled={isExit}>
                  <Select.Option value="1">男</Select.Option>
                  <Select.Option value="2">女</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="birthday" label="生日">
                {birthday !== '无' ? (
                  <DatePicker onChange={dataChange} format="YYYY-MM-DD" disabled={isExit} placeholder="" />
                ) : (
                  <span>无</span>
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="sort" label="分类">
                <Select disabled={isExit}>
                  {classfy.map(item => (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            {!isExit ? (
              <Col span={21}>
                <Form.Item label="地址" labelCol={{span: 2}} style={{marginBottom: 0}}>
                  <Form.Item name="province" style={{width: 130, display: 'inline-block'}}>
                    <Select placeholder="选择省份" allowClear onChange={changeProvince} disabled={isExit}>
                      {provinceOld.map(item => (
                        <Select.Option value={item.name} id={item.province} key={item.name}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="city" style={{width: 130, display: 'inline-block', marginLeft: 10}}>
                    <Select placeholder="选择城市" onChange={changeCity} disabled={isExit}>
                      {currentCity.length > 0
                        ? currentCity.map(item => (
                            <Select.Option value={item.name} key={item.name} id={item.city}>
                              {item.name}
                            </Select.Option>
                          ))
                        : ''}
                    </Select>
                  </Form.Item>
                  <Form.Item name="district" style={{width: 130, display: 'inline-block', marginLeft: 10}}>
                    <Select placeholder="选择区/县" onChange={changeArea} disabled={isExit}>
                      {currentArea.length > 0
                        ? currentArea.map(item => (
                            <Select.Option value={item.name} key={item.name} id={item.area}>
                              {item.name}
                            </Select.Option>
                          ))
                        : ''}
                    </Select>
                  </Form.Item>
                  <Form.Item name="street" style={{width: 130, display: 'inline-block', marginLeft: 10}}>
                    <Select placeholder="选择街道" disabled={isExit}>
                      {currentTown.length > 0
                        ? currentTown.map(item => (
                            <Select.Option value={item.name} key={item.name}>
                              {item.name}
                            </Select.Option>
                          ))
                        : ''}
                    </Select>
                  </Form.Item>
                  <Form.Item name="address" style={{width: 280, display: 'inline-block', marginLeft: 10}}>
                    <Input allowClear placeholder="详细地址" disabled={isExit}></Input>
                  </Form.Item>
                </Form.Item>
              </Col>
            ) : (
              <Col span={7}>
                <Form.Item name="address" label="地址">
                  <div className="addressLink">{addressLink}</div>
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row>
            <Col span={7}>
              <Form.Item name="compCode" rules={[{required: true}]} label="归属门店">
                <SelectComp
                  disabled={isExit}
                  showSearch
                  allowClear
                  placeholder="归属门店"
                  filterOption={(input, option) => option?.children.indexOf(input) >= 0}
                  onChange={onChangeCompCode}
                  style={{width: '100%', maxWidth: '228px'}}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="employeeName" rules={[{required: true}]} label="专属顾问">
                {isExit ? (
                  <SelectMember
                    showSearch
                    allowClear
                    placeholder="专属顾问"
                    compCode={compCode}
                    filterOption={(input, option) => option?.children.indexOf(input) >= 0}
                    disabled
                    style={{width: '100%', maxWidth: '228px'}}
                  />
                ) : (
                  <SelectMember
                    showSearch
                    allowClear
                    placeholder="专属顾问"
                    compCode={compCode}
                    filterOption={(input, option) => option?.children.indexOf(input) >= 0}
                    disabled={!compCode}
                    onChange={getemployeename}
                    style={{width: '100%', maxWidth: '228px'}}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="groupId" label="服务小组">
                {isExit ? (
                  <Select placeholder="服务小组" allowClear disabled>
                    {groupList?.length &&
                      groupList?.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                ) : (
                  <Select placeholder="服务小组" allowClear disabled={!compCode}>
                    {groupList?.length &&
                      groupList?.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                )}
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
              <Form.Item label="身份证图片" labelCol={{span: 3}} style={{marginBottom: 0}}>
                <Form.Item name="pic1" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传身份证正面" disabled={isExit} />
                </Form.Item>
                <Form.Item name="pic2" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传身份证反面" disabled={isExit} />
                </Form.Item>
              </Form.Item>
            </Col>
            {isExit ? (
              <Col span={8}>
                <Form.Item label="身份证上传日期" name="updateTime" labelCol={{span: 7}}>
                  {IDtime ? <span>{IDtime}</span> : <span>无</span>}
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
          </Row>
          <Row>
            <Col span={14}>
              <Form.Item label="驾驶证图片" labelCol={{span: 3}} style={{marginBottom: 0}}>
                <Form.Item name="pic3" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传驾驶证正面" disabled={isExit} />
                </Form.Item>
                <Form.Item name="pic4" style={{display: 'inline-block'}}>
                  <UploadImg className="id-img-upload" title="请上传驾驶证反面" disabled={isExit} />
                </Form.Item>
              </Form.Item>
            </Col>
            {isExit ? (
              <Col span={8}>
                <Form.Item label="驾驶证上传日期" name="updateTime" labelCol={{span: 7}}>
                  {drivtime ? <span>{drivtime}</span> : <span>无</span>}
                </Form.Item>
              </Col>
            ) : (
              ''
            )}
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item label="备注:" name="remark" colon={false} labelCol={{span: 2}}>
                <Input.TextArea rows={4} disabled={isExit} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <div className="btmBtn">
                <Space size="large">
                  {!isExit ? (
                    <Button onClick={save} type="primary">
                      保存
                    </Button>
                  ) : (
                    <Button onClick={exit} type="primary">
                      修改
                    </Button>
                  )}
                  {props.customerId ? (
                    <Button onClick={closePageDetail}>关闭</Button>
                  ) : (
                    <Button onClick={closePage}>关闭</Button>
                  )}
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

export default PageDataAddCustomer
