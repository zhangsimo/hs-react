/** @format */

import React, {useState} from 'react'
import ToolsBar from '@/components/ToolsBar'
import VipExitPop from './vipExitPop'
import {Form, Input, DatePicker, Button, Table} from 'antd'
import * as api from '@/api'
// import { SearchOutlined } from '@ant-design/icons'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {formatMobile} from '@/utils/common'
const consumeReCord = () => {
  const [form] = Form.useForm()
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
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
  const closeMenuVisible = e => {
    setMenuVisible(e)
  }
  const {submit} = search || {}
  const onSearch = () => {
    submit()
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '变动日期',
      dataIndex: 'activeTime',
      align: 'center',
    },
    {
      title: '会员姓名',
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
      title: 'VIN',
      dataIndex: 'memberName',
      align: 'center',
    },

    {
      title: '变动积分',
      dataIndex: 'memberLevel',
      align: 'center',
    },
    {
      title: '变动原因',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: '变动内容',
      dataIndex: 'employeeName',
      align: 'center',
      width: '300px',
    },
    {
      title: '门店',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: '剩余积分',
      dataIndex: 'point',
      align: 'center',
    },
  ]
  return (
    <div className="consumeReCord">
      <ToolsBar>
        <Form layout="inline" form={form} style={{marginLeft: '12px'}}>
          <Form.Item>
            <RangePicker
              style={{width: 260}}
              placeholder={['变动开始时间', '变动截止时间']}
              onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'activeTime', 'activeEndTime')}
            />
          </Form.Item>
          <Form.Item name="memberCardNo">
            <Input placeholder="门店" allowClear className="inpW"></Input>
          </Form.Item>
          <Form.Item>
            {/* icon={<SearchOutlined />} */}
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
            <Button type="primary" onClick={() => setMenuVisible(true)}>
              修改积分
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>
      <VipExitPop menuVisible={menuVisible} closeMenuVisible={closeMenuVisible}></VipExitPop>
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
