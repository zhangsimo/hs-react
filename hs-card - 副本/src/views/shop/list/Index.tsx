/** @format */

import React, { useState, useCallback } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Table, Button, Form, Input, Modal, Tabs, Space, Select, TreeSelect, message } from 'antd'
import { useHistory } from 'react-router-dom'
import useAntdTable from '@/hooks/useAntdTable'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import dayjs from 'dayjs'
import { IGoodList, ITableResult } from '@/interface'
import './index.less'
import { useRequest } from '@umijs/hooks'
import { toTreeDate } from '@/utils'
import hasPermi from '@/components/directive'
import { ColumnProps } from 'antd/lib/table'
const { confirm } = Modal
const typeList = [
  { id: 1, name: '普通商品' },
  { id: 2, name: '工时' },
  { id: 3, name: '配件' },
  { id: 4, name: '项目' },
  { id: 5, name: '套餐' },
]

const Company = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [active, setActive] = useState('2')
  const [form] = Form.useForm()
  const history = useHistory()
  const status = 2
  // form.setFieldsValue({ status: '2' })

  const getTableData = (params: any, formData) =>
    api.getGoodsList({ status: status, ...params, ...formData, page: params.current, headItemFlag: 2 }).then(res => ({
      total: res.data.total,
      list: res.data.items,
    }))

  const tabChange = a => {
    form.resetFields()
    form.setFieldsValue({
      status: a,
    })
    setActive(a)
    setSelectedRowKeys([])
    // run({ current: 1, pageSize: 10,  })
    onSearch()
  }
  const { tableProps, search, refresh } = useAntdTable<ITableResult<IGoodList>>(getTableData, {
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
  const onAdd = () => {
    const compCode = sessionStorage.getItem('compCode')
    if (compCode == 'COM00000000000001') {
      message.error("总部员工只能在总部商品列表发布")
      return
    }

    history.push('/shop/add?headItemFlag=2') //headItemFlag总部商品标识： 1总部 2门店
  }

  const onEdit = row => {
    history.push(`/shop/edit?id=${row.id}&headItemFlag=2`)
    console.log(row)
  }

  const onUpate = (id, opType, text = '确定下架？') => {
    confirm({
      title: '提示',
      content: text,
      onOk() {
        api.updateGoods({ productIds: [id], opType }).then(() => {
          refresh()
          switch (opType) {
            case 1:
              message.success('上架成功')
              break
            case 2:
              message.success('下架成功')
              break
            case 3:
              message.success('回收成功')
              break
            case 4:
              message.success('还原成功')
              break
          }
        })
      },
    })
  }

  const onBatchUpdate = useCallback(
    (opType, title = '确定此操作？') => {
      if (!selectedRowKeys!.length) {
        message.error('请先勾选')
      } else {
        confirm({
          title: '提示',
          content: title,
          onOk() {
            api.updateGoods({ productIds: selectedRowKeys, opType }).then(() => {
              refresh()
              setSelectedRowKeys([])
              switch (opType) {
                case 1:
                  message.success('批量上架成功')
                  break
                case 2:
                  message.success('批量下架成功')
                  break
                case 3:
                  message.success('批量放到回收站成功')
                  break
              }
            })
          },
        })
      }
    },
    [selectedRowKeys],
  )

  const onRowSelectChange = a => {
    console.log(a)
    setSelectedRowKeys(a)
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
      title: '所属门店',
      dataIndex: 'compNames',
      align: 'left',
      // render: (a, row) => {
      //   if (row.compNames) {
      //     if (row.compNames.indexOf(",") == -1) {
      //       return row.compNames
      //     } else {
      //       return (
      //         <Popover content={row.compNames} title="适用门店" trigger="click">
      //           <Button type="link">更多</Button>
      //         </Popover>
      //       )
      //     }

      //   } else {
      //     return '--'
      //   }
      // },

    },

    {
      title: '商品类型',
      key: 'type',
      render: a => typeList.find(item => a.type === item.id)?.name,
    },
    {
      title: '是否标准项目',
      key: 'localItem',
      render: a => (a.localItem == 2 ? '是' : '否'),
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '创建时间',
      key: 'create_time',
      width: 110,
      render: row => dayjs(row.createTime).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '发布时间',
      width: 110,
      key: 'update_time',
      render: row => dayjs(row.updateTime).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: row => (
        <div>

          <Button onClick={() => onEdit(row)} type="link" disabled={hasPermi('shop:list:EditGood')}>
            编辑商品
            </Button>

          {row.status === 1 && (
            <>
              <Button
                onClick={() => onUpate(row.id, 1, '确定上架？')}
                type="link"
                disabled={hasPermi('shop:list:onShelf')}>
                立即上架
              </Button>
              <Button
                onClick={() => onUpate(row.id, 3, '确定删除？')}
                type="link"
                disabled={hasPermi('shop:list:recycleBin')}>
                回收站
              </Button>
            </>
          )}
          {row.status === 2 && (
            <Button
              onClick={() => onUpate(row.id, 2, '确定下架？')}
              type="link"
              disabled={hasPermi('shop:list:offShelf')}>
              立即下架
            </Button>
          )}
          {row.status === 3 && (
            <Button
              onClick={() => onUpate(row.id, 4, '确定还原？')}
              type="link"
              disabled={hasPermi('shop:list:reduction')}>
              还原
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="shop-container">
      <Tabs type="card" activeKey={active} onChange={tabChange}>
        <Tabs.TabPane key="2" tab="出售中的宝贝"></Tabs.TabPane>
        <Tabs.TabPane key="1" tab="仓库中的宝贝"></Tabs.TabPane>
        <Tabs.TabPane key="3" tab="回收站"></Tabs.TabPane>
      </Tabs>
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
          <Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={onSearch}
                icon={<SearchOutlined />}
                disabled={hasPermi('shop:list:search')}>
                搜索
              </Button>
              <Button
                onClick={onAdd}
                style={{ border: '1px solid #304156', color: '#304156' }}
                disabled={hasPermi('shop:list:addGood')}>
                发布商品
              </Button>
              {active === '2' && (
                <Button
                  onClick={() => onBatchUpdate(2)}
                  style={{ background: '#304156', color: '#fff', border: 'none' }}
                  disabled={hasPermi('shop:list:AlloffShelf')}>
                  批量下架
                </Button>
              )}
              {active === '1' && (
                <Button
                  onClick={() => onBatchUpdate(1)}
                  style={{ background: '#304156', color: '#fff', border: 'none' }}
                  disabled={hasPermi('shop:list:AllonShelf')}>
                  批量上架
                </Button>
              )}
              {active === '1' && (
                <Button
                  onClick={() => onBatchUpdate(3)}
                  style={{ background: '#304156', color: '#fff', border: 'none' }}
                  disabled={hasPermi('shop:list:AllRecycle')}>
                  批量放到回收站
                </Button>
              )}
              {active === '3' && (
                <Button
                  onClick={() => onBatchUpdate(4)}
                  style={{ background: '#304156', color: '#fff', border: 'none' }}
                  disabled={hasPermi('shop:list:AllonShelf')}>
                  批量上架
                </Button>
              )}
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
        rowSelection={{ selectedRowKeys, onChange: onRowSelectChange }}
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
    </div>
  )
}

export default Company
