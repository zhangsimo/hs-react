/** @format */

import React, {useState, useEffect} from 'react' //useCallback, useRef,
import {Form, Table, Input, Select, Button, message} from 'antd'
import useAntdTable from '@/hooks/useAntdTable'
import * as api from '@/api'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {useRequest} from '@umijs/hooks'
interface IProps {
  onOk?
  type?
  productType?
}

const Edit: React.FC<IProps> = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [selectionType, setSelectionType] = useState<any>('checkbox')

  const [form] = Form.useForm()
  // const listRef = useRef<any[]>([])
  const {data: maintWork} = useRequest(() => api.getDictdic({typeCode: '00000003', typeName: 'maintWork'}))
  const getTableData = (params: any, formData) =>
    api.getGongshiList({...params, ...formData, page: params.current}).then(res => ({
      total: res.data.total,
      list: res.data.list,
    }))

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 5,
    form,
  })

  const {submit} = search || {}
  useEffect(() => {
    console.log(props.type)
    setSelectionType(props.type)
  }, [])
  const onMenuOk = () => {
    if (!selectedRows.length) {
      message.warning(`请先选择商品`)
      return false
    }
    const selectedRowsFilter = selectedRows.filter(f => f !== 'undefined' && f)
    props.onOk(selectedRowsFilter)
    return selectedRows
  }

  const onRowSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '工时名称编码',
      dataIndex: 'itemCode',
    },
    {
      title: '工时名称',
      dataIndex: 'itemName',
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
    },
    {
      title: '工种',
      dataIndex: 'itemKindName',
    },
  ]

  return (
    <div>
      <Form form={form} layout="inline">
        <Form.Item name="itemName">
          <Input placeholder="输入工时名字" allowClear />
        </Form.Item>
        <Form.Item name="aliasName">
          <Input placeholder="输入别名" allowClear />
        </Form.Item>
        <Form.Item name="itemKind">
          <Select placeholder="选择工种" style={{width: '140px'}} allowClear>
            {maintWork?.data.map(item => (
              <Select.Option value={item.code} key={item.code}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="name">
          <Button type="primary" onClick={submit}>
            搜索
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowSelection={{selectedRowKeys, type: selectionType, onChange: onRowSelectChange}}
        columns={columns}
        rowKey="itemCode"
        {...tableProps}
      />
      <div className="btomBtn">
        <Button type="primary" onClick={onMenuOk}>
          确认
        </Button>
      </div>
    </div>
  )
}

export default Edit
