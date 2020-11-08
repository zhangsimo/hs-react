/** @format */

import React, { useState, useEffect } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { Form, Input, Button, Table, DatePicker, Select, Spin } from 'antd'
import * as api from '@/api'
import dayjs from 'dayjs'
// import { useForm } from 'antd/lib/form/util'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import { useHistory } from 'react-router-dom'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import hasPermi from '@/components/directive'
const chargebackStatus:any = [
	{ id: 1, name: '待审核' },
	{ id: 2, name: '已退款' },
	{ id: 3, name: '待退款' },
	{ id: 4, name: '已作废' },
]
const chargebackType:any = [
	{ id: 'only_refund', name: '仅退款' },
	{ id: 'refund_goods', name: '退货退款' },
	{ id: 'claim_refund', name: '索赔退单' },
]
interface IProps {
	orderType
}

const ChargebackList: React.FC<IProps> = props => {
	const [loading, setLoading] = useState<boolean>(true)
	const [form] = Form.useForm()
	const history = useHistory()
	const { RangePicker } = DatePicker
	useEffect(() => {
		if (props.orderType) {
			console.log(props.orderType)
		}
	}, [props.orderType])
	const getTableData = (tableParams, params) => api.getOrderRefundPage({ ...api.formatParams(tableParams, params), ...{ orderChannel: props.orderType } }).then(res => {
		setLoading(false)
		return {
			list: res.data.items,
			total: res.data.total,
		}
	})
	const { tableProps, search, } = useAntdTable<ITableResult<any>, any>(getTableData, {
		defaultPageSize: 20,
		form,
	})
	const { submit } = search || {}
	const onSearch = () => {
		submit()
	}
	const reSet = () => {
		form.resetFields()
		submit()
	}
	const onDetail = row => {
		history.push(`/ordermanage/chargebackdetail?refundId=${row.refundId}`)
	}

	// 日期框滚动下拉固定
	const datePicketScollFixed = (trigger) => {
		return trigger.parentNode || document.body;
	}
	const columns: ColumnProps<any>[] = [
		{
			title: '退单号',
			dataIndex: 'refundCode',
			width: '160px',
			fixed: 'left'
		},
		{
			title: '关联单号',
			dataIndex: 'orderId',
			width: '160px'
		},
		{
			title: '销售门店',
			dataIndex: 'compName',
			width: '140px'
		},
		{
			title: '用户名称',
			dataIndex: 'realName',
			width: '140px'
		},
		{
			title: '用户电话号',
			dataIndex: 'userPhone',
			width: '140px'
		},
		{
			title: '车牌号',
			dataIndex: 'carNo',
			align: 'center',
			width: '120px'
		},
		{
			title: '订单来源',
			dataIndex: 'orderChannel',
			align: 'center',
			width: '100px',
			render: (a, row) => {
				switch (row.orderChannel) {
					case 'micro_mall':
						return '微商城'
						break;
					case 'offline_store':
						return '线下门店'
						break;
					default:
						return ''
				}
			},
		},
		{
			title: '退单类型',
			dataIndex: 'refundType',
			align: 'center',
			width: '100px',
			render: (a, row) => {
				for (let i in chargebackType) {
					if (row.refundType == chargebackType[i].id) {
						return chargebackType[i].name
					}
				}
			}
		},
		{
			title: '退单状态',
			dataIndex: 'refundStatus',
			align: 'center',
			width: '100px',
			render: (a, row) => {
				for (let i in chargebackStatus) {
					if (row.refundStatus == chargebackStatus[i].id) {
						return chargebackStatus[i].name
					}
				}
			},
		},

		{
			title: '退款金额',
			dataIndex: 'refundAmt',
			align: 'right',
			width: '100px'
		},
		{
			title: '退款方式',
			dataIndex: 'refundMethod',
			align: 'center',
			width: '100px',
			render: (a, row) => {
				switch (row.refundMethod) {
					case 'WX':
						return '微信退款'
						break;
					case 'unknown':
						return '未知'
						break;
					default:
						return ''
				}
			},
		},

		{
			title: '创建人',
			dataIndex: 'createBy',
			width: '100px'
		},
		{
			title: '创建时间',
			dataIndex: 'createDate',
			align: 'center',
			width: '150px',
			render: (a, row) => {
				return dayjs(row.createDate).format('YYYY-MM-DD hh:mm')
			}
		},
		{
			title: '退款时间',
			dataIndex: 'refundDate',
			align: 'center',
			width: '150px'
		},
		{
			title: '操作',
			align: 'center',
			dataIndex: 'payState',
			width: '70px',
			fixed: 'right',
			render: (value, row) => {
				return (
					<Button type="link" onClick={() => onDetail(row)}>详情</Button>
				)
			},
		},
	]
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		},
		getCheckboxProps: record => ({
			disabled: record.name === 'Disabled User', // Column configuration not to be checked
			name: record.name,
		}),
	};

	return (
		<div className='orderList'>
			<Spin spinning={loading}>
				<ToolsBar>
					<Form layout="inline" form={form}>
						<Form.Item name="refundCode">
							<Input placeholder="请输入退单号" allowClear style={{ width: 160 }}></Input>
						</Form.Item>
						<Form.Item name="orderId">
							<Input placeholder="关联单号" allowClear style={{ width: 160 }}></Input>
						</Form.Item>
						<Form.Item name="realName" >
							<Input placeholder="请输入用户" allowClear style={{ width: 160 }}></Input>
						</Form.Item>
						<Form.Item name="carNo">
							<Input placeholder="请输入车牌号" allowClear style={{ width: 160 }}></Input>
						</Form.Item>
						<Form.Item name="refundType">
							<Select allowClear placeholder="请选择退单类型" style={{ width: 160 }} >
								{chargebackType.map(item => (
									<Select.Option value={item.id}>{item.name}</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item name="refundStatus">
							<Select allowClear placeholder="请选择退单状态" style={{ width: 160 }} >
								{chargebackStatus.map(item => (
									<Select.Option value={item.id}>{item.name}</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item name="createBy" >
							<Input placeholder="请输入创建人" allowClear style={{ width: 160 }}></Input>
						</Form.Item>
						<Form.Item>
							<RangePicker
								style={{ width: 260 }}
								placeholder={['创建开始时间', '创建截止时间']}
								getPopupContainer={datePicketScollFixed}
								onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'startTime', 'endTime')}
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" icon={<SearchOutlined />} onClick={onSearch} disabled={hasPermi('ordermanage:orderList:search')}>
								搜索
						</Button>
							<Button
								type="primary"
								onClick={reSet}
								icon={<ReloadOutlined />}
								disabled={hasPermi('ordermanage:orderList:search')}>
								重置
						</Button>
						</Form.Item>
					</Form>
				</ToolsBar>
				{/*<div>
					<Button
						type="primary"
						onClick={reSet}>
						退单审核
				</Button>
				</div>*/}
				<div style={{ backgroundColor: 'white', marginTop: '12px' }}>
					<Table
						size="middle"
						rowSelection={rowSelection}
						columns={columns}
						{...tableProps}
						rowKey="refundId"
						expandIconColumnIndex={-1}
						defaultExpandAllRows={true}
						scroll={{ x: 1000 }}
						pagination={{
							showSizeChanger: true,
							total: tableProps.pagination.total,
							current: tableProps.pagination.current,
							showTotal: total => `共 ${total} 条`,
							pageSize: tableProps.pagination.pageSize,
						}}
					/>
				</div>
			</Spin>
		</div>
	)
}
export default ChargebackList
