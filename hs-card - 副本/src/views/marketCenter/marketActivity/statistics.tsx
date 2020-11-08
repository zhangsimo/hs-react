/** @format */

import React, { useRef, useState, useEffect } from 'react'
// import {useRouteMatch} from 'react-router-dom'
import { Button, Spin, Table, Form, Input, Row, Col, Card, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
// import {IthemeDetails} from '@/interface'
import { useHistory } from 'react-router-dom'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
// import QRCode from 'qrcode.react'
import useAntdTable from '@/hooks/useAntdTable'
// import { ColumnProps } from 'antd/lib/table'
// import ThemeDetails from './components/themeDetails'
import { ITableResult, IUser } from '@/interface'
// import { CARD_APP_ROOT } from '@/config'
// import { useRequest } from '@umijs/hooks'
// import hasPermi from '@/components/directive'
import TeamBuyOrderList from './components/teamBuyOrderList'


const reg = /[\d- ]+/

const ActivityDataStatistics = () => {
	const history = useHistory()
	const query = history.location.search.substr(1).split("&").map(item => {
		var arr = item.split('=');
		return { [arr[0]]: arr[1] }
	})
	// console.log('queryqueryquery', query);
	const parmId = query[0].id
	const applyType = query[1].applyType
	const [form] = Form.useForm();
	// const [newCustomerArrivedStoreCount, setNewCustomerArrivedStoreCount] = useState<number>(0);
	// const [newCustomerReceiveCount, setNewCustomerReceiveCount] = useState<number>(0);
	const [openTuanData, setOpenTuanData] = useState<any>({ total: 0, success: 0, teaming: 0, fail: 0 });
	const [countData, setCountData] = useState<any>({ goodsAmount: 0, orderAmount: 0, saleAmount: 0 });

	const [starTime, setStarTime] = useState<string>('');
	const [endTime, setEndTime] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		reg.test(query[2].starTime) && setStarTime(query[1].starTime)
		reg.test(query[3].endTime) && setEndTime(query[2].endTime)
	}, [query])

	// const history = useHistory()
	const childRef = useRef();
	const updateChildState = (data) => {
		// changeVal就是子组件暴露给父组件的方法
		(childRef?.current as any)?.changeVal(data.id);
	}

	useEffect(() => {
		setLoading(true)
		api.getStatisticsData({ id: parmId }).then((res: any) => {
			if (res.code === 1) {
				setCountData(res.data)
				if (res.data.teamBuy) {
					setOpenTuanData(res.data.teamBuy)
				}

			}
			setLoading(false)
		}).catch(() => setLoading(false))
	}, [parmId])

	// const handerExportReportparams = (tableProps, from1) => {
	// 	return {
	// 		id: parmId,
	// 		page: tableProps.current,
	// 		pageSize: tableProps.pageSize,
	// 		name: from1.getFieldValue('name') || '',
	// 		mobile: from1.getFieldValue('mobile') || '',
	// 		brand: from1.getFieldValue('brand') || '',
	// 		carNo: from1.getFieldValue('carNo') || ''
	// 	}
	// }


	const getTableData = (tableParams, params) =>
		api.getTeamBuyList({ ...api.formatParams(tableParams, { ...params, activityId: parmId }) }).then(res => ({
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

	// const exportReport = () => {
	// 	const params = handerExportReportparams(tableProps.pagination, form)
	// 	api.exportData('oldCustomersShare', params)
	// }

	const setSuccess = (data) => {
		api.setTeamBuySuccess({ id: data.id }).then((res: any) => {
			if (res.code === 1) {
				message.success('设置成功')

			}
		}).catch((err) => message.success(err.msg))
	}

	const setFail = (data) => {
		api.setTeamBuyFail({ id: data.id }).then((res: any) => {
			if (res.code === 1) {
				message.success('设置成功')

			}
		}).catch((err) => message.success(err.msg))
	}

	const viewDetails = (data) => {
		updateChildState(data)
	}


	// 老客户分享的列数据
	const oldCcustoShareColumns: any = [
		{
			title: '序号',
			align: 'center',
			width: 80,
			render: (text, record, index) => `${index + 1}`
		},
		{
			title: '团长',
			align: 'center',
			dataIndex: 'teamerName',
			width: 200
		},
		{
			title: '开团时间',
			align: 'center',
			dataIndex: 'startTime',
			width: 250,
			// render: (val, row) => (
			// 	<div>
			// 		{row.startTime}-{row.endTime}
			// 	</div>
			// )
		},
		{
			title: '参团人数',
			dataIndex: 'joinAmount',
			align: 'center',
			width: 200,

		},
		{
			title: '购买数量',
			dataIndex: 'buyAmount',
			align: 'center',
			width: 200
		},
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center',
			width: 200,
			render: (a, row) => {
				let str: any = ''
				if (row.status == 1) {
					str = '拼团中'
				} else if (row.status == 2) {
					str = '成功'
				} else if (row.status == 99) {
					str = '失败'
				} else {
					str = '--'
				}
				return str
			},

		},
		{
			title: '结束时间',
			dataIndex: 'endTime',
			align: 'center',
			width: 200
		}, {
			title: '操作',
			dataIndex: 'receiveCount',
			align: 'center',
			width: 250,
			render: (a, row: any) => {
				return (
					<div>
						{row.status == 1 ? <Button type="link" onClick={() => setSuccess(row)} >
							使成功
                </Button> : null
						}

						{row.status == 1 ? <Button type="link" onClick={() => setFail(row)} >
							使失败
                </Button> : null
						}

						<Button type="link" onClick={() => viewDetails(row)} >
							查看此团订单
                </Button>
					</div >
				)
			},
		}
	]

	const cardBodyCss: React.CSSProperties = {
		'textAlign': 'center',
		'fontWeight': 'bold',
		fontSize: '20px'
	}
	const cardHeaderCss: React.CSSProperties = {
		'textAlign': 'center',
	}

	return (
		<div>
			<Spin spinning={loading}>
				<h2>{decodeURI(query[4]?.theme)} <span style={{ fontSize: '12px', color: '#999' }}>{(starTime && endTime) ? `${query[1]?.starTime} 至 ${query[2]?.endTime}` : '永久有效'}</span></h2>
				<div>
					<Row gutter={16}>
						{applyType == '4' ?
							< Col span={6}>
								<Card title="开团次数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{openTuanData.total}
									<p style={{ fontSize: '12px', position: 'absolute', left: 0, textAlign: 'center', width: '100%' }} >成功:{openTuanData.success} ，失败：{openTuanData.fail} ，进行中：{openTuanData.teaming}</p>
								</Card>

							</Col> : null}

						<Col span={applyType == '4' ? 6 : 8}>
							<Card title="订单数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{countData.orderAmount}</Card>
						</Col>
						<Col span={applyType == '4' ? 6 : 8}>
							<Card title="已售商品数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{countData.goodsAmount}</Card>
						</Col>
						<Col span={applyType == '4' ? 6 : 8}>
							<Card title="销售金额" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{countData.saleAmount}</Card>
						</Col>
					</Row>
				</div>
				{applyType == '4' ? <div>
					<h2 style={{ marginTop: '30px' }}>开团列表</h2>
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
									{/* <Button type="primary" icon={<DownloadOutlined />} disabled={hasPermi('getCard:list:import')} onClick={() => exportReport()}>导出</Button> */}
								</div>
							</Form.Item>
						</Form>
					</ToolsBar>

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
				</div> : null}

				<TeamBuyOrderList cRef={childRef} activityId={parmId}></TeamBuyOrderList>



			</Spin>
		</div >
	)
}

export default ActivityDataStatistics
