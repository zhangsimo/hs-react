/** @format */

import React from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, DatePicker, Button, Table, message} from 'antd'
import {checkMobile} from '@/interface/customer'
import * as api from '@/api'
import {SearchOutlined} from '@ant-design/icons'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {formatMobile} from '@/utils/common'
import {useHistory} from 'react-router-dom'
import hasPermi from '@/components/directive'

const PageDataVipmember = () => {
  const [form] = Form.useForm()
  const {RangePicker} = DatePicker
  const history = useHistory()
  const getTableData = (tableParams, params) =>
    api.getVipMemberList({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  const {submit} = search || {}
  const onSearch = () => {
    form.validateFields().then(res => {
      let params = (form.getFieldValue as any)()
      if (params.memberMobile && !checkMobile(params.memberMobile)) {
        message.error('请输入正确手机号码')
        return
      }
      submit()
    })
  }
  const goDetails = row => {
    const turl = `/vipmember/detail?id=${row.customerIdStr}&memberId=${row.memberIdStr}`
    history.push(turl)
  }
  const columns: ColumnProps<any>[] = [
    // {
    //   title: '序号',
    //   align: 'center',
    //   render: (text, record, index) => `${index + 1}`,
    // },
    {
      title: '会员卡号',
      dataIndex: 'memberCardNo',
      align: 'center',
    },
    {
      title: '客户ID',
      dataIndex: 'customerIdStr',
      align: 'center',
    },
    {
      title: '注册会员日期',
      dataIndex: 'activeTime',
      align: 'center',
    },
    {
      title: '会员姓名',
      dataIndex: 'memberName',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'memberMobile',
      align: 'center',
      render: (val, row) => formatMobile(val),
    },
    {
      title: '会员等级',
      dataIndex: 'memberLevel',
      align: 'center',
    },
    {
      title: '积分',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: '归属门店',
      dataIndex: 'compName',
      align: 'center',
    },
    {
      title: '归属员工',
      dataIndex: 'employeeName',
      align: 'center',
    },
    {
      title: '服务小组',
      dataIndex: 'employeeGroupName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (value, row) => {
        return (
          <Button type="link" onClick={() => goDetails(row)}>
            查看详情
          </Button>
        )
      },
    },
  ]
  return (
    <>
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="memberCardNo">
            <Input placeholder="请输入会员卡号" allowClear></Input>
          </Form.Item>
          <Form.Item name="memberMobile">
            <Input placeholder="请输入手机号" allowClear></Input>
          </Form.Item>
          <Form.Item name="customerId">
            <Input placeholder="请输入客户ID" allowClear></Input>
          </Form.Item>
          <Form.Item>
            <RangePicker
              style={{width: 260}}
              placeholder={['注册开始时间', '注册截止时间']}
              onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'activeTime', 'activeEndTime')}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onSearch}
              disabled={hasPermi('vipMember:list:search')}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>
      <div style={{backgroundColor: 'white', marginTop: '12px'}}>
        <Table
          bordered
          size="middle"
          columns={columns}
          {...tableProps}
          rowKey="memberIdStr"
          pagination={{
            showSizeChanger: true,
            total: tableProps.pagination.total,
            current: tableProps.pagination.current,
            showTotal: total => `共 ${total} 条`,
            pageSize: tableProps.pagination.pageSize,
          }}
        />
      </div>
    </>
  )
}

export default PageDataVipmember
