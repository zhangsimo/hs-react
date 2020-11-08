/** @format */
import React, {useState, useImperativeHandle} from 'react'
import {Button, Form, Input, message, Pagination, Spin, Table} from 'antd'
// import { useBoolean } from '@umijs/hooks'
import {SearchOutlined} from '@ant-design/icons'
import ToolsBar from '@/components/ToolsBar'
import {ColumnProps} from 'antd/lib/table'
import * as api from '@/api'
import {useEffect} from 'react'
import {formatCardType} from '@/utils/common'

// import {ExclamationCircleOutlined} from '@ant-design/icons'
interface IProps {
  // setCompId: any
  getCardData: any
  cardType: any
  cRef: any
}

let CardTable: React.FC<IProps> = props => {
  // const [treeData, setTreeData] = useState<any>([])
  // const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [cardList, setCardList] = useState<any>([])
  const [selectedRowCard, setSelectedRowCard] = useState<any[]>([])
  const [selectedRowCardKey, setSelectedRowCardKey] = useState<any[]>([])
  const [form] = Form.useForm()

  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: () => {
      setSelectedRowCardKey([])
      setSelectedRowCard([])
    },
  }))

  useEffect(() => {
    getShowCard({})
  }, [])

  const onSelectChangeCard = (
    selectedRowKeys: React.SetStateAction<any[]>,
    selectedRowValue: React.SetStateAction<any[]>,
  ) => {
    console.log(selectedRowKeys)
    console.log(selectedRowKeys)
    setSelectedRowCardKey(selectedRowKeys)
    setSelectedRowCard(selectedRowValue)
    props.getCardData(selectedRowValue)
  }

  const rowSelectionCard = {
    selectedRowCard,
    selectedRowKeys: selectedRowCardKey,
    onChange: onSelectChangeCard,
  }

  const getShowCard = data => {
    console.log(data)
    setLoading2(true)
    // setVisibleCard(true)
    const params: any = {
      status: '1',
      cardType: props.cardType,
      page: data.page || 1,
      pageSize: data.pageSize || 10,
      subTitle: form.getFieldValue('subTitle'),
    }

    if (data?.type === 'search') {
      // data?.type 是否通过查询框搜索
      delete params?.classifyC_id
      delete params?.classifyF_id
    }
    api
      .getCardList(params)
      .then(res => {
        let data = res.data
        // setSelectedRowProjectKey([])
        // let arr: any = []
        setCardList(data)

        setLoading2(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading2(false)
      })
  }

  const onChangeCard = (page, pageSize) => {
    setSelectedRowCard([]) // 下一页 清空其他页的勾选
    setSelectedRowCardKey([])
    // const curCard = getStore('curCard')
    let params = {
      page: page,
      total: cardList.total,
      pageSize: pageSize,
    }
    getShowCard(params)
  }

  const onShowSizeChangeCard = (current, size) => {
    let params = {
      page: current,
      total: cardList.total,
      pageSize: size,
    }
    getShowCard(params)
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '卡券类型',
      dataIndex: 'cardType',
      width: 150,
      align: 'center',
      render: (a, row) => formatCardType(row.cardType),
    },

    {
      title: '卡券名称',
      dataIndex: 'subTitle',
      align: 'left',
      width: 320,
    },
    {
      title: '有效期',
      dataIndex: 'validDays',
      align: 'center',
      width: 320,
      render: (a, row) => {
        let time: any = ''
        if (row.validType == 1) {
          time = row.validDays
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
      width: 150,
      align: 'center',
      // render: (value, row) => (
      //     <div className="price-detail">
      //         <p>成本价：{row.primeCostPrice}</p>
      //         <p>毛利率：{row.grossMargin}</p>
      //         <p>毛利额：{row.grossProfit}</p>
      //     </div>
      // ),
    },
  ]

  return (
    <div>
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="subTitle">
            <Input placeholder="输入卡券名称搜索" allowClear style={{width: 400, marginLeft: 20}} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                getShowCard({type: 'search'})
              }}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>

      <Spin spinning={loading2}>
        <Table
          rowSelection={rowSelectionCard}
          columns={columns}
          bordered
          // rowKey="productId"
          rowKey={record => record.cardId}
          dataSource={cardList.items}
          size="small"
          pagination={false}
          style={{height: '400px', overflow: 'auto', marginLeft: '10px'}}
        />

        <Pagination
          size="small"
          total={cardList.total}
          // pageSize={CardList.pageSize}
          onChange={onChangeCard}
          onShowSizeChange={onShowSizeChangeCard}
          style={{marginTop: '15px', textAlign: 'right'}}
        />
      </Spin>
    </div>
  )
}

export default CardTable
