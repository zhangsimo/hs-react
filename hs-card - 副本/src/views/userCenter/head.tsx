/** @format */
import React from 'react'
import * as api from '@/api'
import {Form, Button, Row, Col, Space, Table} from 'antd'
import {useHistory} from 'react-router-dom'
import { ColumnProps } from 'antd/lib/table'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import SelectComp from '@/components/Select/comp'
import ToolsBar from '@/components/ToolsBar'
import hasPermi from '@/components/directive'
import useAntdTable from '@/hooks/useAntdTable'
import { ICardDetail, ITableResult } from '@/interface'

const Company = () => {
	const [form] = Form.useForm()
	const history = useHistory()
	const getOrgCompTable = (tableParams, params) =>
		api.getOrgCompList({...api.formatParams(tableParams, params)}).then(res => {
			console.log(889, res.data)
			let data:any = res.data
			for (let i in data) {
				if (data[i].compCode == 'COM00000000000001') {
					data.splice(i,1)
				}
			}
			return {
				list: data,
				total: res.data.total,
			}
		})
	
	const {tableProps, search} = useAntdTable<ITableResult<ICardDetail>, ICardDetail>(getOrgCompTable, {
		defaultPageSize: 20,
		form,
	})
	
	const { submit } = search || {}
	const onSearch = () => {
		form.validateFields().then(res => {
			
			submit()
		})
	}
	
	const columns: ColumnProps<any>[] = [{
	  title: '门店',
	  dataIndex: 'compName',
	  key: 'compName',
	  width: '180',
	}, {
	  title: '所在区域',
	  dataIndex: 'areaName',
	  key: 'areaName',
	  width: '120',
	},{
		title: '操作',
		key: 'operation',
		align: 'center',
		width: '110',
		render: (text, record) => (
			<Button type="link" onClick={() => onDetail(record)}>查看</Button>
		)
	}];
	
	const reSet = () => {
	  form.resetFields()
	  submit()
	}

	const onDetail = row => {
		history.push(`/userCenter/store?compCode=${row.compCode}&compName=${row.compName}`)
	}
	return (
		<div style={{overflow: 'auto'}}  className="block customerlist">
			<div className="block_title">
				<Row>
					<Col span={19}>
						<span className="borderlf">会员中心 > 绩效配置 > 总部</span>
					</Col>
				</Row>
			</div>
			<ToolsBar>
				<Form layout="inline" form={form}>
					<Form.Item name="compCode">
						<SelectComp
							showSearch
							allowClear
							placeholder="请选择门店"
							filterOption={(input, option) => option?.children.indexOf(input) >= 0}
							style={{ width: 234 }}/>
					</Form.Item>
					<Form.Item>
						<Space size="middle">
							<Button
								
								type="primary"
								onClick={onSearch}
								icon={<SearchOutlined />}
								disabled={hasPermi('customer:list:search')}>
								搜索
							</Button>
						</Space>
						<Space size="middle">
							<Button
								type="primary"
								onClick={reSet}
								icon={<ReloadOutlined />}
								disabled={hasPermi('customer:list:search')}>
								重置
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</ToolsBar>
			
			<div style={{ backgroundColor: 'white', marginTop: '12px' }}>
				<Table columns={columns}
					{...tableProps}
					rowKey={record => record.compCode}
					bordered
				/>
			</div>
		</div>
	)
}

export default Company
