/** @format */

import React from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {formatMobile} from '@/utils/common'
import {useHistory} from 'react-router-dom'
import {SearchOutlined} from '@ant-design/icons'
import hasPermi from '@/components/directive'
const Carmanage = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const getTableData = (tableParams, params) =>
    api.getCatSelectPageCar({...api.formatParams(tableParams, params)}).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  const {submit} = search || {}
  const onSearch = () => {
    submit()
  }
  const onDetail = row => {
    const turl = `/carmanage/detail?carId=${row.id}&&vin=${row.vin}`
    history.push(turl)
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '车辆ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      align: 'center',
    },
    {
      title: 'VIN',
      dataIndex: 'vin',
      align: 'center',
    },
    {
      title: '车型',
      dataIndex: 'carModel',
      align: 'center',
    },
    {
      title: '绑定客户',
      dataIndex: 'customers',
      align: 'center',
      render: (val, row) => formatMobile(val),
    },
    // {
    //   title: '交强险购买日期',
    //   dataIndex: 'memberLevel',
    //   align: 'center',
    // },
    // {
    //   title: '商业险购买日期',
    //   dataIndex: 'point',
    //   align: 'center',
    // },
    // {
    //   title: '商业险到期日期',
    //   dataIndex: 'compName',
    //   align: 'center',
    // },
    {
      title: '操作',
      align: 'center',
      render: (value, row) => {
        return (
          <Button type="link" onClick={() => onDetail(row)} disabled={hasPermi('carManage:list:view')}>
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
          <Form.Item name="carId">
            <Input placeholder="请输入车辆ID" allowClear style={{width: '180px'}}></Input>
          </Form.Item>
          <Form.Item name="carNo">
            <Input placeholder="请输入车牌号" allowClear style={{width: '180px'}}></Input>
          </Form.Item>
          <Form.Item name="vin">
            <Input placeholder="请输入VIN" allowClear style={{width: '180px'}}></Input>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onSearch}
              disabled={hasPermi('carManage:list:search')}>
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={() => history.push(`/carmanage/add`)}
              disabled={hasPermi('carManage:list:creat')}>
              创建车辆档案
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
    </>
  )
}

export default Carmanage
