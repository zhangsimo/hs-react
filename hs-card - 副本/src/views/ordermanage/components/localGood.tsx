/** @format */

import React, {useState, useEffect} from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table, message} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {SearchOutlined} from '@ant-design/icons'

interface IProps {
  standardItemCallBack?
  workingHoursCallBack?
  carModelId
  sign
}
// const goodStatus = [
//   { id: 1, name: '普通商品' },
//   { id: 2, name: '工时' },
//   { id: 3, name: '配件' },
//   { id: 4, name: '项目' },
//   { id: 5, name: '套餐' },
// ]

let StandardItem: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  useEffect(() => {
    if (props.sign) {
      onSearch()
    }
  }, [props.sign])
  const getTableData = (tableParams, params) =>
    api
      .getOrderGoodQueryItemList({
        ...api.formatParams(tableParams, params),
        ...{status: 2, detail: 1, type: props.sign === 'part' ? 3 : 2},
      })
      .then(res => ({
        list: res.data.items,
        total: res.data.total,
      }))

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
      console.log(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }
  const onMenuOk = () => {
    if (!selectedRows.length) {
      message.warning(`请先选择商品`)
      return false
    }
    const data: any = selectedRows
    console.log(props.sign === 'part' ? data[0].part : data[0].labor)
    if (props.sign === 'part') {
      props.standardItemCallBack(data[0].part)
    } else {
      props.workingHoursCallBack(data[0].labor)
    }
    return selectedRows
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '商品主图',
      dataIndex: 'oemCode',
      align: 'center',
      render: (value, row) => <img src={row.image} className="rowImg" />,
    },
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '商品类型',
      dataIndex: 'type',
      align: 'center',
      render: (value, row) =>
        row.type === 1
          ? '普通商品'
          : row.type === 2
          ? '工时'
          : row.type === 3
          ? '配件'
          : row.type === 4
          ? '项目'
          : '套餐',
    },
    {
      title: '关联维保数据',
      dataIndex: 'localItem',
      align: 'center',
      render: (value, row) => (row.localItem === 2 ? '是' : '否'),
    },
    {
      title: '销售价格',
      dataIndex: 'price',
      align: 'center',
    },
  ]

  return (
    <div className="localGood commomClass">
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="nameOrCode">
            <Input placeholder="请输入商品名称" allowClear style={{width: 160}}></Input>
          </Form.Item>
          {/* <Form.Item name="type">
            <Select allowClear placeholder="请选择状态" style={{ width: 160 }} >
              {goodStatus.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item> */}

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
