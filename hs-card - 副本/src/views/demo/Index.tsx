/** @format */

import React, {useState} from 'react'
import {useRouteMatch} from 'react-router-dom'
import {Table, Button, Form, Input, Select, Modal} from 'antd'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
// import * as api from '@/api'
import dayjs from 'dayjs'
import {ICardDetail, ITableResult, IEditType} from '@/interface'
import {useBoolean} from '@umijs/hooks'
const {confirm} = Modal

const Company = () => {
  const routeMatch = useRouteMatch<{id: string}>()
  const visible = useBoolean(false)
  const [activeData, setActiveData] = useState<ICardDetail>()
  const [form] = Form.useForm()

  const getTableData = (params: any, formData) => {}
  // api.getDrivingClassList({shop_id: routeMatch.params.id, ...params, ...formData}).then(res => ({
  //   total: res.total,
  //   list: res.data,
  // }))

  const {tableProps, search, refresh, update, add, remove} = useAntdTable<ITableResult<ICardDetail>, ICardDetail>(
    getTableData,
    {
      defaultPageSize: 20,
      form,
    },
  )

  const {submit} = search || {}

  const onAdd = () => {
    setActiveData(undefined)
    visible.toggle()
  }
  const onEdit = (item: ICardDetail) => {
    setActiveData(item)
    visible.toggle()
  }

  const onDel = (item: ICardDetail) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该班型？此操作不可恢复哦？',
      onOk() {
        remove(item.cardId)
        // return api.removeDrivingClass(item.id)
      },
      onCancel() {},
    })
  }

  const onSuccess = (type: IEditType, item: ICardDetail) => {
    console.log(item)
    if (type === 'update') {
      update(item.cardId, item)
    } else {
      add(item)
    }
  }

  const columns: ColumnProps<ICardDetail>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },

    {
      title: '创建时间',
      key: 'create_time',
      render: (row: ICardDetail) => dayjs(row.create_time).format('YYYY-MM-DD hh:mm'),
    },
    {
      title: '跟新人',
      dataIndex: 'create_by',
    },
    {
      title: '跟新时间',
      key: 'update_time',
      render: (row: ICardDetail) => dayjs(row.update_time).format('YYYY-MM-DD hh:mm'),
    },
    {
      title: '跟新人',
      dataIndex: 'update_by',
    },
    {
      title: '操作',
      key: 'action',
      render: (row: ICardDetail) => (
        <div>
          <Button onClick={() => onEdit(row)} type="link">
            修改
          </Button>
          <Button onClick={() => onDel(row)} type="link">
            删除
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <ToolsBar visible={false}>
        <Form form={form} layout="inline">
          <Form.Item name="name">
            <Input.Search placeholder="名字" onSearch={submit} />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="用户状态" style={{width: '140px'}} allowClear onChange={submit}>
              <Select.Option value="0">暂停</Select.Option>
              <Select.Option value="1">启用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        <div>
          <Button type="primary" onClick={onAdd}>
            新增
          </Button>
          &nbsp;&nbsp;
          <Button onClick={refresh}>刷新</Button>
        </div>
      </ToolsBar>

      <Table columns={columns} rowKey="id" {...tableProps} />
      <Edit
        id={parseInt(routeMatch.params.id)}
        visible={visible.state}
        data={activeData}
        setVisible={visible.toggle}
        onOk={onSuccess}
      />
    </div>
  )
}

export default Company
