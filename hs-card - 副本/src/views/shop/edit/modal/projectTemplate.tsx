/** @format */

import React, {useState, useRef, useCallback} from 'react'
import {Modal, Form, Table, Input, Button} from 'antd'
import useAntdTable from '@/hooks/useAntdTable'
import * as api from '@/api'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'

interface IProps {
  visible: boolean
  onOk?: (data: any[]) => void
  setVisible: () => void
}

const Edit: React.FC<IProps> = ({...props}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [form] = Form.useForm()
  const listRef = useRef<any[]>([])

  const getTableData = (params: any, formData) =>
    api.getProjectTemplateList({...params, ...formData, page: params.current}).then(res => ({
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
      console.log(listRef.current)
      let project: any = []
      listRef.current.map(o => {
        project.push({
          name: o.pkgName,
          outterCode: o.id,
          productType: 4,
          unit: '次',
          totalNum: 1,
          price: 0,
          origPrice: 0,
        })
      })
      props.onOk?.(project)
    })
  }

  const onRowSelectChange = useCallback(
    a => {
      if (selectedRowKeys.length < a.length) {
        // 减去
        const b: any[] = []
        a.forEach(i => {
          if (!selectedRowKeys.includes(i)) {
            b.push(i)
          }
        })
        b.forEach(i => {
          listRef.current.push(tableProps.dataSource.find(item => item.id === i))
        })
      } else {
        const b: any[] = []
        selectedRowKeys.forEach(i => {
          if (!a.includes(i)) {
            b.push(i)
          }
        })
        b.forEach(i => {
          const ii = listRef.current.findIndex(item => item.id === i)
          listRef.current.splice(ii, 1)
        })
      }

      setSelectedRowKeys(a)
    },
    [selectedRowKeys, tableProps, listRef],
  )

  const columns: ColumnProps<any>[] = [
    {
      title: '项目ID',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'pkgName',
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
    },
    {
      title: '维修场景',
      dataIndex: ['maintScene', 'name'],
    },
  ]

  return (
    <Modal
      zIndex={99}
      width={880}
      title="选择套餐"
      maskClosable={false}
      visible={props.visible}
      onCancel={() => props.setVisible()}
      onOk={onSubmit}>
      <div>
        <Form form={form} layout="inline">
          <Form.Item name="pkgName">
            <Input placeholder="输入名称名字" />
          </Form.Item>
          <Form.Item name="aliasName">
            <Input placeholder="输入别名" />
          </Form.Item>
          {/* <Form.Item name="name">
            <Input placeholder="输入维修场景" />
          </Form.Item> */}
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
