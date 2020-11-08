/** @format */

import React, { useState, useEffect } from 'react'
import { Row, Col, Spin, Button, Table, Form } from 'antd'
import * as api from '@/api'
import useSearchParam from '@/hooks/useSearchParam'
import { ColumnProps } from 'antd/lib/table'
import TagViewStore from '@/store/tag-view'
import { useHistory } from 'react-router-dom'

const ChargebackDetail = () => {
	const { delView } = TagViewStore.useContainer()
	const history = useHistory()
	const [loading, setLoading] = useState<boolean>(false)
	const refundId = useSearchParam('refundId')
	const [customerDetailData, setCustomerDetailData] = useState<any>()
	const [projectData, setProjectData] = useState<any>([])
	const [setmealData, setSetmealData] = useState<any>([])
	useEffect(() => {
		if (refundId) {
			setLoading(true)
			sessionStorage.setItem('refundId', refundId)
			getOrderData()
		}
	}, [refundId])

	const getOrderData = () => {
		api.getOrderRefundDetail({refundId: refundId}).then(res => {
			const data: any = res.data
			let itemList:any = data.items || []
			let setmealList:any = []
			let projectList:any = []
			
			itemList.map(item => {
				if (item.itemType == 5) {
					setmealList.push(item)
				} else {
					projectList.push(item)
				}
			})
			setProjectData(projectList)
			setSetmealData(setmealList)
			
			setLoading(false)
			setCustomerDetailData(data)
		})
	}
	const closePage = () => {
		delView({ pathname: "/ordermanage/chargebackDetail", state: { title: '退单详情' } })
		history.push('/ordermanage/chargeback')
	}
	
	const setmealColumn: ColumnProps<any>[] = [{
		title: '商品名称',
		dataIndex: 'itemName',
		width: '140px',
		ellipsis: true,
	}, {
		title: '商品类型',
		dataIndex: 'itemType',
		width: '220px',
		render: (a, row) => {
			return itemType[row.itemType]
		}
	}, {
		title: '销售金额',
		dataIndex: 'amount',
		width: '100px',
		ellipsis: true,
	}, {
		title: '实付金额',
		dataIndex: 'actualAmount',
		width: '100px',
		ellipsis: true,
	}, {
		title: '数量',
		dataIndex: 'refundNum',
		align: 'right',
		width: '100px',
	}, {
		title: '可退金额',
		dataIndex: 'returnableAmount',
		align: 'center',
		width: '100px',
	}, {
		title: '退款金额',
		dataIndex: 'refundAmt',
		align: 'right',
		width: '100px',
	}];
	
	const projectColumn: ColumnProps<any>[] = [{
		title: '商品名称',
		dataIndex: 'itemName',
		width: '140px',
		ellipsis: true,
	}, {
		title: '商品类型',
		dataIndex: 'itemType',
		width: '220px',
		render: (a, row) => {
			return itemType[row.itemType]
		}
	}, {
		title: '销售金额',
		dataIndex: 'amount',
		align: 'right',
		width: '100px',
	}, {
		title: '实付金额',
		dataIndex: 'actualAmount',
		width: '100px',
	}, {
		title: '数量',
		dataIndex: 'refundNum',
		align: 'right',
		width: '100px',
	}, {
		title: '退款金额',
		dataIndex: 'refundAmt',
		align: 'right',
		width: '100px',
	}];
	
	const chargebackType:any = {
		'only_refund': '仅退款',
		'refund_goods': '退货退款',
		'claim_refund': '索赔退单',
	}
	const chargebackStatus:any = {
		1: '待审核',
		2: '已退款',
		3: '待退款',
		4: '已作废',
	}
	const itemType:any = {
		1: '普通商品',
		2: '工时',
		3: '配件',
		4: '项目',
		5: '套餐',
		6: '标准项目'
	}
	return (
		<div className='block orderdetail' >
			<Spin spinning={loading} >
				<div className="block_title">
					<span>客户退单</span>
				</div>
				 <Form>
				<div className='orderdetailC' style={{paddingTop: '10px'}}>
					<Row className="show_info_box">
						<Col span={8}>
							<Form.Item name="refundCode" label="退单号">
								<span slot="label">
									{customerDetailData && customerDetailData.refundCode ? customerDetailData.refundCode : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="orderId" label="关联单号">
								<span slot="label">
									{customerDetailData && customerDetailData.orderId ? customerDetailData.orderId : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="saleShopName" label="销售门店">
								<span slot="label">
									{customerDetailData && customerDetailData.saleShopName ? customerDetailData.saleShopName : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="refundOrderType" label="退单类型">
								<span slot="label">
									{customerDetailData && customerDetailData.refundOrderType ? 
									 chargebackType[customerDetailData.refundOrderType]
									 : '无'}
								</span>
							</Form.Item>
						</Col>
						
						<Col span={8}>
							<Form.Item name="userMobile" label="客户电话">
								<span slot="label">
									{customerDetailData && customerDetailData.userMobile ? customerDetailData.userMobile : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="carNum" label="车牌号">
								<span slot="label">
									{customerDetailData && customerDetailData.carNum ? customerDetailData.carNum : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="vin" label="VIN码">
								<span slot="label">
									{customerDetailData && customerDetailData.vin ? customerDetailData.vin : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="carModel" label="车型">
								<span slot="label">
									{customerDetailData && customerDetailData.carModel ? customerDetailData.carModel : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="refundStatus" label="退单状态">
								<span slot="label">
									{customerDetailData && customerDetailData.refundStatus ? chargebackStatus[customerDetailData.refundStatus] : '无'}
								</span>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name="reason" label="退单原因">
								<span slot="label">
									{customerDetailData && customerDetailData.reason ? customerDetailData.reason : '无'}
								</span>
							</Form.Item>
						</Col>
					</Row>
				</div>
				</Form>
				<div className='orderdetailC'>
					<div className='ctitle ctitlem'>
						<span>项目商品</span>
					</div>
					<Table dataSource={projectData} columns={projectColumn} pagination={false} scroll={{ x: 1000 }} />
				</div>
				
				<div className='orderdetailC'>
					<div className='ctitle ctitlem'>
						<span>购买套餐</span>
					</div>
					<Table dataSource={setmealData} columns={setmealColumn} pagination={false} scroll={{ x: 1000 }} />
				</div>
				
				<div className='footerBtn'>
					<div>
						{/*<Button type="primary">确认退款</Button>
						<Button>打 印</Button>*/}
						<Button onClick={closePage}>取 消</Button>
					</div>
				</div>
			</Spin>
		</div >
	)
}

export default ChargebackDetail
