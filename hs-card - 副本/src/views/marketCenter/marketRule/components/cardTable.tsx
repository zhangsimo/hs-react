/** @format */
import React, {useState, useImperativeHandle} from 'react'
import {message, Pagination, Spin, Table} from 'antd'
// import { useBoolean } from '@umijs/hooks'
import {ColumnProps} from 'antd/lib/table'
import * as api from '@/api'
import {useRequest} from '@umijs/hooks'
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

  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: () => {
      setSelectedRowCardKey([])
      setSelectedRowCard([])
    },
  }))

  useRequest(() => {
    console.log(5589)
    getShowCard({})
  })

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
    setLoading2(true)
    // setVisibleCard(true)
    let cardType: any = props.cardType || []

    const params: any = {
      cardTypes: cardType.join(',') || null,
      page: data.page || 1,
      pageSize: data.pageSize || 10,
    }
    api
      .getRuleSelectUseCard(params)
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
      dataIndex: 'cardNum',
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
