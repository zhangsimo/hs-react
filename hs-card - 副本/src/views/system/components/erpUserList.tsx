/** @format */

import React, {useState} from 'react'

import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'

import {Table, Button, Spin, Form, Input, message} from 'antd'
// import {FormInstance} from 'antd/lib/form'
import * as api from '@/api'
import './erpUserList.less'
// import {IselectProject} from '@/interface'
// import {projectFormat} from '../_common/index'
// import {getStore} from '@/utils/store'
// import {Pagination} from 'antd'
import './erpUserList.less'
import {SearchOutlined} from '@ant-design/icons'
// import {useAntdTable} from '@umijs/hooks'
import {ITableResult, IUser} from '@/interface'

interface IProps {
  setSelectErpUser: any //事件
  // compCode: any
  // selectErpUserList: any
  // selectErpUserKeys: any //回显
}

const PageErpUserList: React.FC<IProps> = props => {
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<string[]>([])
  const [selectedRowKey, setSelectedRowKey] = useState<any[]>([])

  const [form] = Form.useForm()

  const getTableData = (tableParams, params) =>
    api.getErpUserList({...api.formatParams(tableParams, params)}).then(res => {
      setSelectedRowKey([])
      setSelectedRow([])
      setLoading(false)
      return {
        list: res.data.items,
        total: res.data.total,
      }
    })

  const {tableProps, search} = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
    defaultPageSize: 8,
    form,
  })

  // useEffect(() => {
  //   if (props.compCode) {
  //     form.setFieldsValue({compCode: props.compCode})
  //     submit()
  //   }
  // }, [props.compCode])
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys)
    console.log(selectedRows)
    setSelectedRowKey(selectedRowKeys)
    setSelectedRow(selectedRows)
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    onChange: onSelectChange,
  }

  const handleOk = () => {
    console.log(selectedRow)
    if (selectedRow.length > 8) {
      message.error('不能超过8个用户')
      return
    } else {
      props.setSelectErpUser(selectedRow)
    }
  }

  const {submit} = search || {}

  const columns: ColumnProps<any>[] = [
    {
      title: '用户名称',
      dataIndex: 'memberName',
      align: 'center',
      width: 250,
    },
    {
      title: '用户账号',
      dataIndex: 'loginName',
      width: 250,
      align: 'center',
    },
  ]

  return (
    <div>
      <Spin spinning={loading}>
        <div className="block_content">
          <Form form={form} layout="inline">
            <Form.Item name="loginName">
              <Input placeholder="请输入登录名称" style={{width: '150px'}} allowClear></Input>
            </Form.Item>

            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={submit}>
                搜索
              </Button>
            </Form.Item>
          </Form>
          <div>
            <div style={{backgroundColor: 'white', marginTop: '12px', overflow: 'auto'}}>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                rowKey="memberId"
                {...tableProps}
                bordered
                size="small"
                pagination={{
                  total: tableProps.pagination.total,
                  showTotal: total => `共 ${total} 条`,
                  pageSize: tableProps.pagination.pageSize,
                  showSizeChanger: false,
                }}
              />
            </div>
            <div style={{textAlign: 'center'}}>
              &nbsp;&nbsp;
              <Button htmlType="submit" type="primary" onClick={handleOk}>
                确定
              </Button>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default PageErpUserList
