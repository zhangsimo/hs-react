/** @format */

import React, { useState, useEffect } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { Form, Input, Button, Table, Space, message } from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import { useHistory } from 'react-router-dom'
import useSearchParam from '@/hooks/useSearchParam'
import TagViewStore from '@/store/tag-view'
import './style.less'
const formatParams = (tableParams, params) => {
  return {
    ...tableParams, //可删除  留作参考
    ...params,
    pageNo: tableParams?.current,
    pageSize: tableParams?.pageSize,
    page: tableParams?.current,
  }
}

const Addcustomer = () => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const carId: any = useSearchParam('id')
  const { delView } = TagViewStore.useContainer()
  const getTableData = (tableParams, params) =>
    api.getCustomerQuerySimCustomers({ ...formatParams(tableParams, params) }).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  useEffect(() => {
    if (carId !== 'null' && carId)
      sessionStorage.setItem('carId', carId)
  }, [carId])
  const { submit } = search || {}
  const onSearch = () => {
    submit()
  }

  const selectValidate = () => {
    if (!selectedRows.length) {
      message.warning('请先选择客户')
      return false
    }
    let carIdNew = carId !== 'null' && carId ? carId : sessionStorage.getItem('carId')
    api.saveOrUpdateCustomerCar({ carId: carIdNew, customerId: selectedRowKeys[0], status: 1, type: 2 }).then(res => {
      if (res.code === 1) {
        message.success('保存成功！')
        closePage()
      } else {
        message.error('保存失败！')
      }
    })
    return
  }

  const closePage = () => {
    const carIdNew = carId !== 'null' && carId ? carId : sessionStorage.getItem('carId')
    delView({ pathname: "/carmanage/addcustomer", state: { title: '新绑定客户' } })
    history.push(`/carmanage/detail?carId=${carIdNew}`)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '客户ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
    },
  ]
  return (
    <div className="addcustomer block">
      <div className="block_title">
        <span>新绑定客户</span>
      </div>
      <ToolsBar>
        <Form layout="inline" form={form} style={{ marginLeft: '12px' }}>
          <Form.Item name="name">
            <Input placeholder="请输入客户姓名" allowClear style={{ width: 150 }}></Input>
          </Form.Item>
          <Form.Item name="mobile">
            <Input placeholder="请输入手机号" allowClear style={{ width: 150 }}></Input>
          </Form.Item>

          <Form.Item>
            <Space size="middle">
              <Button type="primary" onClick={onSearch}>
                查询
              </Button>
            </Space>
          </Form.Item>
          <div className='carbtnrg'>
            <Button type="primary" onClick={selectValidate}>保存</Button>
            <Button onClick={() => closePage()}>关闭</Button>
          </div>
        </Form>
      </ToolsBar>
      <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
        <Table
          rowSelection={{
            type: "radio",
            ...rowSelection,
          }}
          size="middle"
          columns={columns}
          {...tableProps}
          rowKey="id"
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

export default Addcustomer
