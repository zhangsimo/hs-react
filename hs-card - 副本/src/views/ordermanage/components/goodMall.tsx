/** @format */
/*
*线上商城详情商品显示
*/
import React, { useState, useEffect } from 'react'//useState
import { Table, Button, Modal, Form, Radio, Row, Col, Input, message } from 'antd' //Row, Col
import * as api from '@/api'
import { ColumnProps } from 'antd/lib/table'


interface IProps {
  serviceItemsOrderList,
  goodType?,
  childRefund
}

const GoodMall: React.FC<IProps> = props => {
	const [formMenu] = Form.useForm()
  const [serviceItemsList, setServiceItemsList] = useState<any>([])
	const [hexiaoData, setHexiaoData] = useState<string>('')
	const [hexiaoType, setHexiaoType] = useState<any>()
	const [hexiaoVisible, setHexiaoVisible] = useState<boolean>(false)

  useEffect(() => {
    if (props.serviceItemsOrderList) {
      let serviceList: any = []
      props.serviceItemsOrderList.map((d, index) => {
        d.products && d.products.length > 0 ? d.products.map((i, Cindex) => {
          serviceList.push({ ...d, ...i })
        }) : serviceList.push({ ...d })
      })
			formMenu.setFieldsValue({type: 1})
      setServiceItemsList(serviceList)
    }
  }, [props.serviceItemsOrderList])


  // const getReplacePartsData = (val) => {
  //   let serviceItemsListN = serviceItemsList.map((d, index) => {
  //     let newd = d.orderProductId === orderProductId && d.parts && d.parts.length > 0 ? d.parts.map((i, Cindex) => {
  //       let newi = i.orderProductId === partorderProductId ? [val] : i
  //       return { ...d, parts: newi }
  //     })[0] : d
  //     return newd
  //   })
  //   setServiceItemsList(serviceItemsListN)
  // }
	
	const showHexiao = (row) => {
		//核销显示弹窗
		setHexiaoVisible(true)
		setHexiaoData(row.orderProductId)
	}
	const onChangeHexiaoType = (e) => {
		let type = e.target.value
		if (type == 1) {
			formMenu.setFieldsValue({writeOffShopCode: null})
		}
		setHexiaoType(type)
	}
	const hexiaoOk = () => {
		//确定核销
		formMenu.validateFields().then(res => {
		  let params = (formMenu.getFieldValue as any)()
		  console.log(params, hexiaoData, '---params')

		  if (hexiaoData) {
		    api.postOrderWriteOff({ ...params, orderProductId: hexiaoData }).then(res => {//简单修改客户
					console.log(res)
					if (res.data) {
						message.warning(res.msg)
						setHexiaoVisible(false)
					} else {
						message.warning(res.msg)
					}
		    })
		  } else {
		    message.warning('orderProductId为空')
		  }
		})
		//
	}
	const hexiaoCancel = () => {
		//取消
		setHexiaoVisible(false)
	}
	const childRefund = (row) => {
		props.childRefund(row)
	}
const columns: ColumnProps<any>[] = [
	{
		title: '商品名称',
		dataIndex: 'storeName',
		ellipsis: true,
	},
	{
		title: '商品类型',
		dataIndex: 'orderTypeName',
		width: 80,
	},
	{
		title: '销售金额',
		dataIndex: 'saleAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '实付金额',
		dataIndex: 'subtotalAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '数量',
		dataIndex: 'productNum',
		width: 70,
		render: (value, row) => (
			row.unlimitedTimes ? '无限次' : row.productNum
		)
	},
	{
		title: '状态',
		dataIndex: 'payState',
		width: 80,
		render: (value, row) => (
			<span>{row.payState === 'OPS001' ? '待付款' : row.payState === 'OPS002' ? '已付款' : row.payState === 'OPS003' ? '申请退款' : row.payState === 'OPS004' ? '已退款' : ''}</span>
		)
	},
	{
		title: '核销门店',
		dataIndex: 'payCompCode',
		ellipsis: true,
	},
	{
		title: '核销状态',
		dataIndex: 'useState',
		width: 80,
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
		title: '最后更新时间',
		dataIndex: 'updateTime',
		align: 'center',
		width: 160,
	},
	{
		title: '操作',
		dataIndex: '',
		align: 'center',
		width: 140,
		render: (value, row) => (
			<> 
				<Button type="link" onClick={() => showHexiao(row)} disabled={!(Number(row.useState)==1 && row.payState == 'OPS002' && Number(row.refundState) == 0)}>核销</Button>
				<Button type="link" disabled={true} danger onClick={() => childRefund(row)}>退款</Button>
			</>
		)
	},
]
const columnsmeal: ColumnProps<any>[] = [
	{
		title: '商品名称',
		dataIndex: 'orderName',
		ellipsis: true,
	},
	{
		title: '商品类型',
		dataIndex: 'orderTypeName',
		width: 80,
	},
	{
		title: '销售金额',
		dataIndex: 'totalAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '实付金额',
		dataIndex: 'payableAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '数量',
		dataIndex: '',
		width: 70,
		render: (value, row) => (
			row.unlimitedTimes ? '无限次' : row.productNum
		)
	},
	{
		title: '状态',
		dataIndex: 'payState',
		width: 80,
		render: (value, row) => {
			switch (row.payState) {
				case 'OPS001':
					return '待付款'
					break
				case 'OPS002':
					return '已付款'
					break
				case 'OPS003':
					return '申请退款'
					break
				case 'OPS004':
					return '已退款'
					break
				default:
					return ''
			}
		}
	},
	{
		title: '最后更新时间',
		dataIndex: 'updateTime',
		align: 'center',
		width: 160,
	},
	{
		title: '操作',
		dataIndex: '',
		align: 'center',
		width: 90,
		render: (value, row) => (
			<>
				<Button type="link" danger disabled={true} onClick={() => childRefund(row)}>退款</Button>
			</>
		)
	},

]
const columnsmealChild: ColumnProps<any>[] = [
	{
		title: '商品名称',
		dataIndex: 'storeName',
		ellipsis: true,
	},
	{
		title: '商品类型',
		dataIndex: 'productType',
		width: 80,
		render: (value, row) => {
			switch (row.productType) {
				case 1:
					return '普通商品'
					break
				case 2:
					return '工时'
					break
				case 3:
					return '配件'
					break
				case 4:
					return '项目'
					break
				case 5:
					return '套餐'
					break
				default:
					return ''
			}
		}
	},
	{
		title: '商品来源',
		dataIndex: 'sourceId',
		width: 80,
		render: (value, row) => (
			//source_local
			row.sourceId === "source_std" ? '维保标准库' : '本地库'
		)
	},
	{
		title: '销售金额',
		dataIndex: 'saleAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '实付金额',
		dataIndex: 'subtotalAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '数量',
		dataIndex: 'productNum',
		width: 70,
		render: (value, row) => (
			row.unlimitedTimes ? '无限次' : row.productNum
		)
	},
	{
		title: '操作',
		dataIndex: 'subtotalAmt',
		align: 'center',
		width: 90,
		render: (value, row: any) => {
			return (
				<Button type="link" onClick={() => showHexiao(row)} disabled={!(Number(row.useState)==1 && row.payState == 'OPS002' && Number(row.refundState) == 0)}>核销</Button>
			)
		},
	},
]
const columnsParts: ColumnProps<any>[] = [
	{
		title: '配件名称',
		dataIndex: 'partName',
		ellipsis: true,
	},
	{
		title: '配件编码',
		dataIndex: 'partCode',
		ellipsis: true,
	},
	{
		title: '配件品牌',
		dataIndex: 'partBrandName',
	},
	{
		title: '品质',
		dataIndex: 'qualityName',
	},
	{
		title: '销售金额',
		dataIndex: 'salePrice',
		align: 'right',
		width: 90,
	},
	{
		title: '实付金额',
		dataIndex: 'subtotalAmt',
		align: 'right',
		width: 90,
	},
]

const columnsWork: ColumnProps<any>[] = [
	{
		title: '工时名称',
		dataIndex: 'itemName',
		ellipsis: true,
	},
	{
		title: '工时编码',
		dataIndex: 'itemCode',
		ellipsis: true,
	},
	{
		title: '工时单价',
		dataIndex: 'unitPrice',
		align: 'right',
		width: 90,
	},
	{
		title: '工时数',
		dataIndex: 'itemTime',
		width: 70,
	},
	{
		title: '工时金额',
		dataIndex: 'subtotalAmt',
		align: 'right',
		width: 90,
	},
	{
		title: '实付金额',
		dataIndex: 'subtotalAmt',
		align: 'right',
		width: 90,
	}
]
  
  const expandable = {
    expandedRowRender: record =>
      <div>
        <div className='accessoriesDetails'>
          {record.subItemVos && record.subItemVos.length > 0 ?
            <>
              <div>
                <p>项目</p>
              </div>
              <Table
                bordered
                size="middle"
                columns={columnsmealChild}
                expandable={expandableChild}
                dataSource={record.subItemVos}
                rowKey="orderProductId"
                pagination={false}
              /></> : <>
              {
                record.parts && record.parts.length > 0 ?
                  <>
                    <div style={{ marginTop: '10px' }}>
                      <p>配件</p>
                    </div>
                    <Table
                      bordered
                      size="middle"
                      columns={columnsParts}
                      dataSource={record.parts}
                      rowKey="oemCode"
                      pagination={false}
                    /></> : ''
              }

              {
                record.items && record.items.length > 0 ?
                  <>
                    <div className='workTime'>
                      <p>工时</p>
                    </div>
                    <Table
                      bordered
                      size="middle"
                      columns={columnsWork}
                      dataSource={record.items}
                      rowKey="itemCode"
                      pagination={false}
                    /></> : ''
              }
            </>
          }

        </div>
      </div>,
    rowExpandable:
      record => record.subItemVos && record.subItemVos.length > 0 || record.parts && record.parts.length > 0 || record.items && record.items.length > 0 ? true : false
  };


  const expandableChild = {
    expandedRowRender: record =>
      <div>
        <div className='accessoriesDetails'>
          {
            record.parts && record.parts.length > 0 ?
              <>
                <div>
                  <p>配件</p>
                </div>
                <Table
                  bordered
                  size="middle"
                  columns={columnsParts}
                  dataSource={record.parts}
                  rowKey="productPartId"
                  pagination={false}
                /></> : ''
          }

          {
            record.items && record.items.length > 0 ?
              <>
                <div className='workTime'>
                  <p>工时</p>
                </div>
                <Table
                  bordered
                  size="middle"
                  columns={columnsWork}
                  dataSource={record.items}
                  rowKey="productItemId"
                  pagination={false}
                /></> : ''
          }

        </div>
      </div>,
    rowExpandable:
      record => record.parts && record.parts.length > 0 || record.items && record.items.length > 0 ? true : false
  };

  return (
    <div className='localGood commomClass'>
      <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
        <Table
          bordered
          size="middle"
          columns={props.goodType === 'meal' ? columnsmeal : columns}
          // {...tableProps}
          dataSource={serviceItemsList}
          expandable={expandable}
          rowKey={props.goodType === 'meal' ? "childOrderId" : "orderProductId"}
          pagination={false}
        />
      </div>
			
			{/*弹出核销*/}
			<Modal
					title="核销"
					visible={hexiaoVisible}
					onOk={hexiaoOk}
					onCancel={hexiaoCancel}
				>
					<Form form={formMenu} >
					  <Row>
					    <Col span={24}>
					      <Form.Item name="writeOffCode" label="核销码" rules={[{ required: true }]}>
					        <Input allowClear placeholder="请输入客户核销码"></Input>
					      </Form.Item>
					    </Col>
					   
					  </Row>
					  <Row>
					    <Col span={24}>
								<Form.Item name="type">
									<Radio.Group onChange={onChangeHexiaoType}>
										<Radio value={1}>本店核销</Radio>
										<Radio value={2}>跨店核销
											<Form.Item name="writeOffShopCode" rules={[{ required: hexiaoType==2, message: '请输入核销门店编码' }]} style={{margin: '0 0 0 10px', display: 'inline-flex'}}>
												<Input allowClear  placeholder="请输入核销门店编码"></Input>
											</Form.Item>
										</Radio>
									</Radio.Group>
								</Form.Item>
					    </Col>
					  </Row>
					  <Row>
					    <Col span={24}>
								跨店核销时，请直接输入核销门店编号，根据实际核销门店进行结算
					    </Col>
					  </Row>
					</Form>
				</Modal>
    </div>
  )
}

export default GoodMall
