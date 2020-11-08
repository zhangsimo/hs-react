/** @format */
import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { Button, Checkbox, Form, message, Modal, Select, Spin, Table } from 'antd'
// import { useBoolean } from '@umijs/hooks'
import * as api from '@/api'
// import { useForm } from 'antd/lib/form/Form'
// import { useEffect } from 'react'
// import { formatRuleType, formatApplyType } from '@/utils/common'
import ToolsBar from '@/components/ToolsBar'
import { uniqueArr } from '@/utils/common'
import CardTable from './cardTable'
import { formatCardType } from '@/utils/common'

interface IProps {
  cRef: any
  ruleId: any
  closeModal: () => void
}

const BuyOrGive: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRow, setSelectedRow] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [dataList, setdataList] = useState<any>([])
  const [curId, setCurId] = useState<any>()
  const [useType, setUseType] = useState<any>()
  const [cardType, setCardType] = useState<any>()

  const childRef = useRef()

  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法,初始化
    changeVal: () => {
      console.log('==============')
      setdataList([])
      form.resetFields()
    },
  }))
  // const history = useHistory()
  const updateChildState = () => {
    // changeVal就是子组件暴露给父组件的方法
    ; (childRef?.current as any)?.changeVal()
  }

  useEffect(() => {
    if (props.ruleId) {
      let params = {
        id: props.ruleId,
      }
      setLoading(true)
      api
        .getMarketRuleDetails(params)
        .then((res: any) => {
          if (res.code === 1) {
            let data = res.data
            setCurId(data.id)
            form.setFieldsValue({ useType: data.rule.useType })
            setdataList(data.rule?.cardList)
          } else {
            message.error(res.msg)
          }
          setLoading(false)
        })
        .catch(err => {
          message.error(err.msg)
          setLoading(false)
        })
    }
  }, [props.ruleId])

  const saveData = () => {
    let useType = form.getFieldValue('useType')
    if (useType == 3 && dataList.length == 0) {
      message.error("卡券不能为空")
      return
    }
    let params = {
      id: curId || '',
      type: 'UseCardRule',
      applyType: '99',
      rule: {
        useType: form.getFieldValue('useType'),
        type: 'UseCardRule',
        cardList: dataList,
      },
    }
    setLoading(true)
    api
      .saveMarketRule(params)
      .then((res: any) => {
        if (res.code === 1) {
          message.success('保存成功')
        } else {
          message.error(res.msg)
        }
        props.closeModal()
        setLoading(false)
      })
      .catch(err => {
        message.error(err.msg)
        setLoading(false)
      })
  }

  const cancel = () => {
    props.closeModal()
  }
  const getCardData = data => {
    console.log(data)
    setSelectedRow(data)
  }

  const delData = index => {
    console.log(index)
    dataList.splice(index, 1)
    setdataList([...dataList])
  }

  const showAddRule = () => {
    if (!cardType) {
      message.error('请至少选择一个券类型')
      return
    }
    updateChildState()
    setVisible(true)
  }

  const handleOkGood = () => {
    let arr = uniqueArr(dataList, selectedRow, 'cardId')
    console.log(arr)
    setdataList(arr)
    setVisible(false)
  }

  const onChangeSelect = e => {
    console.log(e)
    setUseType(e)
    if (e === 2) {
      //全部不可用
      setdataList([])
    }
  }
  const onChangeCardType = e => {
    setCardType(e)
  }

  const columns: any = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (val, row, index) => `${index + 1}`,
    },
    {
      title: '卡券名称',
      dataIndex: 'subTitle',
      align: 'left',
      width: 200,
      ellipsis: true,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" style={{ padding: '0' }}>
              {row.subTitle?.length < 15 ? row.subTitle : row.subTitle.substr(0, 15) + '...'}
            </Button>
          </div>
        )
      },
    },

    {
      title: '卡券类型',
      dataIndex: 'classify',
      align: 'center',
      width: 100,
      render: (a, row) => formatCardType(row.cardType),
    },
    {
      title: '有效期',
      dataIndex: 'originalPrice',
      align: 'center',
      width: 250,
      render: (a, row) => {
        let time: any = ''
        if (row.validType == 2) {
          time = row.validDays + '天'
        } else {
          if (row.validStart && !row.validEnd) {
            time = row.validStart + ' 至 ' + '--'
          } else if (!row.validStart && row.validEnd) {
            time = '--' + ' 至 ' + row.validEnd
          } else if (!row.validStart && !row.validEnd) {
            time = '--' + ' 至 ' + '--'
          } else {
            time = row.validStart + ' 至 ' + row.validEnd
          }
        }

        return time
      },
    },

    {
      title: '库存',
      dataIndex: 'remainNum',
      align: 'center',
      width: 80,
    },

    {
      title: '操作',
      align: 'center',

      width: 80,
      render: (val, row, index) => {
        return (
          <div>
            <Button type="link" onClick={() => delData(index)} style={{ color: '#FB721F' }}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <Spin spinning={loading}>
        <ToolsBar visible={false}>
          <Form layout="inline" form={form} initialValues={{ useType: 1 }} style={{ marginTop: '10px', width: '100%' }}>
            <Form.Item name="useType" label="使用类型" rules={[{ required: true }]}>
              <Select style={{ width: 200 }} placeholder="选择使用类型" onChange={onChangeSelect}>
                <Select.Option value={1}> 全部券可用</Select.Option>
                <Select.Option value={2}> 全部券不可用</Select.Option>
                <Select.Option value={3}> 部分券可用</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item rules={[{ required: true }]}>
              <Checkbox.Group onChange={onChangeCardType} style={{ width: '100%' }}>
                <Checkbox value={1} disabled={useType == 3 ? false : true}>
                  满减券
                </Checkbox>
                <Checkbox value={2} disabled={useType == 3 ? false : true}>
                  抵扣券
                </Checkbox>
                <Checkbox value={3} disabled={useType == 3 ? false : true}>
                  折扣券
                </Checkbox>
                <Checkbox value={4} disabled={useType == 3 ? false : true}>
                  兑换券
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item name="" label="" rules={[{ required: true }]}>
              <Button type="primary" onClick={e => showAddRule()} disabled={useType == 3 ? false : true}>
                选择可用优惠券
              </Button>
            </Form.Item>
          </Form>
        </ToolsBar>
        <Table
          columns={columns}
          size="small"
          rowKey="cardId"
          bordered
          dataSource={dataList}
          pagination={{
            total: dataList.length,
            showTotal: total => `共 ${total} 条`,
            pageSize: 8,
            showSizeChanger: false,
          }}
        />

        <div className="ruleBlock">
          <div style={{ textAlign: 'center' }}>
            <Button htmlType="submit" onClick={cancel}>
              取消
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button htmlType="submit" type="primary" onClick={saveData}>
              保存
            </Button>
          </div>
        </div>
        {visible ? <Modal
          title="选择卡券"
          centered
          visible={visible}
          onOk={handleOkGood}
          destroyOnClose={true}
          width={830}
          onCancel={() => setVisible(false)}
          bodyStyle={{ padding: '0px 20px' }}>
          <CardTable getCardData={getCardData} cRef={childRef} cardType={cardType}></CardTable>
        </Modal> : null}

      </Spin>
    </div>
  )
}

export default BuyOrGive
