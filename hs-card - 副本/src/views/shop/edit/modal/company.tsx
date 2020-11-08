/** @format */

import React, { useState, useEffect } from 'react' // useRef, useCallback,
import { Modal, Form, Table, Input, Button, Select } from 'antd'
import useAntdTable from '@/hooks/useAntdTable'
import * as api from '@/api'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import { useRequest } from '@umijs/hooks'

interface IProps {
  visible: boolean
  orgCodes?
  onOk?: (data: any[]) => void
  setVisible: () => void
  companyList?
}

const Edit: React.FC<IProps> = ({ ...props }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  // const [selectedPropKeys, setSelectedPropKeys] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [form] = Form.useForm()
  // const listRef = useRef<any[]>([])

  const { data: areaList } = useRequest(() => api.getAreaList())
  const compCodeStr =
    sessionStorage.getItem('compCode') === 'COM00000000000001' ? '' : sessionStorage.getItem('compCode')
  const getTableData = (tableParams, params) =>
    api.getCompOrgListParams({ ...api.formatParams(tableParams, params), compCode: compCodeStr }).then(res => ({
      total: res.data.total,
      list: res.data,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 80,
    form,
  })
  useEffect(() => {
    // setSelectedRows([])
    // setSelectedPropKeys(props.orgCodes)
    // setSelectedRows(props.companyList)
  }, [props.orgCodes])

  useEffect(() => {
    setSelectedRowKeys([])
    // console.log('执行---')
    // setSelectedRows([])
  }, [props.visible])

  const shopType: any = [
    {
      id: 1,
      name: '直营',
    },
    {
      id: 2,
      name: '加盟控股',
    },
    {
      id: 3,
      name: '加盟参股',
    },
  ]

  const shopLevelName: any = [
    {
      id: '01070103',
      name: '标准店',
    },
    {
      id: '01070105',
      name: '社区店',
    },
    {
      id: '01070104',
      name: '小型店',
    },
  ]
  const { submit } = search || {}

  // const onSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   e.preventDefault()
  //   form.validateFields().then(async values => {
  //     props.setVisible()
  //     // props.onOk?.(selectedRowKeys, selectedRows)
  //     const selectedRowKeysFilter = selectedRowKeys.filter(f => f !== "undefined" && f)
  //     const selectedRowsFilter = selectedRows.filter(f => f !== "undefined" && f)
  //     const params: any = { 'selectedRowKeys': selectedRowKeysFilter, 'selectedRows': selectedRowsFilter }
  //     props.onOk?.(params)
  //   })
  // }

  const onSubmit = () => {
    let selectedRowKeysFilter = selectedRowKeys.filter(f => f !== 'undefined' && f)
    let selectedRowsFilter = selectedRows.filter(f => f !== 'undefined' && f)
    const params: any = { selectedRowKeys: selectedRowKeysFilter, selectedRows: selectedRowsFilter }
    props.onOk?.(params)
    props.setVisible()
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeysNew, selRowsNew) => {
      setSelectedRowKeys(rowKeysNew)
      setSelectedRows(selRowsNew)
    },
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '门店简称',
      dataIndex: 'shopShortName',
    },

    // {
    //   title: '地域',
    //   dataIndex: '',
    // },
    {
      title: '省市区',
      key: 'shopProvince',
      render: a => a.bk1 + a.bk2,
    },
    {
      title: '区域',
      dataIndex: 'areaName',
    },
    {
      title: '分店性质',
      dataIndex: 'shopType',
      width: 120,
      render: (value, row) =>
        row.shopType === 0 ? '总店' : row.shopType === 1 ? '直营' : row.shopType === 2 ? '加盟控股' : '加盟参股',
    },
    {
      title: '门店类型',
      dataIndex: 'shopLevelName',
    },
    {
      title: '地址',
      dataIndex: 'shopAddress',
    },
  ]

  return (
    <Modal
      zIndex={99}
      width={1100}
      title="选择适用门店"
      maskClosable={false}
      visible={props.visible}
      onCancel={() => props.setVisible()}
      onOk={onSubmit}>
      <div>
        <Form form={form} layout="inline">
          <Form.Item name="shopName">
            <Input placeholder="门店简称" allowClear />
          </Form.Item>
          <Form.Item name="shopType">
            <Select allowClear placeholder="分店性质" style={{ width: 150 }}>
              {shopType.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="areaId">
            <Select allowClear placeholder="区域" style={{ width: 150 }}>
              {areaList?.data.map(item => (
                <Select.Option value={item.areaId}>{item.areaName}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="shopLevel">
            <Select allowClear placeholder="分店类型" style={{ width: 150 }}>
              {shopLevelName.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name">
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
          </Form.Item>
        </Form>

        <Table rowSelection={rowSelection} columns={columns} rowKey="compCode" {...tableProps} style={{ height: '350px', overflow: 'auto' }} />
      </div>
    </Modal>
  )
}

export default Edit
