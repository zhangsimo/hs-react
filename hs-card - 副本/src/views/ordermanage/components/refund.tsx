/** @format */

import React, { useState, useEffect, } from 'react'
import '../style.less'
import { Modal, Spin, Table, InputNumber, message } from 'antd'
// import { formatDate } from '@/interface/customer'
import { ColumnProps } from 'antd/lib/table'
import * as api from '@/api'

interface IProps {
  refundShow,
  onRefundCancel,
  refundPopData,
  onRefundSuccess
}


const ServiceProgress: React.FC<IProps> = props => {
  const [loading, setLoading] = useState<boolean>(false)
	const [serviceItemsOrderList, setServiceItemsOrderList] = useState<any>()
	const [packageOrderList, setPackageOrderList] = useState<any>()
	const [packageSelectedRows, setPackageSelectedRows] = useState<any>([])
	const [serviceItemsSelectedRows, setServiceItemsSelectedRows] = useState<any>([])
  useEffect(() => {
    setLoading(false)
		console.log(88996, props.refundPopData)
    if (props.refundPopData) {
			getOrderData(props.refundPopData)
    }
  }, [props.refundPopData])
  const getOrderData = (orderId) => {
			setLoading(true)
      api.getOrderItemDetail({orderId: orderId}).then(res => {
        const data: any = res.data
        let serviceItemsOrderList = data.serviceItemsOrderList || []
				let products:any = []
				for (let i in serviceItemsOrderList) {
					products.push(...serviceItemsOrderList[i].products)
				}
        setServiceItemsOrderList(products)
        setPackageOrderList(data.packageOrderList)
        setLoading(false)
      })
    }
		
  const onMenuCancel = () => {
    props.onRefundCancel(false)
  }
  const onMenuOk = () => {
		let refundData:any = []
		for (let i in serviceItemsOrderList) {
			console.log(88895, serviceItemsOrderList[i].refundAmt, serviceItemsSelectedRows.indexOf(serviceItemsOrderList[i].orderProductId))
			if (serviceItemsSelectedRows.indexOf(serviceItemsOrderList[i].orderProductId) != -1) {
				refundData.push({orderProductId: serviceItemsOrderList[i].orderProductId, refundAmt: serviceItemsOrderList[i].refundAmt, refundNum: serviceItemsOrderList[i].productNum })
			}
		}
		for (let i in packageOrderList) {
			console.log(88896, packageOrderList[i])
			if (packageSelectedRows.indexOf(packageOrderList[i].orderId) != -1) {
				refundData.push({orderProductId: packageOrderList[i].orderProductId, refundAmt: packageOrderList[i].refundAmt, refundNum: packageOrderList[i].refundNum })
			}
		}
		
		for (let i in refundData) {
			if (refundData[i].refundAmt <= 0) {
				message.error('请输入退款金额')
				return ;
			}
		}
		let refundParams:any = {
			"orderId": props.refundPopData.orderId,
			"refundMethod": "",
			"refundReason": "",
			"refundType": "",
			"items": refundData
		}
		
		console.log(refundParams)
		api.postOrderRefund(refundParams).then(res => {
			console.log(res)
		})
		//props.onRefundSuccess(false)
  }

	
	const onChangeProject = (row, value) => {
		let data:any = serviceItemsOrderList
		for (let i in data) {
			if (data[i].orderProductId == row.orderProductId) {
				data[i].refundAmt = value
			}
		}
		setServiceItemsOrderList([...data])
	}	
	
	const onChangeSetmeal = (row, value) => {
		let data:any = packageOrderList
		for (let i in data) {
			if (data[i].orderId == row.orderId) {
				data[i].refundAmt = value
			}
		}
		setPackageOrderList([...data])
	}	
	
	const projectColumn: ColumnProps<any>[] = [
	  {
	    title: '商品名称',
	    dataIndex: 'storeName',
	  },
	  {
	    title: '商品类型',
	    dataIndex: 'productType',
	    render: (value, row) => (
	      row.productType === 1 ? '普通商品' : row.productType === 2 ? '工时' : row.productType === 3 ? '配件' : row.productType === 4 ? '项目' : '套餐'
	    )
	  },
	  {
	    title: '销售金额',
	    dataIndex: 'saleAmt',
	    align: 'right',
	  },
	  {
	    title: '实付金额',
	    dataIndex: 'subtotalAmt',
	    align: 'right',
	  },
	  {
	    title: '数量',
	    dataIndex: 'productNum',
	    render: (value, row) => (
	      row.unlimitedTimes ? '无限次' : row.productNum
	    )
	  },
		{
		  title: '状态',
		  dataIndex: 'payState',
		  width: 60,
		  align: 'center',
		  render: (value, row) => (
		    <span>{row.payState === 'OPS001' ? '待付款' : row.payState === 'OPS002' ? '已付款' : row.payState === 'OPS003' ? '申请退款' : row.payState === 'OPS004' ? '已退款' : ''}</span>
		  )
		},
		{
		  title: '核销门店',
		  dataIndex: 'usedCompCode',
		  align: 'center',
		},
		{
		  title: '核销状态',
		  dataIndex: 'useState',
			render: (value, row) => {
				switch (row.useState) {
					case 1:
						return '待核销'
						break
					case 2:
						return '待核销'
						break
					case 3:
						return '已核销'
						break
					default:
						return ''
				}
			}
		},
		{
		  title: '可退金额',
		  dataIndex: 'subtotalAmt',
		  align: 'right',
		},
		{
		  title: '退款金额',
		  dataIndex: 'refundAmt',
		  align: 'center',
			render: (value, row) => (
				<InputNumber min={0} max={row.subtotalAmt} step={0.1} onChange={(value) => onChangeProject(row, value)} />
			)
		},
		{
		  title: '最后更新时间',
		  dataIndex: 'updateTime',
		  align: 'center',
		},
		{
		  title: '最后更新人',
		  dataIndex: 'updateBy',
		}
	]
	const setmealColumn: ColumnProps<any>[] = [
	  {
	    title: '商品名称',
	    dataIndex: 'orderName',
	  },
	  {
	    title: '商品类型',
	    dataIndex: 'orderTypeName',
	  },
	  {
	    title: '销售金额',
	    dataIndex: 'totalAmt',
	    align: 'right',
	  },
	  {
	    title: '实付金额',
	    dataIndex: 'payableAmt',
	    align: 'right',
	  },
	  {
	    title: '数量',
	    dataIndex: '',
	    width: 60,
	    align: 'center',
	    render: (value, row) => (
	      row.unlimitedTimes ? '无限次' : row.productNum
	    )
	  },
	  {
	    title: '状态',
	    dataIndex: 'payState',
	    width: 60,
	    render: (value, row) => (
	      <span>{row.payState === 'OPS001' ? '待付款' : row.payState === 'OPS002' ? '已付款' : row.payState === 'OPS003' ? '申请退款' : row.payState === 'OPS004' ? '已退款' : ''}</span>
	    )
	  },
	  {
	    title: '可退金额',
	    dataIndex: 'payableAmt',
	    align: 'right',
	  },
	  {
	    title: '退款金额',
	    dataIndex: 'refundAmt',
	    align: 'center',
			render: (value, row) => (
				<InputNumber min={0} max={row.payableAmt} step={0.1} onChange={(value) => onChangeSetmeal(row, value)} />
			)
		},
		{
			title: '最后更新时间',
			dataIndex: 'updateTime',
			align: 'center',
		},
		{
			title: '最后更新人',
			dataIndex: 'updateBy',
		}
	]
	const rowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
			setServiceItemsSelectedRows(selectedRowKeys)
	    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	  },
	  getCheckboxProps: record => ({
	    disabled: record.name === 'Disabled User', // Column configuration not to be checked
	    name: record.name,
	  }),
	};
	
	const PackageRowSelection = {
	  onChange: (selectedRowKeys, selectedRows) => {
			setPackageSelectedRows(selectedRowKeys)
	    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	  },
	  getCheckboxProps: record => ({
	    disabled: record.name === 'Disabled User', // Column configuration not to be checked
	    name: record.name,
	  }),
	};

  return (
    <div className='payWay'>
      <Modal title='退款商品明细' visible={props.refundShow} onCancel={onMenuCancel} onOk={onMenuOk} width={1200} getContainer={false} okText="退款" >
        <Spin spinning={loading}>
          <div className="orderdetailC">
            <div className="ctitle ctitlem">
              <span>项目商品</span>
            </div>
            <Table
							rowSelection={rowSelection}
              bordered
              size="middle"
              columns={projectColumn}
              dataSource={serviceItemsOrderList}
              rowKey="orderProductId"
              pagination={false}
            />
          </div>
          
          <div className="orderdetailC">
            <div className="ctitle ctitlem">
              <span>购买套餐</span>
            </div>
            <Table
              bordered
							rowSelection={PackageRowSelection}
              size="middle"
              columns={setmealColumn}
              dataSource={packageOrderList}
              rowKey="orderId"
              pagination={false}
            />
          </div>
        </Spin>
      </Modal>

    </div>
  )
}

export default ServiceProgress
