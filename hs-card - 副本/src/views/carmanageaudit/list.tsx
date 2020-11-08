/** @format */

import React from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table, DatePicker, Select} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {useHistory} from 'react-router-dom'
import {SearchOutlined} from '@ant-design/icons'
import hasPermi from '@/components/directive'
const groupTypeList = [
  {id: 0, name: '待审核'},
  {id: 1, name: '已审核'},
  {id: 2, name: '审核不通过'},
]
const Carmanage = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const {RangePicker} = DatePicker
  const getTableData = (tableParams, params) =>
    api.getCatBackendSelectPageCar({...api.formatParams(tableParams, params)}).then(res => ({
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
    const turl = `/carmanageaudit/detail?carId=${row.id}&&vin=${row.vin}`
    history.push(turl)
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '车型',
      dataIndex: 'carModel',
      align: 'center',
    },
    {
      title: 'VIN',
      dataIndex: 'vin',
      align: 'center',
    },
    {
      title: '原车牌号',
      dataIndex: 'orgCarNo',
      align: 'center',
    },
    {
      title: '替换车牌号',
      dataIndex: 'carNo',
      align: 'center',
    },
    {
      title: '提交人',
      dataIndex: 'commitBy',
      align: 'center',
    },
    {
      title: '门店',
      dataIndex: 'shopName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (a, row) => {
        switch (row.status) {
          case 0:
            return '待审核'
            break
          case 1:
            return '审核通过'
          default:
            return '审核不通过'
        }
        // if (row.status === 0) {
        //   return '待审核'
        // } else if (row.status === 1) {
        //   return '审核通过'
        // } else {
        //   return '审核不通过'
        // }
      },
    },
    {
      title: '审核日期',
      dataIndex: 'confirmTime',
      align: 'center',
    },
    {
      title: '审核人',
      dataIndex: 'confirmBy',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (value, row) => {
        return (
          <Button type="link" onClick={() => onDetail(row)} disabled={hasPermi('carmanageaudit:list:view')}>
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
          <Form.Item name="status">
            <Select allowClear placeholder="请选择状态" style={{width: 150}}>
              {groupTypeList.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="vin">
            <Input placeholder="请输入VIN" allowClear style={{width: '180px'}}></Input>
          </Form.Item>
          <Form.Item name="shopName">
            <Input placeholder="请输入门店" allowClear className="inpW"></Input>
          </Form.Item>
          <Form.Item>
            <RangePicker
              style={{width: 260}}
              placeholder={['提交开始时间', '提交截止时间']}
              onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'commitTimeStart', 'commitTimeEnd')}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onSearch}
              disabled={hasPermi('carmanageaudit:list:search')}>
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
