/** @format */

import React from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, DatePicker, Button, Table, Select} from 'antd'
import * as api from '@/api'
// import { SearchOutlined } from '@ant-design/icons'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {formatMobile} from '@/utils/common'
const groupTypeList = [
  {id: 2, name: '未使用'},
  {id: 1, name: '已使用'},
]
const consumeReCord = () => {
  const [form] = Form.useForm()
  const {RangePicker} = DatePicker
  const getTableData = (tableParams, params) =>
    api.getVipMemberList({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 10,
    form,
  })

  const {submit} = search || {}
  const onSearch = () => {
    submit()
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '订单号',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '250px',
    },
    {
      title: '商品名称',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '250px',
    },
    {
      title: '商品类型',
      dataIndex: 'customerIdStr',
      align: 'center',
      render: (val, row) => formatMobile(val),
      width: '250px',
    },
    {
      title: '商品编号',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '250px',
    },
    {
      title: '付款人',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '200px',
    },

    {
      title: '手机号',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '300px',
    },
    {
      title: '车牌号',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '300px',
    },
    {
      title: 'VIN',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '200px',
    },
    {
      title: '付款时间',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '200px',
    },
    {
      title: '付款方式',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '200px',
    },
    {
      title: '支付方式',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '200px',
    },
    {
      title: '付款金额',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '200px',
    },
    {
      title: '有效期',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '300px',
    },
    {
      title: '订单状态',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '300px',
    },
    {
      title: '服务门店',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '300px',
    },
    {
      title: '使用时间',
      dataIndex: 'customerIdStr',
      align: 'center',
      width: '300px',
    },
  ]
  return (
    <div className="consumeReCord">
      <ToolsBar>
        <Form layout="inline" form={form} style={{marginLeft: '12px'}}>
          <Form.Item name="memberCardNo">
            <Input placeholder="请输入订单号" allowClear className="inpW"></Input>
          </Form.Item>
          <Form.Item name="memberMobile">
            <Input placeholder="请输入商品名称" allowClear className="inpW"></Input>
          </Form.Item>
          <Form.Item name="type">
            <Select allowClear placeholder="订单状态" style={{width: 150}}>
              {groupTypeList.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <RangePicker
              style={{width: 260}}
              placeholder={['付款开始时间', '付款截止时间']}
              onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'activeTime', 'activeEndTime')}
            />
          </Form.Item>
          <Form.Item>
            {/* icon={<SearchOutlined />} */}
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>
      <div style={{backgroundColor: 'white', marginTop: '12px', overflowX: 'scroll'}}>
        <Table
          size="middle"
          columns={columns}
          {...tableProps}
          rowKey="memberCode"
          pagination={{
            showSizeChanger: true,
            total: tableProps.pagination.total,
            current: tableProps.pagination.current,
            showTotal: total => `共 ${total} 条`,
            pageSize: tableProps.pagination.pageSize,
          }}
        />
      </div>
    </div>
  )
}

export default consumeReCord
