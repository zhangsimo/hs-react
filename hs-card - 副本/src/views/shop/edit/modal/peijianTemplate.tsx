/** @format */

import React, {useState} from 'react'
import {Modal, Form, Table, Input, Select, Button} from 'antd'
import useAntdTable from '@/hooks/useAntdTable'
import * as api from '@/api'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'

interface IProps {
  visible: boolean
  onOk?: () => void
  setVisible: () => void
}

const Edit: React.FC<IProps> = ({...props}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [form] = Form.useForm()

  const getTableData = (params: any, formData) =>
    api.getPenjianList({...params, ...formData}).then(res => ({
      total: res.data.total,
      list: res.data.list,
    }))

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 5,
    form,
  })

  const {submit} = search || {}

  const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault()
    form.validateFields().then(async values => {
      props.setVisible()
      props.onOk?.()
    })
  }

  const onRowSelectChange = a => {
    console.log('a: ', a)
    setSelectedRowKeys(a)
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '配件编码',
      dataIndex: 'id',
    },
    {
      title: 'OE编码',
      dataIndex: 'name',
    },
    {
      title: '品牌件编码',
      dataIndex: 'name',
    },
    {
      title: '品质名称',
      dataIndex: 'name',
    },
    {
      title: '配件品牌',
      dataIndex: 'name',
    },
    {
      title: '产地类型',
      dataIndex: 'name',
    },
    {
      title: '厂家',
      dataIndex: 'name',
    },
    {
      title: '参考价',
      dataIndex: 'name',
    },
  ]

  return (
    <Modal
      zIndex={99}
      title="选择配件"
      maskClosable={false}
      visible={props.visible}
      onCancel={() => props.setVisible()}
      onOk={onSubmit}>
      <div>
        <Form form={form} layout="inline">
          <Form.Item name="name">
            <Input placeholder="名字" />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="用户状态" style={{width: '140px'}} allowClear>
              <Select.Option value="0">暂停</Select.Option>
              <Select.Option value="1">启用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="name">
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowSelection={{selectedRowKeys, onChange: onRowSelectChange}}
          columns={columns}
          rowKey="id"
          {...tableProps}
        />
      </div>
    </Modal>
  )
}

export default Edit
