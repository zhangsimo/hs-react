/** @format */

import React, { useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Table, Button, Form, Input, Space, Select, TreeSelect, Popover } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import dayjs from 'dayjs'
import { IGoodList, ITableResult } from '@/interface'
import './index.less'
import { useBoolean, useRequest } from '@umijs/hooks'
import { toTreeDate } from '@/utils'
import hasPermi from '@/components/directive'
// import SelectComp from '@/components/Select/comp'
import Det from './_det'
import { useHistory } from 'react-router-dom'
const typeList = [
  { id: 1, name: '普通商品' },
  { id: 2, name: '工时' },
  { id: 3, name: '配件' },
  { id: 4, name: '项目' },
  { id: 5, name: '套餐' },
]

const Company = () => {
  const history = useHistory()
  const showDetail = useBoolean(false)
  const [form] = Form.useForm()
  const [currRow, setCurrRow] = useState<IGoodList>()
  const status = ''
  // form.setFieldsValue({ status: '2' })

  const getTableData = (params: any, formData) =>
    api.getGoodsList({ status: status, ...params, ...formData, page: params.current, headItemFlag: 1 }).then(res => ({
      total: res.data.total,
      list: res.data.items,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<IGoodList>, IGoodList>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  const { data: treeData = [] } = useRequest(() =>
    api.getShopCategoryList({ page: 1, pageSize: 2000 }).then(res =>
      toTreeDate<any>(
        res.data.items.map(item => ({ pid: item.pid, title: item.cateName, value: item.id })),
        0,
        { id: 'value', pid: 'pid', children: 'children' },
      ),
    ),
  )

  const { submit } = search || {}
  const onSearch = () => {
    form.validateFields().then(res => {
      submit()
    })
  }

  const onEdit = row => {
    // history.push(`/shop/edit?id=${row.id}&actType=head`)
    showDetail.setTrue()
    setCurrRow(row)
    console.log(row)
  }

  const onAdd = () => {
    history.push('/shop/add?headItemFlag=1') //headItemFlag总部商品标识： 1总部 2门店
  }

  const columns: ColumnProps<IGoodList>[] = [
    {
      title: '商品id',
      dataIndex: 'id',
    },
    {
      title: '商品主图',
      key: 'image',
      render: a => (a.image ? <img src={a.image} style={{ width: '100px', height: '100px' }} /> : ''),
    },
    {
      title: '商品名称',
      width: 150,
      dataIndex: 'storeName',
      // render: a => (<span className='storeName'>{a.storeName}</span>),
    },

    {
      title: '商品类型',
      key: 'type',
      render: a => typeList.find(item => a.type === item.id)?.name,
    },
    {
      title: '关联维保数据',
      key: 'localItem',
      render: a => (a.localItem == 2 ? '是' : '否'),
    },
    {
      title: '适用门店',
      dataIndex: 'compName',
      align: 'left',
      render: (a, row) => {

        if (row.compNames) {
          if (row.compNames.indexOf(",") == -1) {
            return row.compNames
          } else {
            return (
              <Popover content={row.compNames} title="适用门店" trigger="click">
                <Button type="link">更多</Button>
              </Popover>
            )
          }

        } else {
          return '--'
        }
      },

    },
    {
      title: '最后更新时间',

      key: 'update_time',
      render: row => dayjs(row.updateTime).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '最后更新人',
      dataIndex: 'stock',
      width: 110,
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: row => (


        <Button onClick={() => onEdit(row)} type="link" disabled={hasPermi('shop:list:EditGood')}>
          编辑商品
        </Button>




      ),
    },
  ]

  return (
    <div className="shop-container">
      <ToolsBar visible={false}>
        <Form form={form} layout="inline">
          <Form.Item name="categoryId" style={{ minWidth: '300px' }}>
            <TreeSelect
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder="选择商品类目"
            />
          </Form.Item>
          <Form.Item name="type">
            <Select placeholder="选择商品类型" allowClear style={{ width: '130px' }}>
              <Select.Option value="1">普通商品</Select.Option>
              <Select.Option value="2">工时</Select.Option>
              <Select.Option value="3">配件</Select.Option>
              <Select.Option value="4">项目</Select.Option>
              <Select.Option value="5">套餐</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" style={{ display: 'none' }}>
            <Input placeholder="选择商品类型" />
          </Form.Item>
          <Form.Item name="nameOrCode">
            <Input placeholder="输入商品名称、编码" allowClear style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item name="shopName">
            {/* <SelectComp placeholder="选择适用门店" /> */}
            <Input placeholder="输入适用门店" allowClear style={{ width: '200px' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={onSearch}
                icon={<SearchOutlined />}
              // disabled={hasPermi('shop:list:search')}
              >
                搜索
              </Button>
              <Button
                onClick={onAdd}
                style={{ border: '1px solid #304156', color: '#304156' }}
              // disabled={hasPermi('shop:list:addGood')}
              >
                发布商品
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {/* <div>
          <Button type="primary" onClick={onAdd}>
            新增
          </Button>
          &nbsp;&nbsp;
          <Button onClick={refresh}>刷新</Button>
        </div> */}
      </ToolsBar>

      <Table
        columns={columns}
        rowKey="id"
        bordered
        scroll={{ x: 1500 }}
        {...tableProps}
        pagination={{
          showSizeChanger: true,
          total: tableProps.pagination.total,
          current: tableProps.pagination.current,
          showTotal: total => `共 ${total} 条`,
          pageSize: tableProps.pagination.pageSize,
        }}
      />

      <Det visible={showDetail.state} goodId={currRow?.id} onCancel={() => showDetail.setFalse()} />
    </div>
  )
}

export default Company
