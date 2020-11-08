/** @format */

import React, {useEffect, useState} from 'react'
// import useAntdTable from '@/hooks/useAntdTable'
import * as api from '@/api'
// import * as Moment from 'moment'
import Moment from 'moment'
import 'moment/locale/zh-cn'
import {Form, Button, Input, Radio, Select, DatePicker, message, Checkbox, InputNumber} from 'antd'
import ToolsBar from '@/components/ToolsBar'
import './changeCardType.less'
import {setStore} from '@/utils/store'
// import cardStore from '@/store/cardStore'
import Dist from '@/components/Select/dict'

const size = undefined
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '8px',
}

const dateFormat = 'YYYY-MM-DD'

interface IProps {
  FormData: any
  setCardId: any
  isEdit: any
}

const changeCardType: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [cardType, setCardType] = useState<number>(1)
  const [curUseNum, setCurUseNum] = useState<number>(1)
  const [useNumVal, setUseNumVal] = useState<number>(0)
  const [curUserTime, setCurUserTime] = useState<number>(1)
  const [validDaysVal, setValidDaysVal] = useState<number>(0)
  const [curValidType, setCurValidType] = useState<any>([
    Moment(new Date()).format(dateFormat),
    Moment(new Date()).format(dateFormat),
  ])
  const [mainTitle, setMainTitle] = useState<any[]>(['xxx', 'xx'])

  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [loadings, setLoadings] = useState<boolean>(false)

  const [selectWeekday, setSelectWeekday] = useState<string[]>([])
  const [defaultWeekDay, setDefaultWeekDay] = useState<string[]>([
    '周一',
    '周二',
    '周三',
    '周四',
    '周五',
    '周六',
    '周日',
    '国家节假日除外',
  ])
  // const [defaultUserNum, setDefaultUserNum] = useState<string>('')
  // const {updateCardId} = cardStore.useContainer()
  const {RangePicker} = DatePicker
  const plainOptions = [
    {label: '周一', value: '周一'},
    {label: '周二', value: '周二'},
    {label: '周三', value: '周三'},
    {label: '周四', value: '周四'},
    {label: '周五', value: '周五'},
    {label: '周六', value: '周六'},
    {label: '周日', value: '周日'},
    {label: '国家节假日除外', value: '国家节假日除外'},
  ]
  const isEdit = props.isEdit
  const progress = props.FormData.progress
  const isOnline = props.FormData.isOnline

  useEffect(() => {
    if (progress == 5) {
      if (isOnline == 1) {
        setIsDisabled(true)
      } else {
        if (isEdit) {
          setIsDisabled(false)
        } else {
          setIsDisabled(true)
        }
      }
    } else {
      setIsDisabled(false)
    }
  }, [progress, isEdit, isOnline])

  useEffect(() => {
    const data: any = props.FormData

    if (data.useNum >= 99) {
      setCurUseNum(1)
    } else {
      setCurUseNum(2)
      setUseNumVal(data.useNum)
    }

    if (data.mainTitle) {
    } else {
      data.mainTitle = '满xxx元减xx元满减券'
    }

    if (data.cardType) {
      setCardType(data.cardType)
    }

    if (data.validType == 2) {
      setValidDaysVal(data.validDays)
    } else {
      if (data.validStart && data.validEnd) {
        setCurValidType([
          Moment(new Date(data.validStart)).format(dateFormat),
          Moment(new Date(data.validEnd)).format(dateFormat),
        ])
      }
    }

    if (data.cardsTimes && data.cardsTimes.length > 0 && data.cardsTimes.length < 8) {
      let dataArr: any[] = []
      for (let i in data.cardsTimes) {
        dataArr.push(data.cardsTimes[i].weekday)
        setDefaultWeekDay(dataArr)
      }
      setCurUserTime(2)
    } else {
      setDefaultWeekDay([])
      setCurUserTime(1)
    }
    console.log(data)
    if (data.useType) {
      data.useType = data.useType + ''
    }
    form.setFieldsValue({...data})
    // form.setFieldsValue({useType: data.useType})
  }, [props])

  useEffect(() => {
    console.log('44444')
  }, [props.FormData.minAmount])

  const onChangeCardType = value => {
    setCardType(value)
    if (value == 1) {
      let minAmount = form.getFieldValue('minAmount') || 'xx'
      let discountAmount = form.getFieldValue('discountAmount') || 'xx'
      form.setFieldsValue({
        mainTitle: '满' + minAmount + '元减' + discountAmount + '元满减券',
      })
    } else if (value == 2) {
      let deductAmount = form.getFieldValue('deductAmount') || 'xx'
      if (form.getFieldValue('useType') == '4') {
        form.setFieldsValue({mainTitle: '项目' + deductAmount + '元抵扣券'})
      } else if (form.getFieldValue('useType') == '2') {
        form.setFieldsValue({mainTitle: '工时' + deductAmount + '元抵扣券'})
      } else if (form.getFieldValue('useType') == '3') {
        form.setFieldsValue({mainTitle: '配件' + deductAmount + '元抵扣券'})
      } else if (form.getFieldValue('useType') == '1') {
        form.setFieldsValue({mainTitle: '结算单' + deductAmount + '元抵扣券'})
      } else {
        form.setFieldsValue({mainTitle: '项/工/配/结算单' + deductAmount + '元抵扣券'})
      }
    } else if (value == 3) {
      let discount = form.getFieldValue('discount') || 'xx'
      form.setFieldsValue({mainTitle: discount + '折折扣券'})
    } else if (value == 4) {
      const subTitle = form.getFieldValue('subTitle') || 'xx'
      form.setFieldsValue({mainTitle: subTitle + '兑换券'})
    }
  }
  const onUserNum = e => {
    // setDefaultUserNum(e)
    console.log(e)
    form.setFieldsValue({useNum: Number(e)})
    setUseNumVal(Number(e))
    // console.log((form.getFieldValue as any)())
  }

  const submit = async e => {
    let params = (form.getFieldValue as any)()
    console.log('from', params)
    const cardsTimes: any[] = []
    await form.validateFields()
    if (curUserTime == 1) {
      for (let i in plainOptions) {
        //全部时间
        cardsTimes.push({
          availTime: '全天',
          cardId: params.cardId || '',
          weekday: plainOptions[i].value,
        })
      }
    } else {
      //部分时间
      console.log(selectWeekday)
      for (let i in selectWeekday) {
        cardsTimes.push({
          availTime: '全天',
          cardId: params.cardId || '',
          weekday: selectWeekday[i],
        })
      }
    }
    if (params.validType == 1) {
      params.validStart = curValidType[0]
      params.validEnd = curValidType[1]
      params.validDays = ''
    } else {
      params.validDays = validDaysVal
      params.validStart = ''
      params.validEnd = ''
    }
    console.log(curValidType)
    params.cardsTimes = cardsTimes

    if (curUseNum == 1) {
      params.useNum = 99
    }
    console.log(params)
    setLoadings(true)
    api
      .saveCardInfo({...params})
      .then(res => {
        // if (res.data.code == 1) {
        let data = res.data
        form.setFieldsValue({cardId: data.cardId})
        setStore('curCard', res.data)
        data.scroolType = 1
        // console.log((form.getFieldValue as any)())
        console.log(e)
        props.setCardId(data)
        if (data.useType == 1) {
          let anchorElement = document.getElementById('block_selectChannel')
          if (anchorElement) {
            anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'})
          }
        } else {
          let anchorElement = document.getElementById('block_goodAndProject')
          if (anchorElement) {
            anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'})
          }
        }

        console.log(data)

        setLoadings(false)
        message.success('保存成功')
        // }
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
      })
  }

  const onUserTime = e => {
    console.log(e)
    setSelectWeekday(e)
  }

  const onUseNum = e => {
    console.log(e)
    setCurUseNum(e.target.value)
  }

  const onOkValidType = e => {
    console.log(e)
    if (!e) {
      setValidDaysVal(1)
    } else {
      setValidDaysVal(Number(e))
    }
  }

  const onValidType = (date: any, dateString: string) => {
    console.log(dateString)

    if (!dateString[0] && !dateString[1]) {
      setCurValidType([Moment(new Date()).format(dateFormat), Moment(new Date()).format(dateFormat)])
      console.log('222222')
      // Moment(null).format(dateFormat)
    } else {
      setCurValidType(dateString)
    }
  }

  const oncardsTime = e => {
    console.log(e)
    setCurUserTime(e.target.value)
    if (e.target.value == 1) {
      setDefaultWeekDay(['周一', '周二', '周三', '周四', '周五', '周六', '周日', '国家节假日除外'])
    } else {
      setDefaultWeekDay([])
    }
  }

  const changeValidType = e => {
    console.log(e)
    if (e.target.value == 1) {
      setValidDaysVal(0)
      setCurValidType([Moment(new Date()).format(dateFormat), Moment(new Date()).format(dateFormat)])
    } else {
      setCurValidType([])
    }
  }

  const setMainTitleDH = e => {
    if (form.getFieldValue('cardType') == 4) {
      let val: any
      if (e.target) {
        val = e.target.value
      } else {
        val = e
      }
      form.setFieldsValue({mainTitle: val + '兑换券'})
    }
  }

  const setMainTitleValue = (e, type: any) => {
    console.log(e)
    if (form.getFieldValue('cardType') == 1) {
      if (type == 1) {
        let arr: any = []
        if (e.target) {
          arr = [e.target.value, mainTitle[1]]
        } else {
          arr = [e, mainTitle[1]]
        }

        setMainTitle(arr)
        form.setFieldsValue({mainTitle: '满' + arr[0] + '元减' + mainTitle[1] + '元满减券'})
      } else {
        let arr: any = []
        if (e.target) {
          arr = [mainTitle[0], e.target.value]
        } else {
          arr = [mainTitle[0], e]
        }

        setMainTitle(arr)

        form.setFieldsValue({mainTitle: '满' + mainTitle[0] + '元减' + arr[1] + '元满减券'})
      }
    } else if (form.getFieldValue('cardType') == 2) {
      if (form.getFieldValue('useType') == '4') {
        let val: any
        if (e.target) {
          val = e.target.value
        } else {
          val = e
        }
        form.setFieldsValue({mainTitle: '项目' + val + '元抵扣券'})
      } else if (form.getFieldValue('useType') == '2') {
        let val: any
        if (e.target) {
          val = e.target.value
        } else {
          val = e
        }
        form.setFieldsValue({mainTitle: '工时' + val + '元抵扣券'})
      } else if (form.getFieldValue('useType') == '3') {
        let val: any
        if (e.target) {
          val = e.target.value
        } else {
          val = e
        }
        form.setFieldsValue({mainTitle: '配件' + val + '元抵扣券'})
      } else if (form.getFieldValue('useType') == '1') {
        let val: any
        if (e.target) {
          val = e.target.value
        } else {
          val = e
        }
        form.setFieldsValue({mainTitle: '结算单' + val + '元抵扣券'})
      } else {
        let val: any
        if (e.target) {
          val = e.target.value
        } else {
          val = e
        }
        form.setFieldsValue({mainTitle: '项/工/配/结算单' + val + '元抵扣券'})
      }
    } else if (form.getFieldValue('cardType') == 3) {
      if (!type) {
        let val: any
        if (e.target) {
          val = e.target.value
        } else {
          val = e
        }
        form.setFieldsValue({mainTitle: val + '折折扣券'})
        // form.setFieldsValue({discount: e})
      }
    }
  }

  const changeMainTitle = e => {
    console.log(e)
    if (form.getFieldValue('cardType') == 2) {
      if (e == 4) {
        form.setFieldsValue({mainTitle: '项目' + form.getFieldValue('deductAmount') + '元抵扣券'})
      }

      if (e == 2) {
        form.setFieldsValue({mainTitle: '工时' + form.getFieldValue('deductAmount') + '元抵扣券'})
      }

      if (e == 3) {
        form.setFieldsValue({mainTitle: '配件' + form.getFieldValue('deductAmount') + '元抵扣券'})
      }

      if (e == 1) {
        form.setFieldsValue({mainTitle: '结算单' + form.getFieldValue('deductAmount') + '元抵扣券'})
      }
    }
  }

  const editCardTotal = e => {
    if (progress == 5) {
      //修改后的券总数不能小于领取量
      let num = props.FormData.drawNum
      if (e < num) {
        message.error('券总数不能小于领取量')
        return
      }
    }
  }

  const validTime: any = [Moment(curValidType[0]), Moment(curValidType[1])]

  // const d = form.getFieldValue as any)()

  return (
    <div className="block_selectCard block" id="block_selectCard">
      <div className="block_title">
        <span>选择优惠券类型</span>
      </div>
      {/* {props?.FormData?.cardsTimesLenght} */}

      <ToolsBar visible={false}>
        <div className="block_content">
          <Form
            labelCol={{span: 5}}
            wrapperCol={{span: 14}}
            layout="horizontal"
            initialValues={{
              ['input-number']: 999999,
              validType: 1,
              suitLimit: 2,
              validStart: Moment(curValidType[0]),
              validEnd: Moment(curValidType[1]),
            }}
            form={form}
            size={size}>
            <Form.Item label="券类型" name="cardType" rules={[{required: true, message: '券类型必填'}]}>
              <Select
                placeholder="选择券类型"
                style={{width: '230px'}}
                allowClear
                onChange={onChangeCardType}
                disabled={isDisabled}>
                <Select.Option value={1}>满减券</Select.Option>
                <Select.Option value={2}>抵扣券</Select.Option>
                <Select.Option value={3}>折扣券</Select.Option>
                <Select.Option value={4}>兑换券</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="主标题：" name="mainTitle" rules={[{required: true, message: '主标题必填'}]}>
              <Input placeholder="请输入券名称" size={size} style={{width: '230px'}} disabled allowClear></Input>
            </Form.Item>
            <Form.Item label="副标题: " name="subTitle" rules={[{required: true, message: '副标题必填'}]}>
              <Input
                placeholder="请输入副标题"
                size={size}
                max={30}
                style={{width: '350px'}}
                disabled={isDisabled}
                onChange={e => setMainTitleDH(e)}
                allowClear></Input>
            </Form.Item>
            <Form.Item label="" style={{marginTop: '-10px', marginLeft: '160px'}}>
              (建议填写方式：活动名称+金额+券类型； 比如：双十一限时抢购活动-消费满1000元减500元满)减券
            </Form.Item>
            {cardType === 1 || cardType === 3 ? (
              <Form.Item
                label="最小交易金额:"
                name="minAmount"
                // visible={'cardType' == 1}
                rules={[{required: true, message: '最小交易金额必填'}]}>
                <InputNumber
                  placeholder="请输入最小交易金额"
                  size={size}
                  min={0}
                  max={99999}
                  disabled={isDisabled}
                  style={{width: '230px'}}
                  onChange={e => setMainTitleValue(e, 1)}></InputNumber>
              </Form.Item>
            ) : null}

            {cardType === 2 ? (
              <Form.Item
                label="抵扣金额:"
                name="deductAmount"
                // visible={'cardType' == 1}
                rules={[{required: true, message: '抵扣金额必填'}]}>
                <InputNumber
                  placeholder="请输入抵扣金额"
                  size={size}
                  max={999999}
                  disabled={isDisabled}
                  style={{width: '230px'}}
                  onChange={e => setMainTitleValue(e, '')}></InputNumber>
              </Form.Item>
            ) : null}

            {cardType === 3 ? (
              <Form.Item label="折扣:" name="discount" rules={[{required: true, message: '折扣必填'}]}>
                <InputNumber
                  placeholder="请输入折扣"
                  size={size}
                  step={0.1}
                  min={0}
                  disabled={isDisabled}
                  style={{width: '230px'}}
                  onChange={e => setMainTitleValue(e, '')}></InputNumber>
              </Form.Item>
            ) : null}

            {cardType === 1 ? (
              <Form.Item label="优惠金额:" name="discountAmount" rules={[{required: true, message: '优惠金额必填'}]}>
                <InputNumber
                  placeholder="请输入优惠金额"
                  size={size}
                  style={{width: '230px'}}
                  min={0}
                  disabled={isDisabled}
                  max={99999}
                  onChange={e => setMainTitleValue(e, 2)}></InputNumber>
              </Form.Item>
            ) : null}

            <Form.Item label="券总数量:" name="total" rules={[{required: true, message: '券总数量必填'}]}>
              <InputNumber
                min={1}
                max={999999}
                placeholder="请输入券总数量"
                style={{width: '230px'}}
                onChange={editCardTotal}
                disabled={progress == 5 && !isEdit}
              />
              {/* <Input placeholder="请输入券总数量" size={size} style={{width: '230px'}} allowClear></Input> */}
            </Form.Item>
            <Form.Item label="使用次数:" rules={[{required: true, message: '使用次数必填'}]}>
              <Radio.Group onChange={onUseNum} value={curUseNum} disabled={isDisabled}>
                <Radio value={1}>无限次</Radio>
                <Radio value={2}>自定义</Radio>
                {curUseNum === 2 ? (
                  <span>
                    <InputNumber
                      placeholder="次"
                      value={useNumVal}
                      onChange={e => onUserNum(e)}
                      min={0}
                      max={99}
                      precision={0}
                      size={size}
                      disabled={isDisabled}
                      style={{width: '50px'}}
                    />
                    &nbsp;次
                  </span>
                ) : null}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="可用时段:">
              <Radio.Group onChange={oncardsTime} value={curUserTime} disabled={isDisabled}>
                <Radio style={radioStyle} value={1}>
                  全部时间 &nbsp;&nbsp;
                  <Select placeholder="全天" style={{width: '130px'}} value={1}>
                    <Select.Option value={1}>全天</Select.Option>
                    {/* <Select.Option value="2">上午</Select.Option>
                    <Select.Option value="3">下午</Select.Option> */}
                  </Select>
                </Radio>
                <Radio style={radioStyle} value={2}>
                  部分时间
                </Radio>
                {curUserTime === 2 ? (
                  <Checkbox.Group
                    options={plainOptions}
                    defaultValue={defaultWeekDay}
                    // value={defaultWeekDay}
                    onChange={onUserTime}
                  />
                ) : null}
              </Radio.Group>
            </Form.Item>
            <Form.Item label="使用类型:" name="useType" rules={[{required: true, message: '使用类型必填'}]}>
              <Dist
                type={'cards_use_type'}
                style={{width: 230}}
                placeholder="选择使用类型"
                disabled={isDisabled}
                onChange={changeMainTitle}></Dist>

              {/* <Select placeholder="选择使用类型" style={{width: '230px'}} onChange={changeMainTitle}>
                <Select.Option value={1}>项目费用</Select.Option>
                <Select.Option value={2}>工时费用</Select.Option>
                <Select.Option value={3}>配件费用</Select.Option>
                <Select.Option value={0}>整个结算单</Select.Option>
              </Select> */}
            </Form.Item>
            <Form.Item label="有效期:" name="validType">
              <Radio.Group onChange={changeValidType} disabled={isDisabled}>
                <Radio style={radioStyle} value={1}>
                  固定时间 &nbsp;&nbsp;
                  <RangePicker
                    disabled={isDisabled}
                    onChange={(data, value: any) => onValidType(data, value)}
                    value={validTime}

                    // defaultValue={[
                    //   Moment(props.FormData.validStart ? props.FormData.validStart : new Date(), dateFormat),
                    //   Moment(props.FormData.validEnd ? props.FormData.validEnd : new Date(), dateFormat),
                    // ]}
                  />
                </Radio>
                <Radio style={radioStyle} value={2}>
                  动态时间领券后&nbsp;
                  <InputNumber
                    placeholder=""
                    value={validDaysVal}
                    size={size}
                    min={1}
                    max={99}
                    disabled={isDisabled}
                    style={{width: '50px'}}
                    onChange={onOkValidType}></InputNumber>
                  &nbsp;天内有效
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="使用限制:" name="suitLimit">
              <Radio.Group disabled={isDisabled}>
                <Radio value={2}>不可与其它券共用</Radio>
                <Radio value={1}>无限制</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item style={{textAlign: 'center'}}>
              <Button
                htmlType="submit"
                type="primary"
                size={size}
                loading={loadings}
                disabled={progress == 5 && !isEdit}
                onClick={e => submit(e)}>
                下一步
              </Button>

              {/* <Button type="primary" icon={<UploadOutlined />} size={size} style={{marginLeft: '18px'}}>
                导出
              </Button> */}
            </Form.Item>
          </Form>
        </div>
      </ToolsBar>
    </div>
  )
}

export default changeCardType
