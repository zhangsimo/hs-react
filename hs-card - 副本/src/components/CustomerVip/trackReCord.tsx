/** @format */

import React from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, DatePicker, Button, Table} from 'antd'
import * as api from '@/api'
// import { SearchOutlined } from '@ant-design/icons'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {formatMobile} from '@/utils/common'
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
      title: '跟进日期',
      dataIndex: 'activeTime',
      align: 'center',
    },
    {
      title: '客户姓名',
      dataIndex: 'customerIdStr',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'memberMobile',
      align: 'center',
      render: (val, row) => formatMobile(val),
    },
    {
      title: '车牌号',
      dataIndex: 'memberCardNo',
      align: 'center',
    },
    {
      title: '跟进人',
      dataIndex: 'memberName',
      align: 'center',
    },

    {
      title: '跟进方式',
      dataIndex: 'memberLevel',
      align: 'center',
    },
    {
      title: '沟通类型',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: '通话时长',
      dataIndex: 'compName',
      align: 'center',
    },
    {
      title: '跟进内容',
      dataIndex: 'employeeName',
      align: 'center',
      width: '300px',
    },
  ]
  return (
    <div className="consumeReCord">
      <ToolsBar>
        <Form layout="inline" form={form} style={{marginLeft: '12px'}}>
          <Form.Item>
            <RangePicker
              style={{width: 260}}
              placeholder={['跟进开始时间', '跟进截止时间']}
              onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'activeTime', 'activeEndTime')}
            />
          </Form.Item>
          <Form.Item name="memberCardNo">
            <Input placeholder="请输入跟进人" allowClear className="inpW"></Input>
          </Form.Item>
          <Form.Item name="memberMobile">
            <Input placeholder="请输入车牌号" allowClear className="inpW"></Input>
          </Form.Item>
          <Form.Item>
            {/* icon={<SearchOutlined />} */}
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>
      <div style={{backgroundColor: 'white', marginTop: '12px'}}>
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
