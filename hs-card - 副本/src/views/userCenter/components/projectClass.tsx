/** @format */
import React, {useState} from 'react'
import {Tabs, Table, Spin, message } from 'antd'
import {useRequest} from '@umijs/hooks'
import * as api from '@/api'
import './projectClass.less'
const TabPane = Tabs.TabPane;
interface IProps {
	ProjectSelect: any
}
const ProjectClass: React.FC<IProps> = (props) => {
	const [projectLoading, setProjectLoading] = useState<boolean>(false)
	const [projectData, setProjectData] = useState<any>({})
	const [projectStandardData, setProjectStandardData] = useState<any>([])
	const [rowClassId, setRowClassId] = useState<string>('')
	const columns = [{
		title: '排序',
		dataIndex: 'sort',
		key: 'sort',
		width: '160px',
	}, {
		title: '类目编码',
		dataIndex: 'cateCode',
		key: 'cateCode',
		width: '120px',
	}, {
		title: '类目名称',
		dataIndex: 'cateName',
		key: 'cateName',
		width: '170px',
		ellipsis: true,
	}];
	
	const standardColumns= [{
		title: '类目编码',
		dataIndex: 'id',
		key: 'id',
		width: '100px',
	}, {
		title: '类目名称',
		dataIndex: 'pkgTypeName',
		key: 'pkgTypeName',
		width: '210px',
		ellipsis: true,
	}]
	
	const getProjectList = params => {
		//获取本地项目树形列表
		setProjectLoading(true)
		api.getCategorysNested(params).then(res => {
			setProjectData(res.data)
			let items = res.data.items || []
			window.sessionStorage.setItem("USER_CENTER_CATE_ID", items[0].id)
			props.ProjectSelect({...items[0], refType: 'local'})
			setRowClassId(items[0].id)
			setProjectLoading(false)
		}).catch(err => {
			message.error(err.msg)
			setProjectLoading(false)
		})
	}
	
	const getProjectDicBizList = params => {
		//获取标准项目树形列表
		setProjectLoading(true)
		api.getDicBizType(params).then(res => {
			let data = res.data
			setProjectStandardData(data)
			//if (data.length > 0) {
				window.sessionStorage.setItem("USER_CENTER_CATE_ID", data[0].id)
				props.ProjectSelect({id: data[0].id,cateName: data[0].pkgTypeName, refType: 'standard'})
				setRowClassId(data[0].id)
			//} else {
			//	props.ProjectSelect({cateCode: null,cateName: null, refType: 'standard'})
			//}
			
			setProjectLoading(false)
		}).catch(err => {
			message.error(err.msg)
			setProjectLoading(false)
		})
	}
		
	const onChangeProjectPage = (page, pageSize) => {
		//操作分页
		let params = {
			page: page,
			pageSize: pageSize,
			compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE")
		}
		if (sessionStorage.getItem("USER_CENTER_REF_TYPE") == 'local') {
			getProjectList(params)
		} else {
			getProjectDicBizList(params)
		}
	}

	const callback = (val) => {
		console.log(val)
		let params = {
			page: 1,
			pageSize: 20,
			compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE")
		}
		if (val == 'standard') {
			//标准
			getProjectDicBizList(params)
		}
		if (val == 'local') {
			//本地
			getProjectList(params)
		}
		window.sessionStorage.setItem("USER_CENTER_REF_TYPE", val)
	}
	useRequest(() => getProjectDicBizList({page: 1, pageSize: 20, compCode: sessionStorage.getItem("USER_CENTER_COMP_CODE")}))
	const setRowClassName = (record) => {
		//改变选中行的颜色
		return record.id === rowClassId ? 'select_row_style' : '';
	}
	return (
		<div>
			<div className="project_title">项目分类</div>
			<Tabs defaultActiveKey="1" onChange={callback} type="card">
				<TabPane tab="标准项目" key="standard">
					<Spin spinning={projectLoading}>
						<Table columns={standardColumns}
							dataSource={projectStandardData}
							bordered
							rowKey={record => record.id}
							rowClassName={setRowClassName}
							onRow={(record) => ({
								 onClick: () => {
									props.ProjectSelect({id: record.id,cateName: record.pkgTypeName, refType: 'standard'})
									setRowClassId(record.id)
								 }
							})}
						/>
					</Spin>
				</TabPane>
				<TabPane tab="本地项目" key="local">
					<Spin spinning={projectLoading}>
					<Table columns={columns}
						childrenColumnName="childs"
						dataSource={projectData.items}
						bordered
						rowClassName={setRowClassName}
						rowKey={record => record.id}
						onRow={(record) => ({
						     onClick: () => {
								props.ProjectSelect({refType: 'local', ...record})
								setRowClassId(record.id)
						     }
						})}
						pagination={{
							total: projectData.total,
							showTotal: total => `共 ${total} 条`,
							pageSize: projectData.pageSize,
							onChange: onChangeProjectPage,
						}}
					/>
					</Spin>
				</TabPane>
			</Tabs>
			
		</div>
	)
}

export default ProjectClass
