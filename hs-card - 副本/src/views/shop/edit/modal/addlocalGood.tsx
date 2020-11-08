/** @format */

import React, { useState, useEffect } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { Form, Input, Button, Table, message, Select } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
// import AddlocalGood from './addGoodTable'
import { SearchOutlined } from '@ant-design/icons'
// import { add } from 'lodash'
interface IProps {
  standardItemCallBack?
  workingHoursCallBack?
  replacementsCallBack?
  carModelId
  sign
  proType?
  propsType?
}
const goodStatus = [
  { id: 1, name: '普通商品' },
  { id: 2, name: '工时' },
  { id: 3, name: '配件' },
  { id: 4, name: '项目' },
  // { id: 5, name: '套餐' },
]

let StandardItem: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const [addParams, setAddParams] = useState<any>()
  useEffect(() => {
    if (props.proType) {
      const addParams = props.proType === '5' ? { excludeType: 5 } : props.proType === '2' ? { type: 2 } : { type: 3 } //2配件 3工时 5套餐
      setAddParams(addParams)
    }
  }, [props.proType])
  useEffect(() => {
    if (props.sign) {
      setSelectedRowKeys([])
      onSearch()
    }
  }, [props.sign])
  const getTableData = (tableParams, params) =>
    api
      .getOrderGoodQueryItemList({
        ...api.formatParams(tableParams, params),
        ...{ status: 2, detail: 1, excludeType: 5 },
        ...addParams,
      })
      .then(res => {
        // detail: 1具体返回到配件，工时
        const data = res.data.items.map((d, index) => {
          let items = d.labor ? [d.labor] : []
          let parts = d.part ? [d.part] : []
          const subItem =
            d.subItemVos && d.subItemVos.length > 0
              ? d.subItemVos.map(i => {
                return {
                  ...i,
                  items: i.type === 2 ? (i.labor ? [i.labor] : []) : [],
                  parts: i.type === 3 ? (i.part ? [i.part] : []) : [],
                }
              })
              : []
          return { ...d, subItemVos: subItem, items: items, parts: parts }
        })
        return {
          list: data,
          total: res.data.total,
        }
      })

  const { tableProps, search } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 5,
    form,
  })

  const { submit } = search || {}
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
    const selectedRowKeysFilter = selectedRowKeys.filter(f => f !== 'undefined' && f)
    const selectedRowsFilter = selectedRows.filter(f => f !== 'undefined' && f)
    if (props.proType === '5') {
      //套餐
      props.standardItemCallBack(selectedRowKeysFilter, selectedRowsFilter)
    }
    if (props.proType === '2') {
      //工时
      props.workingHoursCallBack(selectedRowsFilter)
    }
    if (props.proType === '3') {
      //配件
      props.replacementsCallBack(selectedRowsFilter)
    }
    return selectedRows
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      align: 'center',
      width: 60,
    },
    {
      title: '商品主图',
      dataIndex: 'oemCode',
      align: 'center',
      render: (value, row) => (row.image ? <img src={row.image} className="rowImg" style={{ width: '80px' }} /> : ''),
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
      title: '是否标准项目',
      dataIndex: 'localItem',
      align: 'center',
      render: (value, row) => (row.localItem === 2 ? '是' : '否'),
    },
    {
      title: '销售价格',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '销量',
      dataIndex: 'sales',
      width: 60,
      align: 'center',
      // render: (value, row) => (
      //   <InputNumber min={1} max={100000} defaultValue={1} onChange={onChange} />
      // )
    },
    {
      title: '虚拟销量',
      dataIndex: 'ficti',
      width: 80,
      align: 'center',
      // render: (value, row) => (
      //   <InputNumber min={1} max={100000} defaultValue={1} onChange={onChange} />
      // )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'shelfTime',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 60,
      render: (value, row) => (row.status === 1 ? '仓库' : row.status === 2 ? '上架' : '回收站'),
    },
  ]
  const columnsmeal: ColumnProps<any>[] = [
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
      title: '商品来源',
      dataIndex: 'localItem',
      align: 'center',
      render: (value, row) => (row.localItem === 2 ? '维保标准库' : '本地库'),
    },
    {
      title: '销售金额',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'stock',
      align: 'center',
    },
  ]
  const columnsParts: ColumnProps<any>[] = [
    {
      title: '配件名称',
      dataIndex: 'partName',
      align: 'center',
    },
    {
      title: '配件编码',
      dataIndex: 'partCode',
      align: 'center',
    },
    {
      title: '配件品牌',
      dataIndex: 'partBrandName',
      align: 'center',
    },
    {
      title: '品质',
      dataIndex: 'qualityName',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'salePrice',
      align: 'center',
    },
  ]
  const columnsWork: ColumnProps<any>[] = [
    {
      title: '工时名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '工时编码',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '工时单价',
      dataIndex: 'unitPrice',
      align: 'center',
    },
    {
      title: '工时数',
      dataIndex: 'itemTime',
      align: 'center',
    },
    {
      title: '工时金额',
      dataIndex: 'salePrice',
      align: 'center',
    },
  ]
  const expandable = {
    expandedRowRender: record => (
      <div>
        <div className="accessoriesDetails">
          <div className="operating">
            <CaretDownOutlined />
            <p>明细</p>
          </div>
          {record.subItemVos && record.subItemVos.length > 0 ? (
            <Table
              bordered
              size="middle"
              columns={columnsmeal}
              dataSource={record.subItemVos}
              rowKey="id"
              pagination={false}
              expandable={expandableChild}
            />
          ) : (
              <>
                {record.parts && record.parts.length > 0 ? (
                  <>
                    <div>
                      <p>配件</p>
                    </div>
                    <Table
                      bordered
                      size="middle"
                      columns={columnsParts}
                      dataSource={record.parts}
                      rowKey="oemCode"
                      pagination={false}
                    />
                  </>
                ) : (
                    ''
                  )}

                {record.items && record.items.length > 0 ? (
                  <>
                    <div className="workTime">
                      <p>工时</p>
                    </div>
                    <Table
                      bordered
                      size="middle"
                      columns={columnsWork}
                      dataSource={record.items}
                      rowKey="itemCode"
                      pagination={false}
                    />
                  </>
                ) : (
                    ''
                  )}
              </>
            )}
        </div>
      </div>
    ),
    rowExpandable: record =>
      (record.subItemVos && record.subItemVos.length > 0) ||
        (record.parts && record.parts.length > 0) ||
        (record.items && record.items.length > 0)
        ? true
        : false,
  }
  const expandableChild = {
    expandedRowRender: record => (
      <div>
        <div className="accessoriesDetails">
          <div className="operating">
            <CaretDownOutlined />
            <p>明细</p>
          </div>
          {record.subItemVos && record.subItemVos.length > 0 ? (
            <Table
              bordered
              size="middle"
              columns={columnsmeal}
              dataSource={record.subItemVos}
              rowKey="id"
              pagination={false}
            // expandable={expandableChild}
            />
          ) : (
              ''
            )}
        </div>
      </div>
    ),
    rowExpandable: record => (record.subItemVos && record.subItemVos.length > 0 ? true : false),
  }
  const onExpandedRowsChange = val => {
    console.log('点击了行')
  }
  return (
    <div className="localGood commomClass">
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="nameOrCode">
            <Input placeholder="请输入商品名称" allowClear style={{ width: 160 }}></Input>
          </Form.Item>
          {props.proType === '5' ? (
            <Form.Item name="type">
              <Select allowClear placeholder="请选择状态" style={{ width: 160 }}>
                {goodStatus.map(item => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
              ''
            )}
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </ToolsBar>

      <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
        <Table
          bordered
          rowSelection={rowSelection}
          size="middle"
          columns={columns}
          {...tableProps}
          expandable={expandable}
          onExpandedRowsChange={onExpandedRowsChange}
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
      <div className="btomBtn" style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={onMenuOk}>
          确认
        </Button>
      </div>
    </div>
  )
}

export default StandardItem
