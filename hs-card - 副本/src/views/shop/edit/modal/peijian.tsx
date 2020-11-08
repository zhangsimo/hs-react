/** @format */

import React, { useState, useEffect } from 'react' //useRef, useCallback, useEffect
import { Form, Table, Input, Button, message } from 'antd'
import useAntdTable from '@/hooks/useAntdTable'
import * as api from '@/api'
import { ITableResult } from '@/interface'
// import {ColumnProps} from 'antd/lib/table'
// import {useRequest} from '@umijs/hooks'
interface IProps {
  onOkPeijian?
  type?
  productType?
  isbzName?
}

const Edit: React.FC<IProps> = ({ ...props }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [selectionType, setSelectionType] = useState<any>('checkbox')
  const [rowKey, setRowKey] = useState<any>('code')
  const [columnsPeijian, setColumnsPeijian] = useState<any[]>([])

  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [form] = Form.useForm()
  let url: any = ''
  if (props.productType == 4 || props.isbzName) {
    url = api.getwbPenjianList
  } else {
    url = api.getPenjianList
  }
  // const {data: dictDic} = useRequest(() => api.getDictdic({typeCode: 'QUALITY', typeName: 'quality'}))
  const getTableData = (params: any, formData) =>
    url({ ...params, ...formData, page: params.current }).then(res => ({
      total: res.data.total,
      list: res.data.list,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 5,
    form,
  })

  const { submit } = search || {}

  useEffect(() => {
    setSelectionType(props.type)
    if (props.productType == 4) {
      //当为项目-配件时候
      setRowKey('id')
    }
    columnsPeijianSet(props.productType, props.isbzName)
  }, [])

  const onMenuOk = () => {
    if (!selectedRows.length) {
      message.warning(`请先选择商品`)
      return false
    }
    const selectedRowsFilter = selectedRows.filter(f => f !== 'undefined' && f)
    props.onOkPeijian(selectedRowsFilter)
    return selectedRows
  }

  const onRowSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }

  const columnsPeijianSet = (type, isbzName) => {
    if (type == 4 || isbzName) {
      let columnsPeijian = [
        {
          title: '配件编码',
          dataIndex: 'code',
        },

        {
          title: '配件名称',
          dataIndex: 'name',
        },
        {
          title: '配件名称别名',
          dataIndex: 'nameCn',
        },
        {
          title: '工种',
          dataIndex: 'business',
        },
      ]

      setColumnsPeijian(columnsPeijian)
    } else {
      let columnsPeijian = [
        {
          title: '配件编码',
          dataIndex: 'partCode',
        },
        {
          title: 'OE编码',
          dataIndex: 'oeCode',
        },
        {
          title: '配件名称',
          dataIndex: 'partStandardName',
        },
        {
          title: '品牌件编码',
          dataIndex: 'partBrandCode',
        },
        {
          title: '品质名称',
          dataIndex: 'quality',
        },
        {
          title: '配件品牌',
          dataIndex: 'partBrand',
        },
        {
          title: '产地类型',
          dataIndex: 'placeOfOrigin',
        },
        {
          title: '厂家',
          dataIndex: 'manufactor',
        },
        {
          title: '参考价',
          dataIndex: 'salePrice',
        },
      ]

      setColumnsPeijian(columnsPeijian)
    }
  }

  return (
    <div>
      <Form form={form} layout="inline">
        {props.productType == 4 ? (
          <React.Fragment>
            <Form.Item name="name">
              <Input placeholder="配件名称" style={{ width: '150px' }} />
            </Form.Item>
            <Form.Item name="code">
              <Input placeholder="配件编码" style={{ width: '150px' }} />
            </Form.Item>
          </React.Fragment>
        ) : (
            <React.Fragment>
              <Form.Item name="partStandardName">
                <Input placeholder="配件名称" style={{ width: '150px' }} />
              </Form.Item>
              <Form.Item name="partCode">
                <Input placeholder="配件编码" style={{ width: '150px' }} />
              </Form.Item>
              <Form.Item name="oeCode">
                <Input placeholder="OE编码" style={{ width: '150px' }} />
              </Form.Item>
            </React.Fragment>
          )}

        <Form.Item>
          <Button type="primary" onClick={submit}>
            搜索
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowSelection={{ selectedRowKeys, type: selectionType, onChange: onRowSelectChange }}
        columns={columnsPeijian}
        rowKey={rowKey}
        {...tableProps}
      />
      <div className="btomBtn" style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={onMenuOk}>
          确认
        </Button>
      </div>
    </div>
  )
}

export default Edit
