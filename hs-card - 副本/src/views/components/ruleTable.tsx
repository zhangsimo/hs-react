/** @format */
import React, { useState, useImperativeHandle } from 'react'
import { Button, Form, Input, message, Pagination, Spin, Table } from 'antd'
// import { useBoolean } from '@umijs/hooks'
import { SearchOutlined } from '@ant-design/icons'
import ToolsBar from '@/components/ToolsBar'
import { ColumnProps } from 'antd/lib/table'
import * as api from '@/api'
import { useEffect } from 'react'
import { formatRuleType } from '@/utils/common'

// import {ExclamationCircleOutlined} from '@ant-design/icons'
interface IProps {
  applyType?: any
  getRuleData: any
  cRef: any
}

let RuleTable: React.FC<IProps> = props => {
  // const [treeData, setTreeData] = useState<any>([])
  // const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [RuleList, setRuleList] = useState<any>([])
  const [selectedRowRule, setSelectedRowRule] = useState<any[]>([])
  const [selectedRowRuleKey, setSelectedRowRuleKey] = useState<any[]>([])
  const [formRule] = Form.useForm()

  useImperativeHandle(props.cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: () => {
      setSelectedRowRuleKey([])
      setSelectedRowRule([])
    },
  }))

  useEffect(() => {
    getShowRule({})
  }, [])

  const onSelectChangeRule = (
    selectedRowKeys: React.SetStateAction<any[]>,
    selectedRowValue: React.SetStateAction<any[]>,
  ) => {
    console.log(selectedRowKeys)
    console.log(selectedRowKeys)
    setSelectedRowRuleKey(selectedRowKeys)
    setSelectedRowRule(selectedRowValue)
    props.getRuleData(selectedRowValue)
  }

  const rowSelectionRule = {
    selectedRowRule,
    selectedRowKeys: selectedRowRuleKey,
    onChange: onSelectChangeRule,
  }

  const getShowRule = data => {
    console.log(props.applyType)
    let typeArr: any = []
    typeArr.push(props.applyType)
    typeArr.push(99)
    setLoading2(true)
    const params: any = {
      status: '1',
      applyTypes: typeArr,
      page: data.page || 1,
      pageSize: data.pageSize || 10,
      name: formRule.getFieldValue('name'),
    }

    if (data?.type === 'search') {
      // data?.type 是否通过查询框搜索
      delete params?.classifyC_id
      delete params?.classifyF_id
    }
    api
      .getAllRuleList(params)
      .then(res => {
        let data = res.data
        // setSelectedRowProjectKey([])
        // let arr: any = []
        setRuleList(data)

        setLoading2(false)
      })
      .catch(err => {
        console.log(err)
        message.error(err.msg)
        setLoading2(false)
      })
  }

  const onChangeRule = (page, pageSize) => {
    setSelectedRowRule([]) // 下一页 清空其他页的勾选
    setSelectedRowRuleKey([])
    // const curCard = getStore('curCard')
    let params = {
      page: page,
      total: RuleList.total,
      pageSize: pageSize,
    }
    getShowRule(params)
  }

  const onShowSizeChangeRule = (current, size) => {
    let params = {
      page: current,
      total: RuleList.total,
      pageSize: size,
    }
    getShowRule(params)
  }

  const columnsRule: ColumnProps<any>[] = [
    {
      title: '规则名称',
      dataIndex: 'name',
      align: 'left',
      width: 320,
      render: (valu, row) => (
        <div className="table-title">
          {row.rule.cardList && row.rule.cardList.length ? row.name + "—" + row.rule.cardList[0].subTitle : row.name}

          {/* {row.name + '—' + row.rule.cardList && row.rule.cardList.length > 0 ? row.rule.cardList[0].mainTitle : ''} */}
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 230,
      align: 'center',
      render: (a, row) => formatRuleType(row.type),
    },

    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   width: 150,
    //   align: 'center',
    //   // render: (value, row) => (
    //   //     <div className="price-detail">
    //   //         <p>成本价：{row.primeCostPrice}</p>
    //   //         <p>毛利率：{row.grossMargin}</p>
    //   //         <p>毛利额：{row.grossProfit}</p>
    //   //     </div>
    //   // ),
    // },
  ]

  // const columnsTotalRule: ColumnProps<any>[] = columnsRule.slice(0, -1)
  return (
    <div>
      <ToolsBar>
        <Form layout="inline" form={formRule}>
          <Form.Item name="name">
            <Input placeholder="输入规则名称搜索" allowClear style={{ width: 400, marginLeft: 20 }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                getShowRule({ type: 'search' })
              }}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>

      <Spin spinning={loading2}>
        <Table
          rowSelection={rowSelectionRule}
          columns={columnsRule}
          bordered
          // rowKey="productId"
          rowKey={record => record.id}
          dataSource={RuleList.items}
          size="small"
          pagination={false}
          style={{ height: '400px', overflow: 'auto', marginLeft: '10px' }}
        />

        <Pagination
          size="small"
          total={RuleList.total}
          // pageSize={RuleList.pageSize}
          onChange={onChangeRule}
          onShowSizeChange={onShowSizeChangeRule}
          style={{ marginTop: '15px', textAlign: 'right' }}
        />
      </Spin>
    </div>
  )
}

export default RuleTable
