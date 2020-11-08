/** @format */
import React, {useState, useRef} from 'react'
import {Checkbox, Tabs, Row, Col, Spin, Modal, message, Table, Button, InputNumber, Radio} from 'antd'
import { ColumnProps } from 'antd/lib/table'
import GlobalStore from '@/store/global'
import * as api from '@/api'
import ProjectClass from './components/projectClass'
import ProjectAllocation from './components/projectAllocation'
import CurrencyAllocation from './components/currencyAllocation'
import {useRequest} from '@umijs/hooks'
import useSearchParam from '@/hooks/useSearchParam'
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
import './store.less'

const TabPane = Tabs.TabPane;
interface IProps { }

const UserCenterStore: React.FC<IProps> = props => {
	const urlCompCode:any = useSearchParam('compCode') || ''
	const urlCompName:any = useSearchParam('compName') || ''
	
	const { user } = GlobalStore.useContainer()
	const [itemConfig, setItemConfig] = useState<boolean>(false)
	const [commonConfig, setCommonConfig] = useState<boolean>(false)
	const [headLook, setHeadLook] = useState<boolean>(false)
	
	const childRef:any = useRef();
	
	useRequest(() => getCommissionSwitch())
	const getCommissionSwitch = () => {
		let compCode:any = user?.compCode || null
		let compName:any = user?.compName || null
		console.log(1126, urlCompCode, urlCompName)
		if (urlCompCode=='') {
			setHeadLook(false)
			sessionStorage.setItem("USER_CENTER_HEAD_LOOK", 'false')
			if (compCode) {
				sessionStorage.setItem("USER_CENTER_COMP_CODE", compCode)
				sessionStorage.setItem("USER_CENTER_COMP_NAME", compName)
			}
		} else {
			setHeadLook(true)
			sessionStorage.setItem("USER_CENTER_COMP_CODE", urlCompCode)
			sessionStorage.setItem("USER_CENTER_COMP_NAME", urlCompName)
			sessionStorage.setItem("USER_CENTER_HEAD_LOOK", 'true')
		}

		sessionStorage.setItem("USER_CENTER_CONFIG_TYPE", "item")
		sessionStorage.setItem("USER_CENTER_REF_TYPE", "standard")
		api.getCommissionSwitch(sessionStorage.getItem("USER_CENTER_COMP_CODE")).then(res => {
			
			for (let i in res.data) {
				if (res.data[i].type == 'common') {
					setCommonConfig(res.data[i].enabled)
				}
				if (res.data[i].type == 'item') {
					setItemConfig(res.data[i].enabled)
				}
			}
		}).catch(err => {
			message.error(err.msg)
		})
	}
	const onItemChange = (e) => {
		//启用停用项目配置
		console.log(e.target.checked)
		let params: any = {
			enabled: e.target.checked,
			type: 'item',
			compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE"),
			compName: sessionStorage.getItem("USER_CENTER_COMP_NAME")
		}
		let tipeText = ''
		if (e.target.checked) {
			tipeText = '启用'
		} else {
			tipeText = '停用'
		}
		confirm({
			title: '是否'+ tipeText +'【按项目配置】提成',
			onOk() {
				commissionSwitchSave(params)
			},
			onCancel() {},
		});
	}
	const onCommonChange = (e) => {
		//启用停用通用配置
		console.log(e.target.checked)
		let params: any = {
			enabled: e.target.checked,
			type: 'common',
			compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE"),
			compName: sessionStorage.getItem("USER_CENTER_COMP_NAME")
		}
		let tipeText = ''
		if (e.target.checked) {
			tipeText = '启用'
		} else {
			tipeText = '停用'
		}
		confirm({
			title: '是否'+ tipeText +'【按通用配置】提成',
			onOk() {
				commissionSwitchSave(params)
			},
			onCancel() {
				
			},
		});
	}
	
	const commissionSwitchSave = (params) => {
		api.postCommissionSwitchSave(params).then(res => {
			console.log(res)
			if (res.code === 1) {
				if (params.type == 'common') {
					setCommonConfig(params.enabled)
				}
				if (params.type == 'item') {
					setItemConfig(params.enabled)
				}
				message.success('操作成功！')
			} else {
				message.success('操作失败！')
			}
		}).catch(err => {
			message.error(err.msg)
		})
	}
	
	
	const [operateLogLoading, setOperateLogLoading] = useState<boolean>(false)
	const [operateLogData, setOperateLogData] = useState<any>({})
	const [operateLogVisible, setOperateLogVisible] = useState<boolean>(false)
	const [batchVisible, setBatchVisible] = useState<boolean>(false)
	const [configData, setConfigData] = useState<any>({})
	const [operateSelectList, setOperateSelectList] = useState<any>([])

	/*顾问提成类型(按原价比例:original_price_ratio  按成交价比例:price_ratio  固定金额:fix_amount)*/
	const [commissionType, setCommissionType] = useState<any>('')
	const [commissionValue, setCommissionValue] = useState<number>(0)
	// /*销售提成类型提成值*/
	// const [saleCommissionType, setSaleCommissionType] = useState<any>('')
	// const [saleCommissionValue, setSaleCommissionValue] = useState<number>(0)
	// /*技师提成类型提成值*/
	// const [techCommissionType, setTechCommissionType] = useState<any>('')
	// const [techCommissionValue, setTechCommissionValue] = useState<number>(0)
	
	const [configBtn, setConfigBtn] = useState<boolean>(false)
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
	const commissionTypeChange = (e) => {
		let value = e.target.value
		setCommissionType(value)
		setCommissionValue(0)
	}
	const commissionValueChange = (value) => {
		setCommissionValue(value)
	}
	// const saleCommissionTypeChange = (e) => {
	// 	let value = e.target.value
	// 	setSaleCommissionType(value)
	// 	setSaleCommissionValue(0)
	// }
	// const saleCommissionValueChange = (value) => {
	// 	setSaleCommissionValue(value)
	// }
	// const techCommissionTypeChange = (e) => {
	// 	let value = e.target.value
	// 	setTechCommissionType(value)
	// 	setTechCommissionValue(0)
	// }
	// const techCommissionValueChange = (value) => {
	// 	setTechCommissionValue(value)
	// }
	const saveCommissionConfigSetting = () => {
		if (commissionType) {
			let params:any = []
			for (let i in operateSelectList) {
				let setParams = {
					"adviserCommissionType": commissionType,
					"adviserCommissionValue": commissionType=='fix_amount' ? Math.ceil(commissionValue * 100) : commissionValue,
					compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE"),
					compName: sessionStorage.getItem("USER_CENTER_COMP_NAME"),
					"configType": sessionStorage.getItem("USER_CENTER_CONFIG_TYPE"),
					"refId": operateSelectList[i].itemId,
					"refType": sessionStorage.getItem("USER_CENTER_REF_TYPE"),
					"saleCommissionType": commissionType,
					"saleCommissionValue": commissionType=='fix_amount' ? Math.ceil(commissionValue * 100) : commissionValue,
					"techCommissionType": commissionType,
					"techCommissionValue": commissionType=='fix_amount' ? Math.ceil(commissionValue * 100) : commissionValue
				}
				

				params.push(setParams)
			}

			setConfigBtn(true)
			api.postCommissionConfigSetting(params).then(res => {
				if (res.code == 1) {
					message.success('操作成功！')
					setBatchVisible(false)
					getCommissionItemConfigList()
				} else {
					message.error('操作失败！')
				}
				setConfigBtn(false)
			}).catch(err => {
				setConfigBtn(false)
				message.error(err.msg)
			})
		} else {
			message.error('请选择配置项！')
		}
	}

	const operateLogColumns: ColumnProps<any>[] = [{
		title: '时间',
		dataIndex: 'createTime',
		key: 'createTime',
		width: '153px',
	}, {
		title: '姓名',
		dataIndex: 'employeeName',
		key: 'employeeName',
		width: '148px',
	}, {
		title: '工号',
		dataIndex: 'employeeCode',
		key: 'employeeCode',
		width: '174px',
	}, {
		title: '操作',
		dataIndex: 'address',
		key: 'address',
		width: '217px',
		align: 'center',
		render: (text, record) => (
			<div className="operate_change">
				{record.enabled ? '开启' : '停用'}
				[{record.type=='common' ? '通用配置' : '项目配置'}]
			</div>
		)
	}];
	const clickOperateLog = () => {
		//弹出操作日志窗体
		console.log(user?.compCode)
		setOperateLogVisible(true)
		let params = {
			compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE"),
			pageSize: 6,
			page: 1,
		}
		getOperateLogList(params)
	}
	const getOperateLogList = params => {
		//获取操作日志
		setOperateLogLoading(true)
		api.getOperationSwitchLog(params).then(res => {
			setOperateLogData(res.data)
			setOperateLogLoading(false)
		}).catch(err => {
			message.error(err.msg)
			setOperateLogLoading(false)
		})
	}
	const onChangeOperateLogPage = (page, pageSize) => {
		//操作日志分页
		let params = {
			compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE"),
			page: page,
			total: operateLogData.total,
			pageSize: pageSize,
		}
		getOperateLogList(params)
	}
	const callback = (val) => {
		//切换按项目配置和通用配置
		console.log(val)
		if (val == 'item') {
			window.sessionStorage.setItem("USER_CENTER_PAGE", '1')
			window.sessionStorage.setItem("USER_CENTER_PAGE_SIZE", '20')
			sessionStorage.setItem("USER_CENTER_CONFIG_TYPE", "item")
			getCommissionItemConfigList()
		}
		if (val == 'common') {
			window.sessionStorage.setItem("USER_CENTER_COMMON_PAGE", '1')
			window.sessionStorage.setItem("USER_CENTER_COMMON_PAGE_SIZE", '20')
			sessionStorage.setItem("USER_CENTER_CONFIG_TYPE", "common")
			getCommissionCommonConfigList()
		}
		
		
	}
	const selectProject = (val) => {
		//选中项目类型更新右边数据
		console.log(2563, val)
		window.sessionStorage.setItem("USER_CENTER_PAGE", '1')
		window.sessionStorage.setItem("USER_CENTER_PAGE_SIZE", '20')
		window.sessionStorage.setItem("USER_CENTER_CATE_ID", val.id)
		setOperateSelectList([])
		getCommissionItemConfigList()
	}
	const getCommissionItemConfigList = () => {
		//获取分类配置项列表
		setConfigData({"headLook": headLook})
		let params = {
			"cateId": sessionStorage.getItem("USER_CENTER_CATE_ID"),
			"compCode": sessionStorage.getItem("USER_CENTER_COMP_CODE"),
			"configType": sessionStorage.getItem("USER_CENTER_CONFIG_TYPE"),
			"page": sessionStorage.getItem("USER_CENTER_PAGE"),
			"pageSize": sessionStorage.getItem("USER_CENTER_PAGE_SIZE"),
			"refType": sessionStorage.getItem("USER_CENTER_REF_TYPE")
		}
		childRef.current.changeVal();
		api.getCommissionItemConfigPage(params).then(res => {
			setConfigData({
				"headLook": headLook,
				"refType": sessionStorage.getItem("USER_CENTER_REF_TYPE"), 
				"configType": sessionStorage.getItem("USER_CENTER_CONFIG_TYPE"),
				...res.data})
		}).catch(err => {
			message.error(err.msg)
		})
	}
	const onRefreshList = () => {
		sessionStorage.setItem("USER_CENTER_HEAD_LOOK", 'false')
		setOperateSelectList([])
		if (sessionStorage.getItem("USER_CENTER_CONFIG_TYPE") == 'item') {
			window.sessionStorage.setItem("USER_CENTER_PAGE", '1')
			window.sessionStorage.setItem("USER_CENTER_PAGE_SIZE", '20')
			sessionStorage.setItem("USER_CENTER_CONFIG_TYPE", "item")
			getCommissionItemConfigList()
		}
		if (sessionStorage.getItem("USER_CENTER_CONFIG_TYPE") == 'common') {
			window.sessionStorage.setItem("USER_CENTER_COMMON_PAGE", '1')
			window.sessionStorage.setItem("USER_CENTER_COMMON_PAGE_SIZE", '20')
			sessionStorage.setItem("USER_CENTER_CONFIG_TYPE", "common")
			getCommissionCommonConfigList()
		}

	}
	const getCommissionCommonConfigList = () => {
		
		//获取通用配置项列表
		let params = {
			"page": sessionStorage.getItem("USER_CENTER_COMMON_PAGE"),
			"pageSize": sessionStorage.getItem("USER_CENTER_COMMON_PAGE_SIZE"),
			"compCode": sessionStorage.getItem("USER_CENTER_COMP_CODE")
		}
		setConfigData({"headLook": headLook})
		childRef.current.changeVal();
		api.getCommissionCommonConfigPage(params).then(res => {
			setConfigData({
				"configType": sessionStorage.getItem("USER_CENTER_CONFIG_TYPE"),
				"refType": sessionStorage.getItem("USER_CENTER_REF_TYPE"),
				"headLook": headLook,
				...res.data})
		}).catch(err => {
			message.error(err.msg)
		})
	}
	const operatiePage = (page, pageSize) => {
		//翻页
		console.log(256, page, pageSize)
		if (sessionStorage.getItem("USER_CENTER_CONFIG_TYPE") == 'common') {
			window.sessionStorage.setItem("USER_CENTER_COMMON_PAGE", page)
			window.sessionStorage.setItem("USER_CENTER_COMMON_PAGE_SIZE", pageSize)
			getCommissionCommonConfigList()
		} else {
			window.sessionStorage.setItem("USER_CENTER_PAGE", page)
			window.sessionStorage.setItem("USER_CENTER_PAGE_SIZE", pageSize)
			getCommissionItemConfigList()
		}	
	}
	const showSizeChange = (current, pageSize) => {
		//切换显示条数
		operatiePage(1, pageSize)
	}
	const selectChange = (val) => {
		//选中项目
		setOperateSelectList(val)
	}
	const openBatchConfig = () => {
		//弹出批量配置
		if (operateSelectList.length>0) {
			setCommissionType('')
			setCommissionValue(0)
			setBatchVisible(true)
		} else {
			message.error('请选择项目！')
		}
	}
	const pagination = {
		total: configData.total,
		onShowSizeChange(current, pageSize) {
			showSizeChange(current, pageSize)
		},
		onChange(current, pageSize) {
			operatiePage(current, pageSize)
		},
	};

	return (
	<div style={{overflow: 'auto'}}  className="block customerlist" id="custdetail">
		<div className="block_title">
			<Row>
				<Col span={19}>
					<span className="borderlf">会员中心 > 绩效配置</span>
				</Col>
			</Row>
		</div>
		<div className="config_switch_box">
			<div className="switch_box">
				<span>配置启用: </span>
				<Checkbox disabled={headLook} checked={itemConfig} onChange={onItemChange}>{itemConfig ? '启用' : '停用'}项目配置</Checkbox>
				<Checkbox disabled={headLook} checked={commonConfig} onChange={onCommonChange}>{commonConfig ? '启用' : '停用'}通用配置</Checkbox>
			</div>
			<div className="operate_log" onClick={() => clickOperateLog()}>操作日志</div>
		</div>
		<Tabs defaultActiveKey="1" onChange={callback} type="card" className="project_tabs">
			<TabPane tab="按项目配置" key="item" className="project_pane">
				<div className="project_class_box">
					<ProjectClass ProjectSelect={(val) => selectProject(val)} />
				</div>
				<div className="Project_allocation_box">
					<Button type="primary" 
						disabled={headLook}
						className="allocation_button"
						onClick={() => openBatchConfig()}>批量配置</Button>
					<ProjectAllocation showData={configData} 
						headLook={headLook}
						cRef={childRef}
						pagination={pagination}
						RefreshList={() => onRefreshList()}
						SelectChangeOperatie={(val) => selectChange(val)} />
				</div>
			</TabPane>
			<TabPane tab="按通用配置" key="common">
				<div className="currency_box">
					<div className="currency_intro">没有配置提成的商品，按商品对应的类目提成配置，给员工计算提成</div>
					<CurrencyAllocation showData={configData}
						headLook={headLook}
						cRef={childRef}
						RefreshList={() => onRefreshList()}
						pagination={pagination}
						SelectChangeOperatie={(val) => selectChange(val)} />
				</div>
			</TabPane>
		</Tabs>
		<Modal title="操作日志"
			visible={operateLogVisible}
			onCancel={() => setOperateLogVisible(false)}
			footer={null}
			width={750}>
			<Spin spinning={operateLogLoading}>
				<Table 
					columns={operateLogColumns}
					dataSource={operateLogData.items}
					rowKey={record => record.id}
					bordered
					size="small"
					pagination={{
						total: operateLogData.total,
						showTotal: total => `共 ${total} 条`,
						pageSize: operateLogData.pageSize,
						onChange: onChangeOperateLogPage,
					}}
				/>
			</Spin>
		</Modal>
		
		<Modal title="批量配置"
			visible={batchVisible}
			confirmLoading={configBtn}
			onCancel={() => setBatchVisible(false)}
			onOk={()=>saveCommissionConfigSetting()}
			width={610}>
				<div className="batch_config_box">
				<table>
					<thead>
					<tr>
						<th>设置提成</th>
						<th>数值</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<td>
						<div className="commission_box">
							<div>
								<RadioGroup onChange={commissionTypeChange} value={commissionType}>
									<Radio value='original_price_ratio'>按原价比例</Radio>
									<Radio value='price_ratio'>按成交价比例</Radio>
									<Radio value='fix_amount'> 固定金额</Radio>
								</RadioGroup>
							</div>
						</div>
						</td>
						<td>
							<div className="number_box">
								<div><InputNumber 
									onChange={commissionValueChange} 
									placeholder="请输入" 
									min={0}
									max={commissionType=='fix_amount' ? 100000 : 100}
									value={commissionValue}
									formatter={commissionType=='fix_amount'?limitDecimals:limitInteger}
									parser={commissionType=='fix_amount'?limitDecimals:limitInteger}
									step={commissionType=='fix_amount'?'0.01':'1'} 
									size="small" />{commissionType=='fix_amount'?'':'%'}
								</div>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
				</div>
		</Modal>
	</div>
	)
}

export default UserCenterStore
