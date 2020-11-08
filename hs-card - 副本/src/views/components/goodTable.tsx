/** @format */
import React, { useState, useImperativeHandle } from 'react'
import { Button, Col, Form, Input, message, Row, Spin, Table, Tree } from 'antd'
import { useBoolean, useRequest } from '@umijs/hooks'
import { SearchOutlined } from '@ant-design/icons'
import ToolsBar from '@/components/ToolsBar'
import { getTreeDataFormat } from '@/utils/common'
import { ColumnProps } from 'antd/lib/table'

import * as api from '@/api'
import { useEffect } from 'react'
// import {ExclamationCircleOutlined} from '@ant-design/icons'
interface IProps {
  // setCompId: any
  getGoodsData: any
  shopCodes?: any
  type?: any
  cRef: any
}
const { TreeNode } = Tree
// let GoodTable = (props, ref) => {

let GoodTable: React.FC<IProps> = props => {
  // const [treeData, setTreeData] = useState<any>([])
  // const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [goodList, setGoodList] = useState<any>([])
  const [selectedRowGood, setSelectedRowGood] = useState<any[]>([])
  const [selectedRowGoodKey, setSelectedRowGoodKey] = useState<any[]>([])
  const [currTreeType, setCurrTreeType] = useState('')
  const [selectionType, setSelectionType] = useState<any>('checkbox')
  const isFid = useBoolean(false)
  const [formGood] = Form.useForm()

  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: () => {
      setSelectedRowGoodKey([])
      setSelectedRowGood([])
    },
  }))

  useEffect(() => {
    formGood.setFieldsValue({
      keywords: null,
    })
    getShowGood({})
  }, [currTreeType])

  useEffect(() => {
    setSelectionType(props.type)
    getShowGood({})
  }, [])

  const { data: treeDataGood } = useRequest(() =>
    api
      .getShopCategoryListNested({
        page: 1,
        pageSize: 2000,
      })
      .then(res =>
        getTreeDataFormat(res.data.items, {
          value: 'key', // 新字段
          oldValue: 'id', //老字段
          field: 'title',
          oldField: 'cateName',
          parentField: 'children', //必要
          oldParentField: 'childs', //必要
          // isShowAll: true,
        }),
      ),
  )

  const onSelectChangeGood = (
    selectedRowKeys: React.SetStateAction<any[]>,
    selectedRowValue: React.SetStateAction<any[]>,
  ) => {
    setSelectedRowGoodKey(selectedRowKeys)
    setSelectedRowGood(selectedRowValue)
    props.getGoodsData(selectedRowValue)
  }

  const rowSelectionGood = {
    selectedRowGood,
    type: selectionType,
    selectedRowKeys: selectedRowGoodKey,
    onChange: onSelectChangeGood,
  }

  const getShowGood = data => {
    console.log(data)
    console.log(props.shopCodes)
    const compCode = sessionStorage.getItem('compCode')
    let shopCodes: any = []

    if (!props.shopCodes || props.shopCodes.length < 0) {
      shopCodes.push(compCode)
    } else {
      shopCodes = props.shopCodes
    }

    setLoading2(true)
    // setVisibleGood(true)
    const params: any = {
      shopCodes: shopCodes,
      status: '2',
      page: data.page || 1,
      pageSize: data.pageSize || 10,
      goodsName: formGood.getFieldValue('goodsName'),
      categoryId: isFid.state ? '' : currTreeType,

    }

    if (data?.type === 'search') {
      // data?.type 是否通过查询框搜索
      delete params?.classifyC_id
      delete params?.classifyF_id
    }
    api
      .getMarketGoodsList(params)
      .then(res => {
        let data = res.data
        // setSelectedRowProjectKey([])
        // let arr: any = []
        setGoodList(data)

        setLoading2(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading2(false)
      })
  }

  // const onGoodSearch = () => {}
  const treeTypeClick = (selectedKeys, e) => {
    setCurrTreeType(e.node.id)
    if (e.node.pid === '0') {
      isFid.setTrue()
    } else {
      isFid.setFalse()
    }
  }
  const eventShowAllGoodS = e => {
    setCurrTreeType('')
    isFid.setTrue()
  }

  // const onChangeGood = (page, pageSize) => {
  //   setSelectedRowGood([]) // 下一页 清空其他页的勾选
  //   setSelectedRowGoodKey([])
  //   // const curCard = getStore('curCard')
  //   let params = {
  //     page: page,
  //     total: goodList.total,
  //     pageSize: pageSize,
  //   }
  //   getShowGood(params)
  // }

  // const onShowSizeChangeGood = (current, size) => {
  //   let params = {
  //     page: current,
  //     total: goodList.total,
  //     pageSize: size,
  //   }
  //   getShowGood(params)
  // }

  //单个删除项目 商品
  const deleteDataGood = row => {
    console.log(row)
    let params = {
      itemCode: Number(row.productId),
    }
    api
      .delCardItem(params)
      .then(res => {
        message.success('删除成功')
      })
      .catch(err => {
        message.error(err.msg)
      })
  }

  const columnsGood: ColumnProps<any>[] = [
    {
      title: '图片',
      dataIndex: 'goodsImgUrl',
      width: 150,
      align: 'center',
      render: (valu, row) => (
        <div className="table-title">
          <img src={row.goodsImgUrl} alt={row.goodsName} style={{ width: '80px' }} />
        </div>
      ),
    },
    {
      title: '商品',
      dataIndex: 'goodsName',
      align: 'left',
      width: 320,
    },
    {
      title: '所属分类',
      dataIndex: 'classify',
      width: 230,
      align: 'center',
    },
    {
      title: '售价',
      dataIndex: 'salePrice',
      width: 150,
      align: 'center',
      render: (value, row) => (
        <div className="price-detail">
          <p>￥{row.salePrice}</p>
        </div>
      ),
    },

    {
      title: '库存',
      dataIndex: 'goodsStock',
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
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 130,
      render: (a, row) => {
        return (
          <div>
            <Button type="link" onClick={() => deleteDataGood(row)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.shopNo ? <span>{'NO.' + item.shopNo + item.shortName}</span> : <span>{item.shortName}</span>}
            key={item.compCode}
            style={{ position: 'relative' }}
            active>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.compCode}
          title={item.shopNo ? <span>{'NO.' + item.shopNo + item.shortName}</span> : <span>{item.shortName}</span>}
          style={{ position: 'relative' }}
          active
        />
      )
    })
  const columnsTotalGood: ColumnProps<any>[] = columnsGood.slice(0, -1)
  return (
    <Row id="goodSelectModal">
      <Col span={5} className="left-style">
        <Button type="link" size="small" style={{ marginLeft: '20px' }} onClick={eventShowAllGoodS}>
          全部
        </Button>
        <Tree treeData={treeDataGood} height={520} selectedKeys={[currTreeType]} onSelect={treeTypeClick} />
      </Col>
      <Col span={19} style={{ padding: '0px 0px 20px 0px ' }}>
        <ToolsBar>
          <Form layout="inline" form={formGood}>
            <Form.Item name="goodsName">
              <Input placeholder="输入商品名称搜索" allowClear style={{ width: 400, marginLeft: 20 }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setCurrTreeType('')
                  getShowGood({ type: 'search' })
                }}>
                搜索
              </Button>
            </Form.Item>
          </Form>
        </ToolsBar>

        <Spin spinning={loading2}>
          <Table
            rowSelection={rowSelectionGood}
            columns={columnsTotalGood}
            bordered
            // rowKey="productId"
            rowKey={record => record.goodsId}
            dataSource={goodList}
            size="small"
            // pagination={false}
            pagination={{
              total: goodList.length,
              showTotal: total => `共 ${total} 条`,
              pageSize: 8,
              showSizeChanger: false,

            }}
            style={{ height: '450px', overflow: 'auto', marginLeft: '10px' }}
          />

          {/* <Pagination
            size="small"
            total={goodList.total}
            // pageSize={goodList.pageSize}
            onChange={onChangeGood}
            onShowSizeChange={onShowSizeChangeGood}
            style={{ marginTop: '15px', textAlign: 'right' }}
          /> */}
        </Spin>
      </Col>
    </Row>
  )
}

export default GoodTable
