/** @format */
import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { Button, Form, InputNumber, message, Modal, Radio, Spin, Table } from 'antd'
// import { useBoolean } from '@umijs/hooks'
import * as api from '@/api'
// import { useForm } from 'antd/lib/form/Form'
// import { useEffect } from 'react'
// import { formatRuleType, formatApplyType } from '@/utils/common'
import ToolsBar from '@/components/ToolsBar'
import { uniqueArr } from '@/utils/common'
import GoodTable from '../../../components/goodTable'

interface IProps {
  cRef: any
  ruleId: any
  closeModal: () => void
}

const BuyOrGive: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [isGive, setIsGive] = useState<number>(1)
  const [selectedRowGood, setSelectedRowGood] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [visibleGood, setVisibleGood] = useState<boolean>(false)
  const [dataList, setdataList] = useState<any>([])
  const [curId, setCurId] = useState<any>()

  const childRef = useRef()

  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法,初始化
    changeVal: () => {
      console.log('==============')
      setdataList([])
      setIsGive(1)
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
            form.setFieldsValue({ buyAmount: data.rule.buyAmount })
            form.setFieldsValue({ giveAmount: data.rule.giveAmount })
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
    let params = {
      id: curId || '',
      type: 'BuyGiveRule',
      applyType: '6',
      rule: {
        buyAmount: form.getFieldValue('buyAmount'),
        giveAmount: form.getFieldValue('giveAmount'),
        giveType: isGive,
        goodsList: dataList,
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
  const getGoodsData = data => {
    setSelectedRowGood(data)
  }

  const delData = index => {
    console.log(index)
    dataList.splice(index, 1)
    setdataList([...dataList])
  }

  const changeIsGive = e => {
    console.log(e)
    setIsGive(e.target.value)
  }

  const showAddGoods = () => {
    updateChildState()
    setVisibleGood(true)
  }

  const handleOkGood = () => {
    let arr = uniqueArr(dataList, selectedRowGood, 'goodsId')
    console.log(arr)
    setdataList(arr)
    setVisibleGood(false)
  }

  const columns: any = [
    {
      title: '序号',
      // dataIndex: 'name',
      width: 50,
      render: (val, row, index) => `${index + 1}`,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'left',
      width: 200,
      ellipsis: true,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" style={{ padding: '0' }}>
              {row.goodsName.length < 15 ? row.goodsName : row.goodsName.substr(0, 15) + '...'}
            </Button>
          </div>
        )
      },
    },

    {
      title: '类目',
      dataIndex: 'classify',
      align: 'center',
      width: 120,
    },
    {
      title: '原价',
      dataIndex: 'originalPrice',
      align: 'center',
      width: 80,
      render: (a, row) => {
        return <div>￥{row.originalPrice}</div>
      },
    },
    {
      title: '售价',
      dataIndex: 'salePrice',
      align: 'center',
      width: 80,
      render: (a, row) => {
        return <div>￥{row.salePrice}</div>
      },
    },
    {
      title: '库存',
      dataIndex: 'goodsStock',
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
          <Form layout="inline" form={form} initialValues={{ giveType: 1 }} style={{ marginTop: '10px', width: '100%' }}>
            <Form.Item name="buyAmount" label="买" rules={[{ required: true }]} style={{ width: '22%' }}>
              <InputNumber placeholder="购买数量" step={1} min={0} />
            </Form.Item>
            <Form.Item name="giveAmount" label="送" rules={[{ required: true }]} style={{ width: '22%' }}>
              <InputNumber placeholder="赠送数量" step={1} min={0} />
            </Form.Item>

            <Form.Item name="giveType" label="赠品" rules={[{ required: true }]}>
              <Radio.Group onChange={changeIsGive}>
                <Radio value={1}>同购买商品</Radio>
                <Radio value={2}>非购买商品</Radio>
                {isGive === 2 ? (
                  <Button type="primary" ghost onClick={e => showAddGoods()}>
                    选择商品
                  </Button>
                ) : null}
              </Radio.Group>
            </Form.Item>
          </Form>
        </ToolsBar>
        <Table
          columns={columns}
          size="middle"
          rowKey="goodsId"
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

        <Modal
          title="选择商品"
          centered
          visible={visibleGood}
          onOk={handleOkGood}
          width={1100}
          onCancel={() => setVisibleGood(false)}
          bodyStyle={{ padding: '0px 20px 0px 0px ' }}>
          <GoodTable getGoodsData={getGoodsData} cRef={childRef} type='radio'></GoodTable>
        </Modal>
      </Spin>
    </div>
  )
}

export default BuyOrGive
