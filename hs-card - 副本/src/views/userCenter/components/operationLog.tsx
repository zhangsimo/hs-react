/** @format */
import React from 'react'
import {Modal, Table } from 'antd'

interface IProps {
  visible: boolean
  setVisible: () => void
}

const columns = [{
	  title: '时间',
	  dataIndex: 'name',
	  key: 'name',
	  width: '153px',
	}, {
	  title: '姓名',
	  dataIndex: 'age',
	  key: 'age',
	  width: '148px',
	}, {
	  title: '工单',
	  dataIndex: 'address',
	  key: 'address',
	  width: '174px',
	}, {
	  title: '操作',
	  dataIndex: 'address',
	  key: 'address',
	  width: '217px',
	}];
	
	const dataSource = [{
	  key: '1',
	  name: '胡彦斌',
	  age: 32,
	  radio: 1,
	  jishi: 2,
	  address: '西湖区湖底公园1号',
	}, {
	  key: '2',
	  name: '胡彦祖',
	  age: 42,
	  radio: 2,
	  jishi: 3,
	  address: '西湖区湖底公园1号',
	}, {
	  key: '3',
	  name: '李大嘴',
	  age: 2,
	  radio: 3,
	  jishi: 1,
	  address: '西湖区湖底公园1号',
	}];
const OperationLog: React.FC<IProps> = ({...props}) => {
	console.log(258, props)
	return (
		<div>
			<Modal title="操作日志" 
				visible={props.visible}
				onCancel={() => props.setVisible()}
				footer={null}>
		        <Table 
					columns={columns}
		        	dataSource={dataSource}
		        	rowKey={record => record.key}
					pagination={false}
		        />
			</Modal>
			
		</div>
	)
}

export default OperationLog
