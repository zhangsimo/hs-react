/** @format */

import React from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Table, Form} from 'antd'
import * as api from '@/api'
// import { SearchOutlined } from '@ant-design/icons'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {formatMobile} from '@/utils/common'
const consumeReCord = () => {
  const [form] = Form.useForm()
  const getTableData = (tableParams, params) =>
    api.getVipMemberList({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const {tableProps} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 10,
    form,
  })

  const columns: ColumnProps<any>[] = [
    {
      title: '操作人工号',
      dataIndex: 'activeTime',
      align: 'center',
    },
    {
      title: '操作人姓名',
      dataIndex: 'customerIdStr',
      align: 'center',
    },
    {
      title: '操作人时间',
      dataIndex: 'memberMobile',
      align: 'center',
      render: (val, row) => formatMobile(val),
    },
    {
      title: '操作人事件',
      dataIndex: 'memberCardNo',
      align: 'center',
    },
  ]
  return (
    <div className="consumeReCord">
      <ToolsBar></ToolsBar>
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
