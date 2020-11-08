/** @format */

import React, {useState} from 'react'
import ToolsBar from '@/components/ToolsBar'
import {useRequest} from '@umijs/hooks'
import {Form, Input, Button, Table, message, Select} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {SearchOutlined} from '@ant-design/icons'
// const worldType = [
//   { id: 1, name: '全部' },
//   { id: 2, name: '机电' },
//   { id: 3, name: '钣金' },
//   { id: 4, name: '喷漆' },
//   { id: 5, name: '洗美' },
// ]
interface IProps {
  workingHoursCallBack
  carModelId
}

let StandardItem: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  // const [mainKindList,setMainKindList] = useState<Array<any>>([])
  const getTableData = (tableParams, params) =>
    api
      .getOrderProjectCustom({
        ...api.formatParams(tableParams, params),
        ...{compCode: sessionStorage.getItem('compCode'), carModelId: props.carModelId},
      })
      .then(res => ({
        list: res.data.items,
        total: res.data.total,
      }))

  const mainKindList: any = useRequest(() =>
    api.getOrderMainKindList({}).then(res => {
      console.log(res.data)
      return res.data
    }),
  )
  console.log(mainKindList)
  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 5,
    form,
  })

  const {submit} = search || {}
  const onSearch = () => {
    submit()
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }
  const onMenuOk = () => {
    if (!selectedRows.length) {
      message.warning('请先选择配件')
      return false
    }
    props.workingHoursCallBack(selectedRows[0])
    return selectedRows
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '工时名称编码',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '工时名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
      align: 'center',
    },
    {
      title: '工种',
      dataIndex: 'itemKindName',
      align: 'center',
    },
  ]
  return (
    <div>
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="itemName">
            <Input placeholder="请输入工时名称" allowClear style={{width: 160}}></Input>
          </Form.Item>
          <Form.Item name="aliasName">
            <Input placeholder="请输入别名" allowClear style={{width: 160}}></Input>
          </Form.Item>
          <Form.Item name="itemKind">
            <Select allowClear placeholder="请选择工种" style={{width: 160}}>
              {mainKindList &&
                mainKindList.data?.length &&
                mainKindList.data?.map(item => (
                  <Select.Option value={item.code} key={item.code}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>
      <div style={{backgroundColor: 'white', marginTop: '12px'}}>
        <Table
          bordered
          rowSelection={{
            type: 'radio',
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
      <div className="btomBtn">
        <Button type="primary" onClick={onMenuOk}>
          确认
        </Button>
      </div>
    </div>
  )
}

export default StandardItem
