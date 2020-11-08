/** @format */
import React from 'react'
import * as api from '@/api'
import {Form, Button, Row, Col, Space, Table, Select, Input} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import SelectComp from '@/components/Select/comp'
import ToolsBar from '@/components/ToolsBar'
import hasPermi from '@/components/directive'
import useAntdTable from '@/hooks/useAntdTable'
import { ICardDetail, ITableResult } from '@/interface'

const CommissionCompany = () => {
	const [form] = Form.useForm()
	const groupTypeList = [
		{ id: 'OPS001', name: '待付款' },
		{ id: 'OPS002', name: '已付款' },
		{ id: 'OPS003', name: '申请退款' },
		{ id: 'OPS004', name: '已退款' },
		{ id: 'unknown', name: '未知' }
	]
	
	const postCommissionRecordList = (tableParams, params) =>
		api.postCommissionRecordPage({...api.formatParams(tableParams, params)}).then(res => {
			return {
				list: res.data.items,
				total: res.data.total,
			}
		})
	
	const {tableProps, search} = useAntdTable<ITableResult<ICardDetail>, ICardDetail>(postCommissionRecordList, {
		defaultPageSize: 20,
		form,
	})
	
	const { submit } = search || {}
	const onSearch = () => {
		form.validateFields().then(res => {
			submit()
		})
	}
	const convertPayState = (val) => {
		let showText = ''
		for (let i in groupTypeList) {
			if (groupTypeList[i].id == val) {
				showText = groupTypeList[i].name
			}
		}
		return showText
	}
	const fixedLeft:any = 'left'
	const columns: ColumnProps<any>[] = [{
	  title: '员工工号',
	  dataIndex: 'employeeCode',
	  key: 'employeeCode',
	  fixed: fixedLeft,
	  width: 180,
	  ellipsis: true,
	},{
	  title: '员工姓名',
	  dataIndex: 'employeeName',
	  key: 'employeeName',
	  fixed: fixedLeft,
	  width: 100,
	  ellipsis: true,
	}, {
	  title: '职位',
	  dataIndex: 'employeePosition',
	  key: 'employeePosition',
	  width: 120,
	  ellipsis: true,
	},{
		title: '门店',
		dataIndex: 'compName',
		key: 'compName',
		ellipsis: true,
		width: 180
	},{
		title: '订单号',
		dataIndex: 'orderId',
		ellipsis: true,
		width: 280
	},{
		title: '支付状态',
		dataIndex: 'payState',
		width: 91,
		render: (text, record) => (
			convertPayState(record.payState)
		)
	},{
		title: '工单号',
		dataIndex: 'workId',
		ellipsis: true,
		width: 280
	},{
		title: '项目名称',
		dataIndex: 'itemName',
		ellipsis: true,
		width: 160
	},{
		title: '数量',
		dataIndex: 'quantity',
		width: 100
	},{
		title: '原价(元)',
		dataIndex: 'originalPrice',
		width: 100
	},{
		title: '售价(元)',
		dataIndex: 'price',
		width: 100
	},{
		title: '提成(元)',
		dataIndex: 'commissionAmount',
		width: 137
	},{
		title: '提成类型',
		dataIndex: 'commissionRole',
		width: 127
	},{
		title: '时间',
		dataIndex: 'updateTime',
		width: 160
	}];
	
	const reSet = () => {
	  form.resetFields()
	  submit()
	}

	return (
		<div style={{overflow: 'auto'}}  className="block customerlist">
			<div className="block_title">
				<Row>
					<Col span={19}>
						<span className="borderlf">会员中心 > 绩效配置 > 员工提成明细</span>
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
					<Form.Item name="employeeName">
						<Input placeholder="请输入员工姓名" allowClear style={{ width: '180px' }}></Input>
					</Form.Item>
					<Form.Item name="employeeCode">
						<Input placeholder="请输入员工工号" allowClear style={{ width: '180px' }}></Input>
					</Form.Item>
					<Form.Item name="payState">
						<Select allowClear placeholder="请选择支付状态" style={{ width: 150 }} >
							{groupTypeList.map((item, i) => (
							  <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item>
						<Space size="middle">
							<Button
								type="primary"
								icon={<SearchOutlined />}
								onClick={onSearch}
								disabled={hasPermi('customer:list:search')}>
								搜索
							</Button>
						</Space>
						<Space size="middle">
							<Button
								type="primary"
								icon={<ReloadOutlined />}
								onClick={reSet}
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
					rowKey={record => record.id}
					bordered
					scroll={{ x: 1000 }}
				/>
			</div>
		</div>
	)
}

export default CommissionCompany
