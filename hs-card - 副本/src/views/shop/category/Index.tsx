/** @format */

import React, { useState } from 'react'
import { Table, Button, Form, Modal } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import Edit from './Edit'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
// import dayjs from 'dayjs'
import { ITableResult } from '@/interface'
import { useBoolean } from '@umijs/hooks'
import hasPermi from '@/components/directive'
// import { toTreeDate } from '@/utils'
const { confirm } = Modal

const Company = () => {
  const [pid, setPid] = useState(0)
  const visible = useBoolean(false)
  const [activeData, setActiveData] = useState<any>()
  const [form] = Form.useForm()
  const [cateName, setCateName] = useState<any>()

  const getTableData = (params: any, formData) =>
    api.getShopCategoryListNested({ ...params, ...formData, ...{ page: params.current } }).then(res => {
      // const list = toTreeDate(res.data.items, 0, { id: 'id', pid: 'pid', children: 'children' }) || []
      const list = res.data.items
      if (res.data.items.length === 0 && params.current > 1) {
        params.current = 1
        refresh()
      }
      return {
        list,
        total: res.data.total,
      }
    })

  const { tableProps, refresh } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  // const {submit} = search || {}

  const onAdd = () => {
    setActiveData(undefined)
    setCateName('')
    setPid(0)
    visible.toggle()
  }
  const onEdit = (item: any) => {
    setActiveData(item)
    setCateName('')
    visible.toggle()
  }
  const onAdd1 = (row: any) => {
    setActiveData(undefined)
    setCateName(row.cateName)
    setPid(row.id)
    visible.toggle()
  }

  const onDel = (item: any) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除？此操作不可恢复哦？',
      onOk() {
        api.delShopCategory({ categoryId: item.id }).then(() => {
          refresh()
        })
      },
      onCancel() { },
    })
  }

  const onSuccess = () => {
    refresh()
    setCateName('')
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 150,
    },
    {
      title: '类目编码',
      dataIndex: 'id',
    },
    {
      title: '类目名称',
      dataIndex: 'cateName',
    },
    {
      title: '图标',
      key: 'pic',
      render: a => a.pic ? <img src={a.pic} style={{ width: '45px', height: '45px' }} /> : '',
    },
    {
      title: '商品数',
      dataIndex: 'itemNum',
    },
    // {
    //   title: '跟新时间',
    //   key: 'updateTime',
    //   render: (row: any) => dayjs(row.update_time).format('YYYY-MM-DD hh:mm'),
    // },
    // {
    //   title: '跟新人',
    //   dataIndex: 'updateBy',
    // },
    {
      title: '操作',
      key: 'action',
      render: (row: any) => (
        <div>
          <Button onClick={() => onEdit(row)} type="link" disabled={hasPermi('shop:category:edit')}>
            修改
          </Button>
          <Button onClick={() => onAdd1(row)} type="link" disabled={hasPermi('shop:category:addSubclass')}>
            添加子类
          </Button>
          <Button onClick={() => onDel(row)} type="link" disabled={hasPermi('shop:category:delete')}>
            删除
          </Button>
        </div>
      ),
    },
  ]

  const expandableChild = {
    expandedRowRender: record =>
      <div style={{ margin: '20px 0', }}>
        <Table
          bordered
          size="middle"
          columns={columns}
          dataSource={record.childs}
          rowKey="id"
          pagination={false}
          expandable={expandableChild}
        />
      </div>,
    rowExpandable: record => record.childs && record.childs.length > 0 ? true : false
  };
  return (
    <div>
      <ToolsBar visible={false}>
        <div></div>
        <div>
          <Button type="primary" onClick={onAdd} disabled={hasPermi('shop:category:add')}>
            新增
          </Button>
          &nbsp;&nbsp;
          <Button onClick={refresh} disabled={hasPermi('shop:category:refresh')}>刷新</Button>
        </div>
      </ToolsBar>

      <Table columns={columns} rowKey="id" {...tableProps}
        expandable={expandableChild}
        bordered
        pagination={{
          showSizeChanger: true,
          total: tableProps.pagination.total,
          current: tableProps.pagination.current,
          showTotal: total => `共 ${total} 条`,
          pageSize: tableProps.pagination.pageSize,
        }} />
      <Edit pid={pid} visible={visible.state} data={activeData} setVisible={visible.toggle} onOk={onSuccess} cateName={cateName} />
    </div>
  )
}

export default Company
