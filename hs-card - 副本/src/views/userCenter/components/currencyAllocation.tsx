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

const CurrencyAllocation: React.FC<IProps> = ({showData, pagination, ...props}) => {
	const visible = useBoolean(false)
	const childRef:any = useRef();
	const [saveBottom, setSaveBottom] = useState<boolean>(true)
	const [val, setVal] = useState<any>('')
	
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
	
	const columns = [{
		title: '项目编号',
		dataIndex: 'cateId',
		key: 'cateId',
		width: '180px',
	}, {
		title: '项目名称',
		dataIndex: 'cateName',
		key: 'cateName',
		ellipsis: true,
		width: '120px',
	}, {
		title: '设置提成',
		width: '450px',
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
		width: '160px',
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
		width: '110px',
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
			for (let i in selectedRows) {
				selectedRows[i].configType = showData.configType
				selectedRows[i].refType = showData.refType
			}
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
		getFirstNode('cateId', row.cateId, 'adviserCommissionType', 'adviserCommissionValue', e)
	}
	const adviserCommissionValueChange = (row, val) => {
		getFirstNode('cateId', row.cateId, 'adviserCommissionValue', 'adviserCommissionType', val)
	}
	const saleCommissionTypeChange = (row, val) => {
		let e = val.target.value
		getFirstNode('cateId', row.cateId, 'saleCommissionType', 'saleCommissionValue', e)
		
	}
	const saleCommissionValueChange = (row, val) => {
		getFirstNode('cateId', row.cateId, 'saleCommissionValue', 'saleCommissionType', val)
		
	}
	const techCommissionTypeChange = (row, val) => {
		let e = val.target.value
		getFirstNode('cateId', row.cateId, 'techCommissionType', 'techCommissionValue', e)
		
	}
	const techCommissionValueChange = (row, val) => {
		getFirstNode('cateId', row.cateId, 'techCommissionValue', 'techCommissionType', val)
		
	}
	const rebuildData= (data, saveTableData) => {
		for(let i in data){
			if (data[i].change) {
				let params = {
					"adviserCommissionType": data[i].adviserCommissionType,
					"adviserCommissionValue": data[i].adviserCommissionValue,
					"compCode": sessionStorage.getItem("USER_CENTER_COMP_CODE"),
					"compName": sessionStorage.getItem("USER_CENTER_COMP_NAME"),
					"configType": showData.configType,
					"refId": data[i].cateId,
					"refType": showData.refType,
					"saleCommissionType": data[i].saleCommissionType,
					"saleCommissionValue": data[i].saleCommissionValue,
					"techCommissionType": data[i].techCommissionType,
					"techCommissionValue": data[i].techCommissionValue
				}
				saveTableData.push(params)
			}
			if(data[i].childs){
				rebuildData(data[i].childs, saveTableData);
			}
		}
	};
	const eidtProject = () => {
		let tableList = showData.items
		let saveTableData:any = []
		rebuildData(tableList, saveTableData)
		
		api.postCommissionConfigSetting(saveTableData).then(res => {
			if (res.code == 1) {
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
	const getFirstNode = (field, params, typeParam, valueParam, val) => {
		//递归遍历树结构改变选项
		let changeTable:any = showData.items
		getNodebyParams(changeTable, field, params, typeParam, valueParam, val)
	};
	const getNodebyParams = (data, field, params, typeParam, valueParam, val) => {
		//1.第一层 root 深度遍历整个data
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			if (obj[field] === params) {
				//找到了与params匹配的节点，结束递归
				if (typeParam.indexOf('Type') == -1) {
					obj[typeParam] = obj[valueParam] =='fix_amount' ? Math.ceil(val * 100) : val
				} else {
					obj[typeParam] = val
					obj[valueParam] = 0
				}
				obj.change = true
				setSaveBottom(false)
				setVal(params + '-' + val + '-' + typeParam)
				break;
			} else {
				if (obj.childs && obj.childs.length) {
					//递归往下找
					getNodebyParams(obj.childs, field, params, typeParam, valueParam, val);
				} else {
					//跳出当前递归，返回上层递归
					continue;
				}
			}
		}
	};
	
	return (
		<div>
			<Table columns={columns} 
				loading={!showData.items}
				dataSource={showData.items}
				rowSelection={rowSelection}
				rowKey={record => record.cateId}
				childrenColumnName="childs"
				bordered
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

export default CurrencyAllocation
