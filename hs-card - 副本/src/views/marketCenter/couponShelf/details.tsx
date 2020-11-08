/** @format */

import React, {useEffect, useState} from 'react'
import {Form, Input, Row, Col, Button, Modal, Spin, Pagination, message} from 'antd'
import * as api from '@/api'
// import {IEditType} from '@/interface'
import './index.less'
import UploadImg from '@/components/Upload/ImageQN'
import Moment from 'moment'
import 'moment/locale/zh-cn'
// import {PlusOutlined} from '@ant-design/icons'
import Table, {ColumnProps} from 'antd/lib/table'

import {IActivityCardDetails} from '@/interface/activity'
// import useSearchParam from '@/hooks/useSearchParams'
import {useHistory} from 'react-router-dom'
// import Icon from '@ant-design/icons'
// import {stripBasename} from 'history/PathUtils'
const dateFormat = 'YYYY-MM-DD'

const CardDetails = () => {
  const history = useHistory()

  const parmId = history.location.search.split('=')[1]
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState<string[]>([])

  // const [cardTypeDetailsData, setCardTypeDetailsData] = useState<any>({total: 0, itmes: []})
  const [cardTypeDetailsDataList, setcardTypeDetailsDataList] = useState<any>([])
  const [cardTypeVisible, setCardTypeVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [cardTypeData, setCardTypeData] = useState<any>()
  const [imageUrl, setImageUrl] = useState<any>()
  const [isExit] = useState<boolean>(false)
  console.log(parmId)

  useEffect(() => {
    if (parmId) {
      let params = {
        id: parmId,
      }
      setLoading(true)
      api
        .getActivityCardDetails(params)
        .then((res: any) => {
          if (res.code == 1) {
            form.setFieldsValue({name: res.data.name})
            form.setFieldsValue({title: res.data.title})
            setImageUrl(res.data.signboardImageUrl)
            let params = {
              pageSize: 1000,
              page: 1,
              channel: '005',
              cardsShelvesId: parmId,
            }
            initData(params)
          } else {
            form.setFieldsValue({title: ''})
            form.setFieldsValue({name: ''})
            setcardTypeDetailsDataList([])
            setImageUrl('')
          }
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    } else {
      form.setFieldsValue({title: ''})
      form.setFieldsValue({name: ''})
      setcardTypeDetailsDataList([])
      setImageUrl('')
    }
  }, [parmId])

  const initData = data => {
    let params = {
      pageSize: data.pageSize || 1000,
      page: data.page || 1,
      channel: '005',
      cardsShelvesId: parmId,
    }
    api
      .getActivityCardTypeDetailsList(params)
      .then(res => {
        // setCardTypeDetailsData(res.data)
        setcardTypeDetailsDataList(res.data.items)

        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading(false)
      })
  }

  const onSelectChange = (selectedRowKeys, selectedRow) => {
    console.log(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRow(selectedRow)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const uniqueArr = (arr1, arr2) => {
    let arr3 = arr1 || []
    let arr4 = arr2 || []
    let c = [...arr3, ...arr4] //两个数组合并一个的简单方法
    let d = []
    let hash = {}
    d = c.reduce((item, next) => {
      hash[next.cardId] ? '' : (hash[next.cardId] = true && item.push(next))
      return item
    }, [])
    return d
  }

  const saveSelectCard = () => {
    // setCardTypeDetailsData
    console.log(selectedRow)
    let arr = uniqueArr(selectedRow, cardTypeDetailsDataList)
    setcardTypeDetailsDataList(arr)

    setCardTypeVisible(false)
    // selectedRow
  }
  const cardTypeCancel = () => {
    setCardTypeVisible(false)
  }
  const showCardType = data => {
    setLoading(true)
    let params = {
      pageSize: data.pageSize || 8,
      page: data.page || 1,
      channel: data.channel || '005',
    }
    api.getActivityCardTypeList(params).then((res: any) => {
      if (res.code == 1) {
        setCardTypeData(res.data)
        setCardTypeVisible(true)
      } else {
        setCardTypeVisible(true)
      }

      setLoading(false)
    })
  }

  const delCardTypeDetails = (cardId: number) => {
    console.log(cardId)

    var filterItems = cardTypeDetailsDataList.filter(function(item) {
      return item.cardId !== cardId
    })
    // setCardTypeDetailsData(cardTypeDetailsData)
    setcardTypeDetailsDataList(filterItems)
  }

  const changeImg = (imgUrl: any) => {
    setImageUrl(imgUrl)
  }

  const onChangeCardType = (page, pageSize) => {
    setSelectedRowKeys([]) // 下一页 清空其他页的勾选
    // setSelectedRowGoodKey([])
    let params = {
      page: page,
      pageSize: pageSize,
      channel: '005',
      cardsShelvesId: parmId,
    }
    showCardType(params)
  }
  const onShowSizeChange = e => {}

  // const onChangeCardTypeDetails = (page, pageSize) => {
  //   let params = {
  //     page: page,
  //     pageSize: pageSize,
  //     channel: '005',
  //   }
  //   initData(params)
  // }
  // const onShowSizeChangeDetails = e => {}

  const saveData = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    form.validateFields().then(async values => {
      // if (!imageUrl) {
      //   message.error('卡券招牌不能为空！')
      //   return
      // }
      let params: any = {
        id: parmId,
        signboardImageUrl: imageUrl,
        name: form.getFieldValue('name'),
        title: form.getFieldValue('title'),
        details: [],
      }

      for (let i in cardTypeDetailsDataList) {
        params.details.push({
          cardId: cardTypeDetailsDataList[i].cardId || '',
          channel: cardTypeDetailsDataList[i].channel || '',
        })
      }
      setLoading(true)
      api
        .saveActivityCard(params)
        .then((res: any) => {
          message.success('保存成功')
          setLoading(false)
          history.push('/activity/card')
        })
        .catch((err: any) => {
          message.error('保存失败')
          setLoading(false)
          // props.addVisible()
        })
    })
  }

  const setName = e => {
    form.setFieldsValue({name: e.target.value})
  }

  const setTitle = e => {
    form.setFieldsValue({title: e.target.value})
  }
  const fomartUsetype = val => {
    console.log(val)
    let str: string = ''
    if (val == 1) {
      str = '满减券'
    }

    if (val == 2) {
      str = '抵扣券'
    }

    if (val == 3) {
      str = '折扣券'
    }

    if (val == 4) {
      str = '兑换券'
    }

    return str
  }
  const columns: ColumnProps<IActivityCardDetails>[] = [
    {
      title: '券类型',
      dataIndex: 'cardType',
      align: 'left',
      render: (a, row) => {
        let cardType: any = ''
        if (row.cardType == '1') {
          cardType = '满减券'
        } else if (row.cardType == '2') {
          cardType = '抵扣券'
        } else if (row.cardType == '3') {
          cardType = '折扣券'
        } else if (row.cardType == '4') {
          cardType = '兑换券'
        }

        return cardType
      },
    },
    {
      title: '券名称',
      dataIndex: 'subTitle',
      align: 'center',
    },
    {
      title: '有效期',
      dataIndex: 'validDays',
      align: 'center',
      render: (a, row) => {
        let validDays: any = ''
        if (row.validType == 1) {
          validDays = Moment(row.validEnd).format(dateFormat)
        } else if (row.validType == 2) {
          validDays = row.validDays
        }

        return validDays
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (a, b, index) => {
        return (
          <div>
            <Button type="link" onClick={() => delCardTypeDetails(a.cardId)} style={{color: '#FB721F'}}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const columnsType: ColumnProps<IActivityCardDetails>[] = [
    {
      title: '卡券类型',
      dataIndex: 'cardType',
      align: 'left',
      width: 80,
      render: (a, row) => {
        let cardType: any = ''
        if (row.cardType == '1') {
          cardType = '满减券'
        } else if (row.cardType == '2') {
          cardType = '抵扣券'
        } else if (row.cardType == '3') {
          cardType = '折扣券'
        } else if (row.cardType == '4') {
          cardType = '兑换券'
        }

        return cardType
      },
    },
    {
      title: '卡券名称',
      dataIndex: 'subTitle',
      align: 'center',
      width: 220,
    },
    {
      title: '有效期',
      dataIndex: 'validDays',
      align: 'center',
      render: (a, row) => {
        let validDays: any = ''
        if (row.validType == 1) {
          validDays = Moment(row.validEnd).format(dateFormat)
        } else if (row.validType == 2) {
          validDays = row.validDays
        }

        return validDays
      },
    },
    {
      title: '库存',
      dataIndex: 'cardNum',
      align: 'center',
    },
  ]

  return (
    <div className="cardPage">
      <Spin spinning={loading}>
        <Row>
          <Col className="preview" style={{overflow: 'hidden'}}>
            {/* <iframe src="http://localhost:3102/activityCard" style={{height: 518, background: '#fff', width: '100%', border: 'none'}}> */}
            <div style={{textAlign: 'center', padding: '10px 0', fontSize: '16px'}}>{form.getFieldValue('title')}</div>
            <div style={{height: '590px', overflow: 'auto'}}>
              <div style={{marginBottom: '10px'}}>
                <img src={imageUrl} style={{width: '100%'}}></img>
              </div>
              <div style={{padding: '0 10px'}}>
                {cardTypeDetailsDataList.map((item, idx) => (
                  <div className="cdWrap" key={idx}>
                    <div className="cd-body1">
                      <div className="cd-body">
                        <div className="cd-body-title">
                          <div className="tag1">{fomartUsetype(item.cardType)}</div>
                          {item.mainTitle}
                        </div>
                        <div className="b">{item.subTitle}</div>
                        <div>{item.storeTitle}</div>
                        <div>
                          {item.got && !item.isUsed && (
                            <span>{item.validDays > 0 ? item.validDays + '天后过期' : '已过期'}</span>
                          )}
                        </div>
                        <div className="btn1">{/* {showTip()} */}</div>
                      </div>
                    </div>
                    <div className="cd-footer">
                      <div className="flex">
                        <div className="flex-item">使用详情</div>
                        {/* <div>
                          <Icon type={'up'} style={{color: '#999'}} />
                        </div> */}
                      </div>
                    </div>
                    {item.got && (
                      <div className="cd-flag">{item.validDays > 0 ? item.validDays + '天后过期' : '已过期'}</div>
                    )}
                  </div>
                ))}
              </div>
              {/* </iframe> */}
            </div>
          </Col>
          &nbsp; &nbsp;
          <Col flex={6}>
            <div>
              <Form labelCol={{span: 3}} wrapperCol={{span: 14}} layout="horizontal" form={form} size="middle">
                <Form.Item label="活动名称" name="name" rules={[{required: true, message: '活动名称必填'}]}>
                  <Input
                    placeholder="请输入活动名称"
                    allowClear
                    onChange={e => {
                      setName(e)
                    }}
                  />
                </Form.Item>
                {/* <Form.Item label="" name="" style={{paddingLeft: '10px'}}> */}
                <p style={{marginLeft: '112px', marginTop: '-8px'}}>
                  用于后期发券数量统计，建议填写规范：门店/地区/第三方+活动主题，
                  <br />
                  例：华胜总部20年双十一活动发券
                </p>
                {/* </Form.Item> */}
                <Form.Item label="页面标题" name="title" rules={[{required: true, message: '页面标题必填'}]}>
                  <Input
                    placeholder="请输入页面标题"
                    allowClear
                    onChange={e => {
                      setTitle(e)
                    }}
                  />
                </Form.Item>
              </Form>
              <br />
              <div>
                <div className="item">
                  <p>选择卡券招牌 (大图片建议尺寸：640像素 * 400像素)</p>
                  <div className="flex">
                    <div style={{width: '100%'}}>
                      <UploadImg
                        className="id-img-upload"
                        disabled={isExit}
                        value={imageUrl}
                        onChange={(e: any) => changeImg(e)}></UploadImg>
                    </div>
                    {/* <div style={{width: '100%'}}>
                    <Button>删除</Button>
                  </div> */}
                  </div>
                </div>
              </div>

              <div className="item">
                <div style={{marginBottom: '10px'}}>
                  选择需要上架的卡券
                  <Button type="primary" onClick={showCardType}>
                    导入
                  </Button>
                </div>

                <Table
                  columns={columns}
                  rowKey={'cardId'}
                  dataSource={cardTypeDetailsDataList}
                  size="small"
                  bordered
                  pagination={false}
                  style={{height: '192px', overflow: 'auto'}}
                />

                {/* <Pagination
                size="small"
                total={cardTypeDetailsData?.total}
                onChange={onChangeCardTypeDetails}
                onShowSizeChange={onShowSizeChangeDetails}
                style={{marginTop: '15px', textAlign: 'right'}}
              /> */}
              </div>
            </div>
          </Col>
        </Row>
        <div className="btnBox">
          <Button type="primary" onClick={saveData} loading={loading}>
            确定
          </Button>
        </div>
      </Spin>
      <Modal title="选择卡券" visible={cardTypeVisible} onOk={saveSelectCard} onCancel={cardTypeCancel} width={650}>
        <Spin spinning={loading}>
          <Table
            rowSelection={rowSelection}
            columns={columnsType}
            rowKey={'cardId'}
            dataSource={cardTypeData?.items}
            size="small"
            bordered
            pagination={false}
            style={{height: '192px', overflow: 'auto'}}
          />

          <Pagination
            size="small"
            total={cardTypeData?.total}
            onChange={onChangeCardType}
            onShowSizeChange={onShowSizeChange}
            style={{marginTop: '15px', textAlign: 'right'}}
          />
        </Spin>
      </Modal>
    </div>
  )
}

export default CardDetails
