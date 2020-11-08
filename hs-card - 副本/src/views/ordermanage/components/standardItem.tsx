/** @format */

import React, {useState} from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table, message} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {SearchOutlined} from '@ant-design/icons'
// const goodStatus = [
//   { id: 1, name: '全部' },
//   { id: 2, name: '原厂件' },
//   { id: 3, name: '品牌件' },
//   { id: 2, name: '拆车件' },
//   { id: 3, name: '再制造件' },
// ]
interface IProps {
  standardItemCallBack
  carModelId
}
let StandardItem: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const getTableData = (tableParams, params) =>
    api
      .getOrderQueryPartList({
        ...api.formatParams(tableParams, params),
        ...{compCode: sessionStorage.getItem('compCode'), carModelId: props.carModelId},
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
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }
  const onMenuOk = () => {
    if (!selectedRows.length) {
      message.warning('请先选择配件')
      return false
    }
    props.standardItemCallBack(selectedRows[0])
    return selectedRows
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '配件编码',
      dataIndex: 'partCode',
      align: 'center',
    },
    {
      title: 'OE编码',
      dataIndex: 'oemCode',
      align: 'center',
    },
    {
      title: '品牌件编码',
      dataIndex: 'partBrandId',
      align: 'center',
    },
    {
      title: '配件名称',
      dataIndex: 'partName',
      align: 'center',
    },
    {
      title: '配件品牌',
      dataIndex: 'partBrandName',
      align: 'center',
    },
    {
      title: '产地类型',
      dataIndex: '',
      align: 'center',
    },
    {
      title: '厂家',
      dataIndex: '',
      align: 'center',
    },
    {
      title: '参考价',
      dataIndex: 'partAmt',
      align: 'center',
    },
  ]
  return (
    <div>
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="oemCode">
            <Input placeholder="请输入OE编码" allowClear style={{width: 160}}></Input>
          </Form.Item>
          <Form.Item name="partCode">
            <Input placeholder="请输入配件编码" allowClear style={{width: 160}}></Input>
          </Form.Item>
          <Form.Item name="partBrandId">
            <Input placeholder="请输入品牌配件编码" allowClear style={{width: 160}}></Input>
          </Form.Item>
          {/* <Form.Item name="status">
            <Select allowClear placeholder="请选择品质" style={{ width: 160 }} >
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
          rowKey="partCode"
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
