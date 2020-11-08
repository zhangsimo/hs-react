/** @format */

import React, { useState, useEffect } from 'react'
// import {useRouteMatch} from 'react-router-dom'
import { Spin, Row, Col, Card } from 'antd'
import * as api from '@/api'
import { useHistory } from 'react-router-dom'
// import hasPermi from '@/components/directive'
import ActivityOrderList from './components/activityOrderList'


const reg = /[\d- ]+/

const ActivityDataStatistics = () => {
	const history = useHistory()
	const query = history.location.search.substr(1).split("&").map(item => {
		var arr = item.split('=');
		return { [arr[0]]: arr[1] }
	})
	// console.log('queryqueryquery', query);
	const parmId = query[0].id
	// const [form] = Form.useForm();
	const [countData, setCountData] = useState<any>({ goodsAmount: 0, orderAmount: 0, saleAmount: 0 });
	// const [openTuanData, setOpenTuanData] = useState<any>({ total: 0, success: 0, teaming: 0, fail: 0 });

	const [starTime, setStarTime] = useState<string>('');
	const [endTime, setEndTime] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		reg.test(query[1].starTime) && setStarTime(query[1].starTime)
		reg.test(query[2].endTime) && setEndTime(query[2].endTime)
	}, [query])


	useEffect(() => {
		setLoading(true)
		api.getStatisticsData({ id: parmId }).then((res: any) => {
			if (res.code === 1) {
				setCountData(res.data)


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
				<h2>{decodeURI(query[3]?.theme)} <span style={{ fontSize: '12px', color: '#999' }}>{(starTime && endTime) ? `${query[1]?.starTime} 至 ${query[2]?.endTime}` : '永久有效'}</span></h2>
				<div>
					<Row gutter={16}>

						<Col span={8}>
							<Card title="订单数(不含退款)" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{countData.orderAmount}</Card>
						</Col>
						<Col span={8}>
							<Card title="已售商品数" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{countData.goodsAmount}</Card>
						</Col>
						<Col span={8}>
							<Card title="销售金额" bodyStyle={cardBodyCss} headStyle={cardHeaderCss} bordered={false}>{countData.saleAmount}</Card>
						</Col>
					</Row>
				</div>



				<ActivityOrderList activityId={parmId}></ActivityOrderList>



			</Spin>
		</div >
	)
}

export default ActivityDataStatistics
