/** @format */

import React, { useState, useEffect } from 'react'
// import {useRouteMatch} from 'react-router-dom'
import { Button, Spin, Table, Form, Input, Row, Col, Card } from 'antd'
import {SearchOutlined, DownloadOutlined} from '@ant-design/icons'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
// import {IthemeDetails} from '@/interface'
import { useHistory } from 'react-router-dom'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
// import QRCode from 'qrcode.react'
import useAntdTable from '@/hooks/useAntdTable'
import { ColumnProps } from 'antd/lib/table'
// import ThemeDetails from './components/themeDetails'
import { ITableResult, IUser } from '@/interface'
// import { CARD_APP_ROOT } from '@/config'
// import { useRequest } from '@umijs/hooks'
import hasPermi from '@/components/directive'
// import Meta from 'antd/lib/card/Meta'
// const { RangePicker } = DatePicker
// const confirm = Modal.confirm
const reg = /[\d- ]+/

const ActivityDataStatistics = () => {
	const history = useHistory()
	const query = history.location.search.substr(1).split("&").map(item => {
		var arr = item.split('=');
		return {[arr[0]]: arr[1]}
	})
	// console.log('queryqueryquery', query);
	const parmId = query[0].id
	const [form] = Form.useForm();
	const [newCustomerArrivedStoreCount, setNewCustomerArrivedStoreCount] = useState<number>(0);
	const [newCustomerReceiveCount, setNewCustomerReceiveCount] = useState<number>(0);
	const [oldCustomerShareCount, setOldCustomerShareCount] = useState<number>(0);
	const [starTime, setStarTime] = useState<string>('');
	const [endTime, setEndTime] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		reg.test(query[1].starTime) && setStarTime(query[1].starTime)
		reg.test(query[2].endTime) && setEndTime(query[2].endTime)
	}, [query])


	useEffect(() => {
		setLoading(true)
		api.overviewActivityInformation({activityId: parmId}).then((res:any) => {
			if (res.code === 1) {
				// console.log('resresresres', res);
				setNewCustomerArrivedStoreCount(res.data.newCustomerArrivedStoreCount)
				setNewCustomerReceiveCount(res.data.newCustomerReceiveCount)
				setOldCustomerShareCount(res.data.oldCustomerShareCount)
			}
			setLoading(false)
		}).catch(() => setLoading(false))
	}, [parmId])
	
	const handerExportReportparams = (tableProps, from1) => {
		return {
			activityId: parmId,
			page: tableProps.current,
			pageSize: tableProps.pageSize,
			name: from1.getFieldValue('name') || '',
			mobile: from1.getFieldValue('mobile') || '',
			brand: from1.getFieldValue('brand') || '',
			carNo: from1.getFieldValue('carNo') || ''
		}
	}
	

	const getTableData = (tableParams, params) =>
		api.oldCustomersShareDetails({ ...api.formatParams(tableParams, {...params, activityId: parmId}) }).then(res => ({
			list: res.data.items,
			total: res.data.total
		}))
	
	const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
		defaultPageSize: 10,
		form
	})

	const { submit } = search || {}

	const searchBt = () => {
		submit()
	}

    const exportReport = () => {
		const params = handerExportReportparams(tableProps.pagination, form)
		api.exportData('oldCustomersShare', params)
    }

	// 老客户分享的列数据
	const oldCcustoShareColumns: ColumnProps<IUser>[] = [
		{
			title: '序号',
			align: 'center',
			width: 200,
			render: (text, record, index) => `${index + 1}`
		},
		{
			title: '客户姓名',
			align: 'center',
			dataIndex: 'name',
			width: 200
		},
		{
			title: '手机号',
			align: 'center',
			dataIndex: 'mobile',
			width: 200
		},
		{
			title: '归属员工',
			dataIndex: 'employees',
			align: 'center',
			width: 200,
			render: val => (
				<div>
					{val.map(item => <div key={item.employeeName} style={{whiteSpace: 'nowrap'}}>{item.employeeName + '，' + item.compName}</div>)}
				</div>
			)
		},
		{
			title: '累计分享次数',
			dataIndex: 'shareCount',
			align: 'center',
			width: 200
		},
		{
			title: '被领取次数',
			dataIndex: 'receiveCount',
			align: 'center',
			width: 200
		}
	]

	const cardBodyCss:React.CSSProperties = {
		'textAlign': 'center',
		'fontWeight': 'bold',
		fontSize: '20px'
	}
	const cardHeaderCss:React.CSSProperties = {
		'textAlign': 'center',
	}

	return (
		<div>
			<Spin spinning={loading}>
			<h2>{decodeURI(query[3]?.theme)} <span>{(starTime && endTime) ? `${query[1]?.starTime} 至 ${query[2]?.endTime}` : '永久有效'}</span></h2>
                <div>
                    <Row gutter={16}>
                        <Col span={8}>
							<Card title="老客户分享次数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{oldCustomerShareCount}</Card>
                        </Col>
                        <Col span={8}>
							<Card title="新客户领取人数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{newCustomerReceiveCount}</Card>
                        </Col>
                        <Col span={8}>
							<Card title="新客户到店人数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{newCustomerArrivedStoreCount}</Card>
                        </Col>
                    </Row>
                </div>
                <h2 style={{marginTop: '30px'}}>老客户分享明细</h2>
				<ToolsBar visible={false}>
					<Form form={form} layout="inline">
						<Form.Item name="name" label="客户姓名">
							<Input placeholder="请输入客户姓名" style={{ width: '150px' }} allowClear></Input>
						</Form.Item>
						<Form.Item name="mobile" label="手机号">
							<Input placeholder="请输入手机号" style={{ width: '150px' }} allowClear></Input>
						</Form.Item>
						<Form.Item>
							<div>
								<Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>搜索</Button>
								<Button type="primary" icon={<DownloadOutlined />} disabled={hasPermi('getCard:list:import')} onClick={() => exportReport()}>导出</Button>
							</div>
						</Form.Item>
					</Form>
				</ToolsBar>
				{/* 表格内容 */}
				<div className="tableConent">
					<Table
						columns={oldCcustoShareColumns}
						rowKey="customerId"
						{...tableProps}
						bordered
						// pagination={{
						// 	total: tableProps.pagination.total,
						// 	showTotal: total => `共 ${total} 条`,
						// 	pageSize: tableProps.pagination.pageSize,
						// 	showSizeChanger: true,
						// }}
					/>
				</div>
				{(() => {
					const [form] = Form.useForm();
					const getTableData = (tableParams, params) =>
						api.newCustomersReceiveDetails({ ...api.formatParams(tableParams, {...params, activityId: parmId}) }).then(res => ({
							list: res.data.items,
							total: res.data.total
						}))
					
					const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
						defaultPageSize: 10,
						form
					})

					const { submit, reset } = search || {}

					const searchBt = () => {
						submit()
					}

					useEffect(() => {
						reset()
					}, [parmId])

					const newCustomersReceiveConlums: ColumnProps<IUser>[] = [
						{
							title: '序号',
							align: 'center',
							dataIndex: 'customerId',
							width: 200,
							render: (text, record, index) => `${index + 1}`
						},
						{
							title: '客户姓名',
							align: 'center',
							dataIndex: 'name',
							width: 200
						},
						{
							title: '手机号',
							align: 'center',
							dataIndex: 'mobile',
							width: 200
						},
						{
							title: '厂牌',
							align: 'center',
							dataIndex: 'brand',
							width: 200
						},
						{
							title: '车牌',
							align: 'center',
							dataIndex: 'carNo',
							width: 200
						},
						{
							title: '归属老客户',
							align: 'center',
							dataIndex: 'oldCustomerName',
							width: 200
						},
						{
							title: '老客户手机',
							align: 'center',
							dataIndex: 'oldCustomerMobile',
							width: 200
						},
						{
							title: '归属员工',
							dataIndex: 'employees',
							align: 'center',
							width: 200,
							render: val => (
								<div>
									{val.map(item => <div key={item.employeeName} style={{whiteSpace: 'nowrap'}}>{item.employeeName + '，' + item.compName}</div>)}
								</div>
							)
						},
						{
							title: '领取时间',
							align: 'center',
							dataIndex: 'receiveTime',
							width: 200
						},
						{
							title: '领取内容',
							align: 'center',
							dataIndex: 'content',
							width: 200
						},
						{
							title: '是否到店',
							align: 'center',
							dataIndex: 'arrivedStore',
							width: 200,
							render: val => val ? '已到店' : '未到店'
						},
						{
							title: '卡券核销时间',
							dataIndex: 'veriTime',
							align: 'center',
							width: 200
						}
					]

					const clickExportReport = () => {
						const params = handerExportReportparams(tableProps.pagination, form)
						api.exportData('newCustomerReceives', params)
					}

					return (
						<div>
							<h2>新客户领取明细</h2>
							<ToolsBar visible={false}>
								<Form form={form} layout="inline">
									<Form.Item name="name" label="客户姓名">
										<Input placeholder="请输入客户姓名" style={{ width: '150px' }} allowClear></Input>
									</Form.Item>
									<Form.Item name="mobile" label="手机号">
										<Input placeholder="请输入手机号" style={{ width: '150px' }} allowClear></Input>
									</Form.Item>
									<Form.Item name="brand" label="车辆品牌">
										<Input placeholder="请输入车辆品牌" style={{ width: '150px' }} allowClear></Input>
									</Form.Item>
									<Form.Item name="carNo" label="车牌">
										<Input placeholder="请输入车牌" style={{ width: '150px' }} allowClear></Input>
									</Form.Item>
									<Form.Item>
										<div>
											<Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>搜索</Button>
											<Button type="primary" icon={<DownloadOutlined />} disabled={hasPermi('getCard:list:import')} onClick={() => clickExportReport()}>导出</Button>
										</div>
									</Form.Item>
								</Form>
							</ToolsBar>
							{/* 表格内容 */}
							<div className="tableConent">
								<Table
									columns={newCustomersReceiveConlums}
									rowKey="customerId"
									{...tableProps}
									bordered
									// pagination={{
									// 	total: tableProps.pagination.total,
									// 	showTotal: total => `共 ${total} 条`,
									// 	pageSize: tableProps.pagination.pageSize,
									// 	showSizeChanger: true,
									// }}
								/>
							</div>
						</div>
					)
				})()}
				{
					(() => {
						const [form] = Form.useForm();

						const oldCustomersReceiveConlums: ColumnProps<IUser>[] = [
							{
								title: '序号',
								align: 'center',
								width: 200,
								render: (text, record, index) => `${index + 1}`
							},
							{
								title: '客户姓名',
								align: 'center',
								dataIndex: 'name',
								width: 200
							},
							{
								title: '手机号',
								align: 'center',
								dataIndex: 'mobile',
								width: 200
							},
							{
								title: '厂牌',
								align: 'center',
								dataIndex: 'brand',
								width: 200
							},
							{
								title: '车牌',
								align: 'center',
								dataIndex: 'carNo',
								width: 200
							},
							{
								title: '归属员工',
								dataIndex: 'employees',
								align: 'center',
								width: 200,
								render: val => (
									<div>
										{val.map(item => <div key={item.employeeName} style={{whiteSpace: 'nowrap'}}>{item.employeeName + '，' + item.compName}</div>)}
									</div>
								)
							},
							{
								title: '领取时间',
								dataIndex: 'receiveTime',
								width: 200
							},
							{
								title: '领取内容',
								dataIndex: 'content',
								width: 200
							},
							{
								title: '是否到店',
								dataIndex: 'arrivedStore',
								width: 200,
								render: val => val ? '已到店' : '未到店'
							},
							{
								title: '卡券核销时间',
								dataIndex: 'veriTime',
								width: 200
							}
						]

						const getTableData = (tableParams, params) =>
							api.oldCustomersReceiveDetails({ ...api.formatParams(tableParams, {...params, activityId: parmId}) }).then(res => ({
								list: res.data.items,
								total: res.data.total
							}))
						
						const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
							defaultPageSize: 10,
							form
						})

						const { submit, reset } = search || {}

						const searchBt = () => {
							submit()
						}

						useEffect(() => {
							reset()
						}, [parmId])
						
						const clickExportReport = () => {
							const params = handerExportReportparams(tableProps.pagination, form)
							api.exportData('oldCustomerReceives', params)
						}

						return (
							<div>
								<h2>老客户领取明细表</h2>
								<ToolsBar visible={false}>
									<Form form={form} layout="inline">
										<Form.Item name="name" label="客户姓名">
											<Input placeholder="请输入客户姓名" style={{ width: '150px' }} allowClear></Input>
										</Form.Item>
										<Form.Item name="mobile" label="手机号">
											<Input placeholder="请输入手机号" style={{ width: '150px' }} allowClear></Input>
										</Form.Item>
										<Form.Item name="carNo" label="车牌">
											<Input placeholder="请输入车号" style={{ width: '150px' }} allowClear></Input>
										</Form.Item>
										<Form.Item>
											<div>
												<Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>搜索</Button>
												<Button type="primary" icon={<DownloadOutlined />} disabled={hasPermi('getCard:list:import')} onClick={() => clickExportReport()}>导出</Button>
											</div>
										</Form.Item>
									</Form>
								</ToolsBar>
								{/* 表格内容 */}
								<div className="tableConent">
									<Table
										columns={oldCustomersReceiveConlums}
										rowKey="customerId"
										{...tableProps}
										bordered
										// pagination={{
										// 	total: tableProps.pagination.total,
										// 	showTotal: total => `共 ${total} 条`,
										// 	pageSize: tableProps.pagination.pageSize,
										// 	showSizeChanger: true,
										// }}
									/>
								</div>
							</div>
						)
					})()
				}
			</Spin>
		</div>
	)
}

export default ActivityDataStatistics
