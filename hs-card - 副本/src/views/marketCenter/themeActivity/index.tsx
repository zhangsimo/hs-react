/** @format */

// import React from 'react'
import React, { useState, useEffect } from 'react'
// import {useRouteMatch} from 'react-router-dom'
import { Button, Modal, message, Spin, Table, Form, Input, Select, DatePicker } from 'antd'

import ToolsBar from '@/components/ToolsBar'
import * as api from '@/api'
// import {IthemeDetails} from '@/interface'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'qrcode.react'
import useAntdTable from '@/hooks/useAntdTable'
import { ColumnProps } from 'antd/lib/table'
// import ThemeDetails from './components/themeDetails'
import { ITableResult, IUser } from '@/interface'
import { CARD_APP_ROOT } from '@/config'
// import { useRequest } from '@umijs/hooks'
import {
	SearchOutlined,
	ExclamationCircleOutlined,
	DollarCircleOutlined,
	PoweroffOutlined
} from '@ant-design/icons'
// import { divide } from 'lodash'
// import Meta from 'antd/lib/card/Meta'
const { RangePicker } = DatePicker
const confirm = Modal.confirm

const Theme = () => {
	// const routeMatch = useRouteMatch<{id: string}>()
	const history = useHistory()
	const [form] = Form.useForm()
	const random = history.location.search.split('=')[1]
	const [loading, setLoading] = useState<boolean>(false)

	const onAdd = () => {
		const turl = `/activity/newActivity`
		history.push(turl)
	}

	const copyLink = e => {
		// console.log(e)
		message.success('复制成功')
	}

	const getActivitytype = type => type.type === 1 ? '主题活动' : '转介绍活动'

	const copyMa = id => {
		const canvasImg: any = document.getElementById('qrCode' + id) // 获取canvas类型的二维码
		const img = new Image()
		img.src = canvasImg?.toDataURL('image/png') // 将canvas对象转换为图片的data url
		const downLink: any = document.getElementById('down_link' + id)
		downLink.href = img.src
		downLink.download = '二维码' // 图片name
	}


	const getTableData = (tableParams, params) => {
		// console.log('tableParams', tableParams, 'params', params);
		setLoading(true)
		return api.getActivityThemeList({ ...api.formatParams(tableParams, { ...params, classify: 1 }) }).then(res => {
			setLoading(false)
			return {
				list: res.data.items,
				total: res.data.total
			}
		}).catch(() => {
			setLoading(false)
		})
	}

	const { tableProps, search } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
		defaultPageSize: 10,
		form
	})

	// console.log('tablePropstableProps', tableProps);

	const { submit, reset } = search || {}

	useEffect(() => {
		reset()
	}, [random])


	// 点击编辑按钮
	const onEdit = row => {
		// console.log('form', form.getFieldValue());
		const turl = `/activity/themeStape?id=${row.id}`
		history.push(turl)
	}
	// 点击发布按钮
	const onPublish = row => {
		confirm({
			title: '发布活动',
			icon: <DollarCircleOutlined />,
			content: '即将发布' + row.theme + '- ' + getActivitytype(row),
			onOk() {
				api.releaseActivity({ id: row.id }).then((res: any) => {
					if (res.code == 1) {
						message.success('发布成功')
						submit()
					}
				})
			},
			onCancel() {
				message.info('取消发布活动')
			},
		})
	}
	// 点击删除按钮
	const onDelete = row => {
		console.log('点击删除按钮', row);
		confirm({
			title: '确定删除?',
			icon: <ExclamationCircleOutlined />,
			content: '即将删除' + row.theme + '- ' + getActivitytype(row),
			onOk() {
				let params = {
					id: row.id,
				}
				api.delActivityTheme(params).then((res: any) => {
					if (res.code == 1) {
						message.success('删除成功')
						submit()
					}
				})
			},
			onCancel() {
				message.info('感谢不删之恩')
			},
		})
	}
	// 数据统计
	const onDataStatistics = row => {
		console.log('点击了数据统计', row);
		const seach = 'id=' + row.id + '&starTime=' + (row.startTime || '') + '&endTime=' + (row.endTime || '') + '&theme=' + row.theme
		history.push('/activity/activityDataStatistics?' + seach)
	}

	// 使失效、下架
	const onUnpublish = row => {
		console.log('使失效、下架', row);
		confirm({
			title: '活动失效',
			icon: <PoweroffOutlined />,
			content: '确定要失效 ' + row.theme + ' - ' + getActivitytype(row) + ' ???',
			onOk() {
				api.unpublish({ id: row.id }).then((res: any) => {
					if (res.code == 1) {
						message.success('失效成功')
						submit()
					}
				})
			},
			onCancel() {
				message.info('取消失效活动')
			},
		})
	}

	const searchBt = () => {
		submit()
	}

	const onViewDetails = row => {
		history.push('/activity/activityDetails?id=' + row.id)
	}

	const columns: ColumnProps<IUser>[] = [
		{
			title: '编号',
			dataIndex: 'id',
			align: 'center',
			width: 50,
			render: (a, b, i) => i + 1
		},
		{
			title: '活动主题',
			dataIndex: 'theme',
			align: 'center',
			width: 200
		},

		{
			title: '活动类型',
			dataIndex: 'type',
			align: 'center',
			width: 200,
			render: (status: any): string => {
				return status === 1 ? '主题活动' : '转介绍活动'
			},
		},
		{
			title: '有效时间',
			dataIndex: 'createTime',
			align: 'center',
			width: 220,
			render: (status: any, row: any): any => {
				return (
					<div>
						{row.validType === 2 ? '永久有效' : (
							<div>
								<div>{row.startTime}</div>
								<div>至</div>
								<div>{row.endTime}</div>
							</div>
						)}
					</div>
				)
			}
		},
		{
			title: '发布渠道',
			dataIndex: 'channelName',
			align: 'center',
			width: 200,
			render: (status: any, row: any): any => (
				<div>
					{row.channelList.map((item, ind) => (<div key={item.channelName} style={{ whiteSpace: 'nowrap' }}>{item.channelName}</div>))}
				</div>
			)
		},
		{
			title: '创建人',
			dataIndex: 'createBy',
			align: 'center',
			width: 200
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			align: 'center',
			width: 200
		},
		{
			title: '发布状态',
			dataIndex: 'issueStatus',
			align: 'center',
			width: 200,
			render: (status: any): string => {
				return status === 0 ? '未发布' : status === 1 ? '已发布' : '下架'
			}
		},
		{
			title: '活动状态',
			dataIndex: 'status',
			align: 'center',
			width: 180,
			render: (status: any): string => {
				switch (status) {
					case 0:
						return '未开始'
					case 1:
						return '进行中'
					case 2:
						return '已结束'
					default:
						return '-'
				}
			},
		},
		{
			title: '操作',
			key: 'action',
			width: 300,
			align: 'center',
			fixed: 'right',
			render: (row: any) => (
				<div>
					{/* issueStatus 发布状态{0:未发布,1:已发布,2:下架} */}
					{[0, 2].includes(+row.issueStatus) ? (<Button onClick={() => onEdit(row)} type="link">编辑</Button>) : null}
					{[0, 2].includes(+row.issueStatus) ? (<Button onClick={() => onPublish(row)} type="link">发布</Button>) : null}
					{+row.issueStatus !== 1 ? (<Button onClick={() => onDelete(row)} type="link">删除</Button>) : null}
					{+row.issueStatus !== 0 ? (
						<CopyToClipboard text={CARD_APP_ROOT + (row.type === 1 ? '/activityTheme/' : '/transferinTroduction/index/') + row.id} onCopy={copyLink}>
							<Button type="link">复制链接</Button>
						</CopyToClipboard>
					) : null}
					{+row.issueStatus !== 0 ? (<a id={'down_link' + row.id} onClick={e => copyMa(row.id)}>
						<span style={{ whiteSpace: 'nowrap' }}>下载二维码</span>
						<QRCode
							id={'qrCode' + row.id}
							value={CARD_APP_ROOT + (row.type === 1 ? '/activityTheme/' : '/transferinTroduction/index/') + row.id}
							size={200} // 二维码的大小
							fgColor="#000000" // 二维码的颜色
							style={{ margin: 'auto', display: 'none' }}
						/>
					</a>) : null}
					{(+row.issueStatus !== 0 && +row.type === 2) ? (<Button onClick={() => onDataStatistics(row)} type="link">数据统计</Button>) : null}
					{+row.issueStatus !== 0 ? (<Button onClick={() => onViewDetails(row)} type="link">查看详细</Button>) : null}
					{+row.issueStatus === 1 ? (<Button onClick={() => onUnpublish(row)} type="link">下架</Button>) : null}
				</div>
			),
		},
	]

	return (
		<div>
			<Spin spinning={loading}>
				<ToolsBar visible={false}>
					<Form form={form} layout="inline">
						<Form.Item name="theme" label="活动主题">
							<Input placeholder="请输入活动主题" style={{ width: '150px' }} allowClear></Input>
						</Form.Item>
						<Form.Item label="活动时间">
							<RangePicker
								style={{ width: 240 }}
								placeholder={['开始日期', '结束日期']}
								onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'cameStartTime', 'cameEndTime')}
							/>
						</Form.Item>
						<Form.Item name="issueStatus" label="发布状态">
							<Select placeholder="请选择发布状态" style={{ width: '150px' }} allowClear>
								<Select.Option value={0}>未发布</Select.Option>
								<Select.Option value={1}>已发布</Select.Option>
								<Select.Option value={2}>下架</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item name="status" label="活动状态">
							<Select placeholder="请选择活动状态" style={{ width: '150px' }} allowClear>
								<Select.Option value={0}>未开始</Select.Option>
								<Select.Option value={1}>进行中</Select.Option>
								<Select.Option value={2}>已结束</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item>
							<div>
								<Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>搜索</Button>
								<Button type="primary" onClick={onAdd}>新建</Button>
							</div>
						</Form.Item>
					</Form>
				</ToolsBar>
				{/* 表格内容 */}
				<div className="tableConent">
					<Table
						columns={columns}
						rowKey="id"
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
				{/* <Row gutter={16}>
					{dataList.map((item, idx) => (
						<Col span={6} key={idx} style={{marginBottom: '15px'}}>
						<Card
							cover={
							<img
								alt="example"
								src={item.links && item.links.length > 0 ? item.links[0].imageUrl : ''}
								style={{height: 197}}
							/>
							}
							key={idx}
							actions={[
							<EditOutlined key="edit" onClick={e => editCard(item)} />,
							<CopyToClipboard text={CARD_APP_ROOT + '/activityTheme/' + item.id} onCopy={copyLink}>
								<PaperClipOutlined />
							</CopyToClipboard>,
							<a id={'down_link' + item.id} onClick={e => copyMa(item.id)}>
								<QrcodeOutlined />,
								<QRCode
								id={'qrCode' + item.id}f
								value={CARD_APP_ROOT + '/activityTheme/' + item.id}
								size={200} // 二维码的大小
								fgColor="#000000" // 二维码的颜色
								style={{margin: 'auto', display: 'none'}}
								// imageSettings={{
								//   // 二维码中间的logo图片
								//   src: 'logoUrl',
								//   height: 40,
								//   width: 40,
								//   excavate: true, // 中间图片所在的位置是否镂空
								// }}
								/>
							</a>,
							<DeleteOutlined key="ellipsis" onClick={e => delTheme(item.id)} />,
							]}>
							<Meta
							// avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
							title={item.title}
							description={item.name}
							/>
						</Card>
						</Col>
					))}
				</Row> */}
			</Spin>
		</div>
	)
}

export default Theme
