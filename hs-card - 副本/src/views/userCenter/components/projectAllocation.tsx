/** @format */
import React, {useState, useRef, useImperativeHandle} from 'react'
import {Table, InputNumber, Radio, Button, message } from 'antd'
import * as api from '@/api'
import './projectAllocation.less'
import {useBoolean} from '@umijs/hooks'
import {ICardDetail} from '@/interface'
const RadioGroup = Radio.Group;
import LogPopup from './logPopup'


interface IProps {
	headLook: boolean
	showData
	pagination
	SelectChangeOperatie: any
	RefreshList: any
	cRef:() => void
}

const ProjectAllocation: React.FC<IProps> = ({showData, pagination, ...props}) => {
	const [state, setState] = useState<any>( {
		selectedRowKeys: []
	})
	
	//const myName = () => alert('父组件调用子组件方法成功')
	useImperativeHandle(props.cRef, () => ({
		changeVal
	}));
	
	const changeVal = () => {
		// 子组件方法
		setState({ selectedRowKeys: [] });
	};

	const visible = useBoolean(false)
	const childRef:any = useRef();
	const [saveBottom, setSaveBottom] = useState<boolean>(true)
	const [val, setVal] = useState<any>('')
	const fixedRight:any = 'right'

	const columns = [{
		title: '项目名称',
		dataIndex: 'itemName',
		ellipsis: true,
		key: 'itemName',
		width: 180,
	}, {
		title: '项目分类',
		dataIndex: 'cateName',
		key: 'cateName',
		ellipsis: true,
		width: 120,
	}, {
		title: '设置提成',
		width: 450,
		render: (text, record) => (
			<div className="commission_box">
				<div><span>销售人员:</span>
					<RadioGroup disabled={props.headLook} onChange={(value) => saleCommissionTypeChange(record, value)} value={record.saleCommissionType}>
						<Radio value='original_price_ratio'>按原价比例</Radio>
						<Radio value='price_ratio'>按成交价比例</Radio>
						<Radio value='fix_amount'> 固定金额</Radio>
					</RadioGroup>
				</div>
				<div><span>服务顾问:</span>
					<RadioGroup disabled={props.headLook} onChange={(value) => adviserCommissionTypeChange(record, value)} value={record.adviserCommissionType}>
						<Radio value='original_price_ratio'>按原价比例</Radio>
						<Radio value='price_ratio'>按成交价比例</Radio>
						<Radio value='fix_amount'> 固定金额</Radio>
					</RadioGroup>
				</div>
				<div><span>技师:</span>
					<RadioGroup disabled={props.headLook} onChange={(value) => techCommissionTypeChange(record, value)} value={record.techCommissionType}>
						<Radio value='original_price_ratio'>按原价比例</Radio>
						<Radio value='price_ratio'>按成交价比例</Radio>
						<Radio value='fix_amount'> 固定金额</Radio>
					</RadioGroup>
				</div>
			</div>
		)
	}, {
		title: '数值',
		width: 160,
		render: (text, record) => (
			<div className="number_box">
				<div><InputNumber 
					disabled={props.headLook}
					onChange={(value) => saleCommissionValueChange(record, value)} 
					placeholder="请输入"
					min={0}
					max={record.saleCommissionType=='fix_amount' ? 100000 : 100}
					formatter={record.saleCommissionType=='fix_amount'?limitDecimals:limitInteger}
					parser={record.saleCommissionType=='fix_amount'?limitDecimals:limitInteger}
					value={record.saleCommissionType=='fix_amount' ? record.saleCommissionValue / 100 : record.saleCommissionValue} 
					step={record.saleCommissionType=='fix_amount'?'0.01':'1'} 
					size="small" />{record.saleCommissionType=='fix_amount'?'':'%'}</div>
				<div><InputNumber 
					disabled={props.headLook}
					onChange={(value) => adviserCommissionValueChange(record, value)} 
					placeholder="请输入" 
					min={0}
					max={record.adviserCommissionType=='fix_amount' ? 100000 : 100}
					formatter={record.adviserCommissionType=='fix_amount'?limitDecimals:limitInteger}
					parser={record.adviserCommissionType=='fix_amount'?limitDecimals:limitInteger}
					value={record.adviserCommissionType=='fix_amount' ? record.adviserCommissionValue / 100 : record.adviserCommissionValue} 
					step={record.adviserCommissionType=='fix_amount'?'0.01':'1'} 
					size="small" />{record.adviserCommissionType=='fix_amount'?'':'%'}</div>
				<div><InputNumber 
					disabled={props.headLook}
					onChange={(value) => techCommissionValueChange(record, value)} 
					placeholder="请输入"
					min={0}
					max={record.techCommissionType=='fix_amount' ? 100000 : 100}
					formatter={record.techCommissionType=='fix_amount'?limitDecimals:limitInteger}
					parser={record.techCommissionType=='fix_amount'?limitDecimals:limitInteger}
					value={record.techCommissionType=='fix_amount' ? record.techCommissionValue / 100 : record.techCommissionValue} 
					step={record.techCommissionType=='fix_amount'?'0.01':'1'} 
					size="small" />{record.techCommissionType=='fix_amount'?'':'%'}
				</div>
			</div>
		)
	}, {
		title: '操作',
		key: 'operation',
		width: 100,
		fixed: fixedRight,
		render: (text, record) => (
			<Button type="link" onClick={() => showModal(record)}>查看日志</Button>
		)
	}];
	// 通过 rowSelection 对象表明需要行选择
	const {selectedRowKeys } = state;
	const rowSelection = {
		selectedRowKeys,
		onChange(selectedRowKeys, selectedRows) {
			setState({selectedRowKeys})
			props.SelectChangeOperatie(selectedRows)
		},
		onSelect(record, selected, selectedRows) {
			//console.log(2,selectedRows);
		},
		onSelectAll(selected, selectedRows, changeRows) {
			//console.log(3,changeRows);
		},
	};
	
	const showModal = (item: ICardDetail) => {
		childRef.current.changeVal(item);
		visible.toggle()
	};
	
	const adviserCommissionTypeChange = (row, val) => {
		let e = val.target.value
		let changeTable:any = showData.items
		for (let i in changeTable) {
			if (changeTable[i].itemId == row.itemId) {
				changeTable[i].adviserCommissionType = e
				changeTable[i].adviserCommissionValue = 0
				changeTable[i].change = true
			} 
		}
		setSaveBottom(false)
		setVal('adviser-' + e + '-' + row.itemId)
	}
	const adviserCommissionValueChange = (row, val) => {
		let changeTable:any = showData.items
		for (let i in changeTable) {
			if (changeTable[i].itemId == row.itemId) {
				changeTable[i].adviserCommissionValue = changeTable[i].adviserCommissionType =='fix_amount' ? Math.ceil(val * 100) : val
				changeTable[i].change = true
			} 
		}
		setSaveBottom(false)
		setVal('adviser-' + val + '-' + row.itemId)
	}
	const saleCommissionTypeChange = (row, val) => {
		let e = val.target.value
		let changeTable:any = showData.items
		for (let i in changeTable) {
			if (changeTable[i].itemId == row.itemId) {
				changeTable[i].saleCommissionType = e
				changeTable[i].saleCommissionValue = 0
				changeTable[i].change = true
			} 
		}
		setSaveBottom(false)
		setVal('sale-' + e + '-' + row.itemId)
	}
	const saleCommissionValueChange = (row, val) => {
		let changeTable:any = showData.items
		for (let i in changeTable) {
			if (changeTable[i].itemId == row.itemId) {
				changeTable[i].saleCommissionValue = changeTable[i].saleCommissionType =='fix_amount' ? Math.ceil(val * 100) : val
				changeTable[i].change = true
			} 
		}
		setSaveBottom(false)
		setVal('sale-' + val + '-' + row.itemId)
	}
	const techCommissionTypeChange = (row, val) => {
		let e = val.target.value
		let changeTable:any = showData.items
		for (let i in changeTable) {
			if (changeTable[i].itemId == row.itemId) {
				changeTable[i].techCommissionType = e
				changeTable[i].techCommissionValue = 0
				changeTable[i].change = true
			} 
		}
		setSaveBottom(false)
		setVal('tech-' + e + '-' + row.itemId)
	}
	const techCommissionValueChange = (row, val) => {
		let changeTable:any = showData.items
		for (let i in changeTable) {
			if (changeTable[i].itemId == row.itemId) {
				changeTable[i].techCommissionValue = changeTable[i].techCommissionType =='fix_amount' ? Math.ceil(val * 100) : val
				changeTable[i].change = true
			} 
		}
		setSaveBottom(false)
		setVal('tech-' + val + '-' + row.itemId)
	}
	const eidtProject = () => {
		let tableList = showData.items
		let saveTableData:any = []
		for (let i in tableList) {
			if (tableList[i].change) {
				let params = {
					"adviserCommissionType": tableList[i].adviserCommissionType,
					"adviserCommissionValue": tableList[i].adviserCommissionValue,
					"compCode": sessionStorage.getItem("USER_CENTER_COMP_CODE"),
					"compName": sessionStorage.getItem("USER_CENTER_COMP_NAME"),
					"configType": showData.configType,
					"refId": tableList[i].itemId,
					"refType": showData.refType,
					"saleCommissionType": tableList[i].saleCommissionType,
					"saleCommissionValue": tableList[i].saleCommissionValue,
					"techCommissionType": tableList[i].techCommissionType,
					"techCommissionValue": tableList[i].techCommissionValue
				}
				saveTableData.push(params)
			}
		}
		console.log(saveTableData)
		
		api.postCommissionConfigSetting(saveTableData).then(res => {
			console.log(res)
			if (res.code == 1) {
				setSaveBottom(true)
				message.success('操作成功！')
				props.RefreshList()
			} else {
				message.error('操作失败！')
			}
		}).catch(err => {
			message.error(err.msg)
		})
		
	}
	const limitDecimals = (value) => {
	    const reg = /^(\-)*(\d+)\.(\d\d).*$/;
	    if(typeof value === 'string') {
	        return !isNaN(Number(value)) ? value.replace(reg,'$1$2.$3') : ''
	    } else if (typeof value === 'number') {
	        return !isNaN(value) ? String(value).replace(reg,'$1$2.$3') : ''
	    } else {
	        return ''
	    }
	};
	const limitInteger = (value) => {
	    const reg = /^(\-)*(\d+)\.*$/;
	    if(typeof value === 'string') {
	        return !isNaN(Number(value)) ? value.replace(reg,'$1$2') : ''
	    } else if (typeof value === 'number') {
	        return !isNaN(value) ? String(value).replace(reg,'$1$2') : ''
	    } else {
	        return ''
	    }
	};
	return (
		<div>

			<Table columns={columns} 
				loading={!showData.items}
				dataSource={showData.items}
				rowSelection={rowSelection}
				rowKey={record => record.itemId}
				bordered
				scroll={{ x: 600 }}
				pagination={pagination}
			/>
			<div className="foot_save_box">
			<div className="noneVal">{val}</div>
			<Button type="primary" 
				disabled={props.headLook || saveBottom}
				className="allocation_button"
				onClick={() => eidtProject()}>保存配置</Button></div>
			<LogPopup
				cRef={childRef}
				visible={visible.state}
				setVisible={visible.toggle} />
		</div>
	)
}

export default ProjectAllocation
