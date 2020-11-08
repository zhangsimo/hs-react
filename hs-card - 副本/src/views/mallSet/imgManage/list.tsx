/** @format */

import React, {useState} from 'react'
import {Table, Button, Form, Modal } from 'antd'
import {ColumnProps} from 'antd/lib/table'
import useAntdTable from '@/hooks/useAntdTable'
import Edit from './../components/addEditImg'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
import {IUser, ITableResult} from '@/interface'
import {useBoolean} from '@umijs/hooks'
const {confirm} = Modal

const Company = () => {
  const visible = useBoolean(false)
  const [activeData, setActiveData] = useState<any>({})
  const [form] = Form.useForm()

  const getTableData = (params: any, formData) => api.getMarketRpicPage({...params, ...formData}).then(res => ({
    total: res.data.total,
    list: res.data.items,
  }))

  const {tableProps, refresh} = useAntdTable<ITableResult<IUser>, IUser>(
    getTableData,
    {
      defaultPageSize: 20,
      form,
    },
  )

  const onAdd = () => {
    setActiveData(undefined)
    visible.toggle()
  }
  const onEdit = (item) => {
    setActiveData(item)
    visible.toggle()
  }

  const onDel = (item) => {
    confirm({
      title: '提示',
      content: '真的真的确认删除该图片？此操作不可恢复哦？',
      onOk() {
        api.getMarketRpicDelete({id: item.id})
				refresh()
      },
      onCancel() {},
    })
  }

  const onSuccess = () => {
    refresh()
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '图片',
			dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (text, row) => (
      	<img
					width={200}
					src={text}
				/>
      )
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '标题',
			dataIndex: 'title',
      key: 'title',
    },
		{
		  title: '位置',
		  key: 'position',
			render: (a, row) => {
			  switch (row.position) {
			    case 1:
			    	return '商城轮播'
			    	break
			    case 2:
			    	return '主题活动入口'
			    	break
			    case 3:
			    	return '营销页'
			    	break
			    case 4:
			    	return '分销商品页'
			    	break
					default:
					  return row.position
			  }
			}
		},
    {
      title: '链接',
      dataIndex: 'linkUrl',
			render: (a, row) => {
			  switch (row.linkType) {
			    case 'inner':
			    	return '内链:' + row.linkUrl
			    	break
			    case 'outer':
			    	return '外链:' + row.linkUrl
			    	break
					default:
					  return row.linkType + row.linkUrl
			  }
			}
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row) => (
        <div>
          <Button onClick={() => onEdit(row)} type="link">
            编辑
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
        visible={visible.state}
        data={activeData}
        setVisible={visible.toggle}
        onOk={onSuccess}
      />
    </div>
  )
}

export default Company
