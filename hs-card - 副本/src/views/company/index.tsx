/**
 * /* eslint-disable prettier/prettier
 *
 * @format
 */

/** @format */

import React from 'react'
// import {useRouteMatch} from 'react-router-dom'
import { Table, Button, Form, Input, Select, message, Tag } from 'antd'
import { useHistory } from 'react-router-dom'
import useAntdTable from '@/hooks/useAntdTable'
import './index.less'
// import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import { IUser, ITableResult } from '@/interface'
import { SearchOutlined } from '@ant-design/icons'
// import {useBoolean} from '@umijs/hooks'
const Company = () => {
  const [form] = Form.useForm()
  const history = useHistory()



  const getTableData = (tableParams, params) =>
    api.getCompanyList({ ...api.formatParams(tableParams, params) }).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
    defaultPageSize: 20,
    form,
  })


  const { submit } = search || {}


  const updateStatus = data => {
    let params = {
      compCode: data.compCode,
      companyOnlineStatus: data.companyOnlineStatus == 0 ? 1 : 0
    }
    api.updateStatus(params).then((res: any) => {
      if (res.code == 1) {
        message.success(data.companyOnlineStatus == 0 ? '启用成功' : '禁用成功')
        submit()

      } else {
        message.error(res.msg)
      }
    }).catch(err => {
      message.error(err.msg)

    })
  }

  const viewDetails = data => {
    const turl = `/company/details?compCode=${data.compCode}`
    history.push(turl)
  }


  const columns: any = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (val, row, index) => `${index + 1}`,
    },
    {
      title: '门店名称',
      dataIndex: 'compName',
      align: 'center',
    },

    {
      title: '联系电话',
      dataIndex: 'linkPhone',
      align: 'left',
    },
    {
      title: '门店地址',
      dataIndex: 'shopAddress',
      align: 'left',
    },
    {
      title: '店铺状态',
      dataIndex: 'companyOnlineStatus',
      align: 'center',
      render: (e: any) => {
        return e == 0 ? <Tag color="red">禁用</Tag> : <Tag color="green">启用</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
      align: 'center',
      render: (row) => (
        <div>
          {row.companyOnlineStatus === 0 ? (<Button onClick={() => updateStatus(row)} type="link" >启用</Button>) : null}
          {row.companyOnlineStatus === 1 ? (<Button onClick={() => updateStatus(row)} type="link" style={{ color: 'red' }}>停用</Button>) : null}

          <Button onClick={() => viewDetails(row)} type="link">
            详情
          </Button>

        </div>
      ),
    },
  ]

  return (
    <div>
      <ToolsBar visible={false}>
        <Form form={form} layout="inline">
          <Form.Item name="compName">
            <Input placeholder="请输入门店名称" style={{ width: '150px' }} allowClear></Input>
          </Form.Item>
          <Form.Item name="companyOnlineStatus">
            <Select placeholder="店铺状态" style={{ width: '150px' }} allowClear>
              <Select.Option value={1}>开启</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={submit}>
              搜索
            </Button>
          </Form.Item>
        </Form>

      </ToolsBar>

      <Table
        columns={columns}
        rowKey="compCode"
        {...tableProps}
        bordered
        pagination={{
          total: tableProps.pagination.total,
          showTotal: total => `共 ${total} 条`,
          pageSize: tableProps.pagination.pageSize,
          showSizeChanger: true,
        }}
      />

    </div>
  )
}

export default Company
