/** @format */

import React, { useEffect, useState } from 'react'
import { Form, Input, Row, Col, Button, Spin, Modal, Table, Pagination } from 'antd'
import * as api from '@/api'

import './index.less'
// import {PlusOutlined} from '@ant-design/icons'
import UploadImg from '@/components/Upload/ImageQN'
// import useSearchParam from '@/hooks/useSearchParams'
import { useHistory } from 'react-router-dom'
import { ColumnProps } from 'antd/lib/table'
import { IActivityCardDetails } from '@/interface/activity'
import Moment from 'moment'


const dateFormat = 'YYYY-MM-DD'
interface IProps {
	next: (data: any, from:any) => void,
	isTheme: Boolean,
	editData: any
}

const ThemeDetails: React.FC<IProps> = props => {
	const history = useHistory()
	const parmId = history.location.search.split('=')[1]
	const [form] = Form.useForm()
	const [fileList, setfileList] = useState<any>([{ imageUrl: '', linkUrl: '' }])
	const [loading, setLoading] = useState<boolean>(false)
	const [cardTypeVisible, setCardTypeVisible] = useState<boolean>(false)
	const [selectedRow, setSelectedRow] = useState<string[]>([])
	const [cardTypeDetailsDataList, setcardTypeDetailsDataList] = useState<any>([])
	const [cardTypeData, setCardTypeData] = useState<any>()
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
	const [isExit] = useState<boolean>(false)

	useEffect(() => {
		let imgageAndLink:any[] = []
		if (parmId) {
			console.log('页面设置props.editData', props.editData);
			imgageAndLink = [].concat(props.editData.links)
			form.setFieldsValue({ title: props.editData.title })
			form.setFieldsValue({ name: props.editData.name })
			props.editData.cardsList && setcardTypeDetailsDataList(props.editData.cardsList)
		}
		setfileList([...imgageAndLink, { imageUrl: '', linkUrl: '' }])
	}, [props])

	const changeImg = (index: React.ReactText, imgUrl: any) => {
		fileList[index].imageUrl = imgUrl
		const fliterFilelist = fileList.filter(item => item.imageUrl)
		let newFileList = [...fliterFilelist, { imageUrl: '', linkUrl: '' }]
		setfileList(newFileList)
	}

	const changeLink = (e, index: any) => {
		console.log('页面设置，非老客户', e);
		fileList[index].linkUrl = e.target.value
		setfileList(fileList)
	}

	const delCardTypeDetails = (cardId: number) => {
		// console.log(cardId)
		var filterItems = cardTypeDetailsDataList.filter(function (item) {
			return item.cardId !== cardId
		})
		// setCardTypeDetailsData(cardTypeDetailsData)
		setcardTypeDetailsDataList(filterItems)
	}

	
	const uniqueArr = (arr1, arr2) => {
		let arr3 = arr1 || []
		let arr4 = arr2 || []
		let c = [...arr3, ...arr4] // 两个数组合并一个的简单方法
		let d = []
		let hash = {}
		d = c.reduce((item, next) => {
			hash[next.cardId] ? '' : (hash[next.cardId] = true && item.push(next))
			return item
		}, [])
		return d
	}

	const saveSelectCard = () => {
		let arr = uniqueArr(selectedRow, cardTypeDetailsDataList)
		setcardTypeDetailsDataList(arr)
		setCardTypeVisible(false)
	}


	const setName = e => {
		form.setFieldsValue({ title: e.target.value })
	}

	// const setTitle = e => {
	// 	form.setFieldsValue({ title: e.target.value })
	// }

	const nextStep = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		e.preventDefault()
		form.validateFields().then(async values => {
			// props.editData.name = values.name
			props.editData.title = values.title
			props.editData.links = fileList.filter(item => item.imageUrl)
			props.editData.cardsList = cardTypeDetailsDataList
			props.editData.showOld = props.editData.activityType === 2
			props.editData.stape = props.editData.activityType === 2 ? 1 : 2
			console.log('活动页面设置', props.editData);
			props.next(props.editData, form)
		})
	}


	const columns: ColumnProps<IActivityCardDetails>[] = [
		{
			title: '券类型',
			dataIndex: 'cardType',
			align: 'left',
			render: (a, row) => {
				let cardType: any = ''
				if (row.cardType == '1') {
					cardType = '满减券'
				} else if (row.cardType == '2') {
					cardType = '抵扣券'
				} else if (row.cardType == '3') {
					cardType = '折扣券'
				} else if (row.cardType == '4') {
					cardType = '兑换券'
				}

				return cardType
			},
		},
		{
			title: '券名称',
			dataIndex: 'subTitle',
			align: 'center',
		},
		{
			title: '有效期',
			dataIndex: 'validDays',
			align: 'center',
			render: (a, row) => {
				let validDays: any = ''
				if (row.validType == 1) {
					validDays = Moment(row.validEnd).format(dateFormat)
				} else if (row.validType == 2) {
					validDays = row.validDays
				}

				return validDays
			},
		},
		{
			title: '操作',
			align: 'center',
			render: (a, b, index) => {
				return (
					<div>
						<Button type="link" onClick={() => delCardTypeDetails(a.cardId)} style={{ color: '#FB721F' }}>删除</Button>
					</div>
				)
			},
		},
	]

	const columnsType: ColumnProps<IActivityCardDetails>[] = [
		{
			title: '卡券类型',
			dataIndex: 'cardType',
			align: 'left',
			width: 80,
			render: (a, row) => {
				let cardType: any = ''
				if (row.cardType == '1') {
					cardType = '满减券'
				} else if (row.cardType == '2') {
					cardType = '抵扣券'
				} else if (row.cardType == '3') {
					cardType = '折扣券'
				} else if (row.cardType == '4') {
					cardType = '兑换券'
				}

				return cardType
			},
		},
		{
			title: '卡券名称',
			dataIndex: 'subTitle',
			align: 'center',
			width: 220,
		},
		{
			title: '有效期',
			dataIndex: 'validDays',
			align: 'center',
			render: (a, row) => {
				let validDays: any = ''
				if (row.validType == 1) {
					validDays = Moment(row.validEnd).format(dateFormat)
				} else if (row.validType == 2) {
					validDays = row.validDays
				}

				return validDays
			},
		},
		{
			title: '库存',
			dataIndex: 'cardNum',
			align: 'center',
		},
	]

	const onSelectChange = (selectedRowKeys, selectedRow) => {
		setSelectedRowKeys(selectedRowKeys)
		setSelectedRow(selectedRow)
	}
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	}

	const importCardVoucher = data => {
		setLoading(true)
		let params = {
			pageSize: data.pageSize || 8,
			page: data.page || 1,
			channel: data.channel || '007',
		}
		api.getActivityCardTypeList(params).then((res: any) => {
			if (res.code == 1) {
				setCardTypeData(res.data)
			}
			setCardTypeVisible(true)
			setLoading(false)
		})
	}

	const onChangeCardType = (page, pageSize) => {
		setSelectedRowKeys([]) // 下一页 清空其他页的勾选
		// setSelectedRowGoodKey([])
		let params = {
			page: page,
			pageSize: pageSize,
			channel: '007',
			cardsShelvesId: parmId,
		}
		importCardVoucher(params)
	}

	return (
		<div className="activityPage">
			{props.editData.activityType === 2 && (<h3 style={{marginBottom: '20px'}}>新客户营销页设置</h3>)}
			<Spin spinning={false}>
				<Row>
					<Col className="preview" style={{ overflow: 'hidden' }}>
						<div style={{ textAlign: 'center', padding: '10px 0', fontSize: '16px' }}>{form.getFieldValue('title')}</div>
						<div style={{ height: '478px', overflow: 'auto' }}>
							{fileList.map((item: { imageUrl: any; linkUrl: string }, idx: any) => (
								<div key={idx}>
									<img src={item?.imageUrl} style={{ width: '100%' }} />
								</div>
							))}
						</div>
					</Col>
					&nbsp; &nbsp;
					<Col flex={5}>
						<div>
							<Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} layout="horizontal" form={form} size="middle">
								<Form.Item label="页面标题" name="title" rules={[{ required: true, message: '活动名称必填' }]}>
									<Input
										placeholder="请输入活动名称"
										allowClear
										onChange={e => {
											setName(e)
										}}
									/>
								</Form.Item>
							</Form>
							<br />
							<div style={{ maxHeight: '430px', overflow: 'auto' }}>
								<p>上传图片时，建议图片大小为：640*320px</p>
								{fileList.map((item: { imageUrl: any; linkUrl: string }, idx: any) => (
									<div className="flex item" key={idx}>
										<UploadImg
											className="theme-img-upload"
											disabled={isExit}
											value={item.imageUrl}
											onChange={(e: any) => changeImg(idx, e)}></UploadImg>
										<div style={{ width: '100%' }}>
											链接：
                      						<Input
												placeholder="图片链接"
												style={{ width: '80%' }}
												defaultValue={item.linkUrl}
												// value={item.linkUrl}
												onChange={e => changeLink(e, idx)}
											/>
										</div>
									</div>
								))}
							</div>
							{/* 选择卡券 */}
							{/* 只有转介绍活动才能绑卡券 */}
							{props.editData.activityType === 2 && (<div className="selecteCardVoucherBody">
								<div style={{ margin: '20px 0 10px 0' }}>
									选择卡券
									<Button type="primary" onClick={importCardVoucher}>导入</Button>
								</div>

								<Table
									columns={columns}
									rowKey={'cardId'}
									dataSource={cardTypeDetailsDataList}
									size="small"
									bordered
									pagination={false}
									style={{ height: '192px', overflow: 'auto' }}
								/>
							</div>)}
							<div className="btnBox">
								<Button type="primary" onClick={nextStep}>
									下一步
                				</Button>
							</div>
						</div>
					</Col>
				</Row>
			</Spin>
			<Modal title="选择卡券" visible={cardTypeVisible} onOk={saveSelectCard} onCancel={() => setCardTypeVisible(false)} width={650}>
				<Spin spinning={loading}>
					<Table
						rowSelection={rowSelection}
						columns={columnsType}
						rowKey={'cardId'}
						dataSource={cardTypeData?.items}
						size="small"
						bordered
						pagination={false}
						style={{ height: '192px', overflow: 'auto' }}
					/>
					<Pagination
						size="small"
						total={cardTypeData?.total}
						onChange={onChangeCardType}
						style={{ marginTop: '15px', textAlign: 'right' }}
					/>
				</Spin>
			</Modal>
		</div>
	)
}


ThemeDetails.defaultProps = {
	next: (): void => {},
	isTheme: false
}

export default ThemeDetails
