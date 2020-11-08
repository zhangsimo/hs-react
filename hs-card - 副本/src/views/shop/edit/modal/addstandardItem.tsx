/** @format */

import React, { useState, useEffect } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { Form, Input, Button, Table, message, Select } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import { useRequest } from '@umijs/hooks'
// import AddlocalGood from './addGoodTable'
import { SearchOutlined } from '@ant-design/icons'
interface IProps {
  standardItemCallBack?
  workingHoursCallBack?
  carModelId
  sign
  // objectRowKeys
}
let StandardItem: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  useEffect(() => {
    if (props.sign) {
      onSearch()
      setSelectedRowKeys([])
    }
  }, [props.sign])
  // useEffect(() => {
  //   if (props.objectRowKeys) {
  //     setSelectedRowKeys(props.objectRowKeys)
  //   }
  // }, [props.objectRowKeys])

  const business: any = useRequest(() => api.getOrderFindClassification({ typeName: 'business' }))
  const getTableData = (tableParams, params) =>
    api.getOrderQueryStdPackage({ ...api.formatParams(tableParams, params), ...{ carModelId: props.carModelId } }).then(
      res => {
        // const data = res.data.items.map((d, index) => {
        //   return { ...d, isSelect: false }
        // })
        return {
          list: res.data.items,
          total: res.data.total,
        }
      },
      // ({
      //   list: res.data.items,
      //   total: res.data.total,
      // })
    )

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
      // console.log(selectedRows, '---------rowSelection')
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
    // console.log(selectedRowKeysFilter, '--selectedRowKeysFilter')
    // console.log(selectedRowsFilter, '---selectedRowsFilter')
    props.standardItemCallBack(selectedRowKeysFilter, selectedRowsFilter)

    return selectedRows
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '项目ID',
      dataIndex: 'packageId',
      align: 'center',
    },
    {
      title: '项目名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
      align: 'center',
    },
    {
      title: '维修场景',
      dataIndex: 'maintSceneName',
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
      title: '数量',
      dataIndex: 'qty',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'partAmt',
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
      dataIndex: 'itemAmt',
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
                rowKey="orderProductId"
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
                rowKey="orderProductId"
                pagination={false}
              />
            </>
          ) : (
              ''
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
  const onExpandedRowsChange = val => { }
  return (
    <div className="localGood commomClass">
      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="content">
            <Input placeholder="请输入项目名称" allowClear style={{ width: 160 }}></Input>
          </Form.Item>
          <Form.Item name="aliasName">
            <Input placeholder="请输入别名" allowClear style={{ width: 160 }}></Input>
          </Form.Item>
          <Form.Item name="maintSceneCode">
            <Select allowClear placeholder="请选择状态" style={{ width: 160 }}>
              {business && business.data
                ? business.data.data.map(item => (
                  <Select.Option value={item.code} key={item.code}>
                    {item.name}
                  </Select.Option>
                ))
                : ''}
            </Select>
          </Form.Item>
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
          rowKey="packageId"
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
