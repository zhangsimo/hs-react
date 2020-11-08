/** @format */
import React, {useState, useImperativeHandle} from 'react'
import {Modal, Table, message, Spin } from 'antd'
import * as api from '@/api'

interface IProps {
	visible: boolean
	setVisible: () => void
	cRef:() => void
}

const columns = [{
	title: '时间',
	dataIndex: 'createTime',
	key: 'createTime',
	width: '153px',
}, {
	title: '姓名',
	dataIndex: 'employeeName',
	key: 'employeeName',
	width: '100px',
}, {
	title: '工号',
	dataIndex: 'employeeCode',
	key: 'employeeCode',
	width: '174px',
}, {
	title: '提成配置',
	dataIndex: 'address',
	key: 'address',
	width: '300px',
	render: (text, record) => (

		<div className="commission_box">
			<div>
				销售人员:{convertTypeText(record, 'saleCommissionType', 'oldSaleCommissionType')}
			</div>
			<div>
				服务顾问:{convertTypeText(record, 'adviserCommissionType', 'oldAdviserCommissionType')}
			</div>
			<div>
				　　技师:{convertTypeText(record, 'techCommissionType', 'oldTechCommissionType')}
			</div>
		</div>
	)
}, {
	title: '数值',
	dataIndex: 'address',
	key: 'address',
	width: '120px',
	render: (text, record) => (
		<div className="number_box">
			<div>
				{convertValueText(record, 'saleCommissionValue', 'oldSaleCommissionValue', 'saleCommissionType', 'oldSaleCommissionType')}
			</div>
			<div>
				{convertValueText(record, 'adviserCommissionValue', 'oldAdviserCommissionValue', 'adviserCommissionType', 'oldAdviserCommissionType')}
			</div>
			<div>
				{convertValueText(record, 'techCommissionValue', 'oldTechCommissionValue', 'techCommissionType', 'oldTechCommissionType')}
			</div>
		</div>
	)
}];
const convertTypeText = (row, type, oldType) => {
	let showText:any = ''
	showText = configEnConvertCn(row.commissionConfigChangeDTO[oldType]) +'修改成'+ configEnConvertCn(row.commissionConfigChangeDTO[type])
	return showText
}
const convertValueText = (row, type, oldType, param, oldParam) => {
	let showText:any = ''
	//if (row.commissionConfigChangeDTO[param] !== row.commissionConfigChangeDTO[oldParam]) {
		showText += configEnConvertCnVal(row.commissionConfigChangeDTO[oldType], row.commissionConfigChangeDTO[oldParam]) +'->'
		showText += configEnConvertCnVal(row.commissionConfigChangeDTO[type], row.commissionConfigChangeDTO[param])
	//} else {
	//	showText = ''
	//}
	return showText
}
const configEnConvertCn = (val) => {
	let convertList:any = {
		"original_price_ratio": '按原价比例',
		"price_ratio": '按成交价比例',
		"fix_amount": '固定金额'
	}
	return convertList[val] || ''
}
const configEnConvertCnVal = (val, type) => {
	let showText:any = ''
	if (type=='fix_amount') {
		showText = val / 100
	} else {
		showText = val + '%'
	}
	return showText
}
const LogPopup: React.FC<IProps> = ({...props}) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [logData, setLogData] = useState<any>({})
	let logParams:any = {
		page: 1,
		pageSize: 6,
	}
	//const myName = () => alert('父组件调用子组件方法成功')
	useImperativeHandle(props.cRef, () => ({
		changeVal
	}));
	
	const changeVal = (value) => {
	   // 子组件方法
		logParams.id = value.id
		sessionStorage.setItem("USER_CENTER_LOG_POPUP_ID", value.id)
		getCommissionConfigOperationList()
	};
	
	const getCommissionConfigOperationList = () => {
		setLogData({})
		if (logParams.id==0) {
		} else {
			setLoading(true)
			api.getCommissionConfigOperationPage(logParams).then(res => {
				console.log(5569, res.data)
				setLogData(res.data)
				setLoading(false)
			}).catch(err => {
				message.error(err.msg)
				setLoading(false)
			})
		}
		
	}
	const onChangeLog = (page, pageSize) => {
		//分页
		logParams.id = sessionStorage.getItem("USER_CENTER_LOG_POPUP_ID")
		logParams.page = page,
		logParams.pageSize = pageSize,
		getCommissionConfigOperationList()
	}
	
	return (
		<div>
			<Modal title="查看日志" 
				width={880}
				visible={props.visible}
				onCancel={() => props.setVisible()}
				footer={null}>
				<Spin spinning={loading}>
					<Table 
						locale={{emptyText: '暂无操作日志'}}
						columns={columns}
						dataSource={logData.items}
						rowKey={record => record.id}
						size="small"
						pagination={{
						  total: logData.total,
						  showTotal: total => `共 ${total} 条`,
						  pageSize: logData.pageSize,
						  onChange: onChangeLog,
						}}
					/>
				</Spin>
			</Modal>
			
		</div>
	)
}

export default LogPopup
