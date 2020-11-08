/** @format */

import React, { useState, useEffect } from 'react'//useState
import { Table, InputNumber, Button, Modal } from 'antd' //Row, Col
// import { CaretDownOutlined } from '@ant-design/icons'
//import * as api from '@/api'
// import { useForm } from 'antd/lib/form/util'
// import useAntdTable from '@/hooks/useAntdTable'
// import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import ReplaceParts from './replaceParts'
import Dispatch from './dispatch'
import ServiceProgress from './serviceProgress'
// import { values } from 'lodash'
// import AddlocalGood from './addGoodTable'
interface IProps {
  sign,
  payStatus,
  serviceItemsOrderList,
  carModelId,
  delChildOrderId,
  goodType?,
  childRefund,
  refreshDeatailData?
}

let GoodMix: React.FC<IProps> = props => {
  const [serviceItemsList, setServiceItemsList] = useState<any>([])
  const [replacePartShow, setReplacePartShow] = useState<boolean>(false)
  const [replaceWorkShow, setReplaceWorkShow] = useState<boolean>(false)
  const [replaceTitpop, setReplaceTitpop] = useState<string>('')
  const [dispatchShow, setDispatchShow] = useState<boolean>(false)
  const [serviceShow, setServiceShow] = useState<boolean>(false)
  const [orderProductId, setOrderProductId] = useState<string>('')
  const [partorderProductId, setPartorderProductId] = useState<string>('')
  const [selectDispatchData, setSelectDispatchData] = useState<any>([])
  useEffect(() => {
    if (props.serviceItemsOrderList) {
      let serviceList: any = []
      props.serviceItemsOrderList.map((d, index) => {
        d.products && d.products.length > 0 ? d.products.map((i, Cindex) => {
          serviceList.push({ ...d, ...i })
        }) : serviceList.push({ ...d })
      })
      setServiceItemsList(serviceList)
    }
  }, [props.serviceItemsOrderList])

  const replacePartsCancel = () => {
    setReplacePartShow(false)
    setReplaceWorkShow(false)
  }
  const getReplacePartsData = (val) => {
    let serviceItemsListN = serviceItemsList.map((d, index) => {
      let newd = d.orderProductId === orderProductId && d.parts && d.parts.length > 0 ? d.parts.map((i, Cindex) => {
        let newi = i.orderProductId === partorderProductId ? [val] : i
        return { ...d, parts: newi }
      })[0] : d
      return newd
    })
    setServiceItemsList(serviceItemsListN)
  }
	
  const getWorkingHoursCallBack = (val) => {
    console.log('工时返回的数据')
    console.log(val)
  }

  const onChange = (val) => {
    console.log(val, '加减法')
  }
  const onDispatchCancel = () => {
    setDispatchShow(false)
  }
  const onServerCancel = () => {
    setServiceShow(false)
  }
  const partsReplace = (row) => {
    setPartorderProductId(row.orderProductId)
    setReplacePartShow(true)
    setReplaceTitpop('更换配件')
  }
  const deleteOperating = (row) => {
    console.log(row, '删除')
    props.delChildOrderId(row)
  }
  const childRefund = (row) => {
    props.childRefund(row)
  }
  const onDispatchSucess = () => {
    props.refreshDeatailData()
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '商品类型',
      dataIndex: 'orderTypeName',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'saleAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'payAmt',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: '',
      width: 60,
      align: 'center',
      render: (value, row) => (
        <InputNumber min={1} max={100000} defaultValue={1} onChange={onChange} />
      )
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (value, row) => (
        <>
          <Button type="link" danger >删除</Button>
					
        </>
      )
    },
  ]
  const toDispatched = () => {
    Modal.warning({
      content: `该子单未派工，请派工!`,
    });
  }
  const columnsHaveGood: ColumnProps<any>[] = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      align: 'center',
      width: 150
    },
    {
      title: '子单号',
      dataIndex: 'childOrderId',
      align: 'center',
      width: 100
    },
    {
      title: '类型',
      dataIndex: 'orderTypeName',
      align: 'center',
      width: 80,
    },
    {
      title: '订单商品ID',
      dataIndex: 'orderProductId',
      align: 'center',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
      width: 150,
    },

    {
      title: '商品类型',
      dataIndex: 'orderName',
      width: 120,
      align: 'center',
    },
    {
      title: '销售金额',
      width: 80,
      dataIndex: 'saleAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      width: 80,
      dataIndex: 'payAmt',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'productNum',
      align: 'center',
      width: 60,
      render: (value, row) => (
        row.unlimitedTimes ? '无限次' : row.productNum
      )
    },
    {
      title: '施工状态',
      dataIndex: 'isDispatch',
      align: 'center',
      width: 80,
      render: (value, row) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }}>
          {row.isDispatch ? <span onClick={() => {
            setServiceShow(true)
            setOrderProductId(row.orderProductId)
          }}>
            已派工
        </span> : <span onClick={toDispatched}>待派工</span>}</span>
      )
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 80,
      render: (value, row) => (
        <>
          {
            row.isDispatch ? '' :
              <Button type="link" onClick={() => {
                setSelectDispatchData(row)
                setDispatchShow(true)

              }}>派工</Button>
          }
          {
            props.payStatus === 'OPS001' ? <Button type="link" disabled={row.isDispatch ? true : false} danger onClick={() => deleteOperating(row)}>删除</Button> : <Button type="link" disabled={row.isDispatch || row.payState === 'OPS004' ? true : false} danger onClick={() => childRefund(row)}>退款</Button>
          }

        </>
      )
    },
  ]
  const columnsPays: ColumnProps<any>[] = [
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '商品类型',
      dataIndex: 'orderTypeName',
      align: 'center',
      // render: (value, row) => (
      //   row.type === 1 ? '普通商品' : row.type === 2 ? '工时' : row.type === 3 ? '配件' : row.type === 4 ? '项目' : '套餐'
      // )
    },
    {
      title: '销售金额',
      dataIndex: 'saleAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'productNum',
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
      align: 'center',
      render: (value, row) => (
        <span>{row.payState === 'OPS001' ? '待付款' : row.payState === 'OPS002' ? '已付款' : row.payState === 'OPS003' ? '申请退款' : row.payState === 'OPS004' ? '已退款' : ''}</span>
      )
    },
    {
      title: '核销门店',
      dataIndex: 'payCompCode',
      align: 'center',
			ellipsis: true,
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
      title: '施工状态',
      dataIndex: 'isDispatch',
      align: 'center',
      render: (value, row) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }}>{row.isDispatch ? <span onClick={() => {
          setServiceShow(true)
          setOrderProductId(row.orderProductId)
        }}>已派工</span> : <span onClick={toDispatched}>待派工</span>}</span>
      )
    },
		{
		  title: '技师',
		  dataIndex: 'updateTime',
		  width: 80,
			ellipsis: true,
			render: (value, row) => (
				<span style={{cursor: 'pointer', color: '#1890ff'}} onClick={() => {
					setSelectDispatchData(row)
					setDispatchShow(true)
				}}>
					{
						row.holdMans.length > 0 ?
							row.holdMans.map((item, i) => (
								item.holdMan + '; '
							))
						: '派工'
					}
				</span>
			)
		},
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (value, row) => (
        <> 
				{
					
          // row.isDispatch || row.payState === 'OPS004' ? '' : <Button type="link" disabled={row.payState === 'OPS004' ? true : false} onClick={() => {
          //   setSelectDispatchData(row)
          //   setDispatchShow(true)
          // }}>派工</Button>
        }
          {
            row.payState === 'OPS001' ? <Button type="link" disabled={row.isDispatch ? true : false} danger onClick={() => deleteOperating(row)}>删除</Button> : <Button type="link" disabled={row.isDispatch || row.payState === 'OPS004' ? true : false} danger onClick={() => childRefund(row)}>退款</Button>
          }
					
        </>
      )
    },
  ]
  const columnsmeal: ColumnProps<any>[] = [
    {
      title: '商品名称3',
      dataIndex: 'orderName',
      align: 'center',
    },
    {
      title: '商品类型',
      dataIndex: 'orderTypeName',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'totalAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'payableAmt',
      align: 'center',

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
      align: 'center',
      render: (value, row) => (
        <span>{row.payState === 'OPS001' ? '待付款' : row.payState === 'OPS002' ? '已付款' : row.payState === 'OPS003' ? '申请退款' : row.payState === 'OPS004' ? '已退款' : ''}</span>
      )
    },
    // {
    //   title: '核销门店',
    //   dataIndex: 'compCode',
    //   align: 'center',
    // },
    // {
    //   title: '施工状态',
    //   dataIndex: 'isDispatch',
    //   align: 'center',
    //   render: (value, row) => (
    //     <span style={{ color: '#1890ff', cursor: 'pointer' }}>{row.isDispatch ? <span onClick={() => {
    //       setServiceShow(true)
    //       setOrderProductId(row.orderProductId)
    //     }}>已施工</span> : <span>待派工</span>}</span>
    //   )
    // },
    {
      title: '最后更新时间',
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (value, row) => (
        <>
          {
            props.payStatus === 'OPS001' ? <Button type="link" disabled={row.isDispatch ? true : false} danger onClick={() => deleteOperating(row)}>删除</Button> : <Button type="link" danger disabled={row.payState === 'OPS004' ? true : false} onClick={() => childRefund(row)}>退款</Button>//disabled={row.isDispatch ? true : false}
          }
					
        </>
      )
    },

  ]
  const columnsmealChild: ColumnProps<any>[] = [
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '商品类型',
      dataIndex: 'productType',
      align: 'center',
      render: (value, row) => (
        row.productType === 1 ? '普通商品' : row.productType === 2 ? '工时' : row.productType === 3 ? '配件' : row.productType === 4 ? '项目' : '套餐'
      )
    },
    {
      title: '商品来源',
      dataIndex: 'sourceId',
      align: 'center',
      render: (value, row) => (
        //source_local
        row.sourceId === "source_std" ? '维保标准库' : '本地库'
      )
    },
    {
      title: '销售金额',
      dataIndex: 'saleAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'productNum',
      align: 'center',
      render: (value, row) => (
        row.unlimitedTimes ? '无限次' : row.productNum
      )
    }
  ]
  const columnsParts: ColumnProps<any>[] = [
    {
      title: '配件名称',
      dataIndex: 'partName',
      align: 'center',
    },
    {
      title: '配件编码',
      dataIndex: 'partCode',
      align: 'center',
    },
    {
      title: '配件品牌',
      dataIndex: 'partBrandName',
      align: 'center',
    },
    {
      title: '品质',
      dataIndex: 'qualityName',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'salePrice',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'salePrice',
      align: 'center',
    },
  ]
  const columnsPartsPays: ColumnProps<any>[] = [
    {
      title: '配件名称',
      dataIndex: 'partName',
      align: 'center',
    },
    {
      title: '配件编码',
      dataIndex: 'partCode',
      align: 'center',
    },
    {
      title: '配件品牌',
      dataIndex: 'partBrandName',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'partAmt',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'qty',
      align: 'center',
      // render: (value, row) =>
      //   (
      //     props.payStatus === "OPS001" ?
      //       <InputNumber min={1} max={1000} defaultValue={row.qty} onChange={onChange}  /> : <span>{row.qty}</span>
      //   )
    },
    {
      title: '折扣率',
      dataIndex: 'partRate',
      align: 'center',
      render: (values, row) => (
        `${row.partRate}%`
      )
      // render: (value, row) => (
      //   props.payStatus === "OPS001" ?
      //     <InputNumber defaultValue={row.partRate} onChange={onChange} formatter={value => `${value}%`} min={0}
      //       max={100} disabled /> : <span>{row.partRate}</span>
      // )
    },
    {
      title: '折扣后金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
      // render: (value, row) => (
      //   props.payStatus === "OPS001" ?
      //     <InputNumber defaultValue={row.subtotalAmt} onChange={onChange} disabled /> : <span>{row.subtotalAmt}</span>
      // )
    },
    {
      title: '操作',
      dataIndex: 'subtotalAmt',
      align: 'center',
      render: (value, row: any) => {
        return (
          <Button type="link" onClick={() => partsReplace(row)} disabled>更换</Button>
        )
      },
    },
  ]
  const columnsWork: ColumnProps<any>[] = [
    {
      title: '工时名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '工时编码',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '工时单价',
      dataIndex: 'unitPrice',
      align: 'center',
    },
    {
      title: '工时数',
      dataIndex: 'itemTime',
      align: 'center',
    },
    {
      title: '工时金额',
      dataIndex: 'salePrice',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'salePrice',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (value, row) => (
        <>
          <Button type="link" onClick={() => {
            setReplaceWorkShow(true)
            setReplaceTitpop('更换工时')
          }}>更换</Button>
        </>
      )
    },
  ]
  const columnsWorkpays: ColumnProps<any>[] = [
    {
      title: '工时名称',
      dataIndex: 'itemName',
      align: 'center',
    },
    {
      title: '工时编码',
      dataIndex: 'itemCode',
      align: 'center',
    },
    {
      title: '工时单价',
      dataIndex: 'unitPrice',
      align: 'center',
    },
    {
      title: '工时数',
      dataIndex: 'itemTime',
      align: 'center',
    },
    {
      title: '工时金额',
      dataIndex: 'itemAmt',
      align: 'center',
    },
    {
      title: '折扣率',
      dataIndex: 'discountRate',
      align: 'center',
      render: (values, row) => (
        `${row.discountRate}%`
      )
      // render: (value, row) => (
      //   props.payStatus === 'OPS001' ?
      //     <InputNumber defaultValue={row.discountRate} onChange={onChange} formatter={value => `${value}%`} min={0}
      //       max={100} disabled /> : <span>{row.discountRate + '%'}</span>
      // )
    },
    {
      title: '折扣后金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
      // render: (value, row) => (
      //   props.payStatus === 'OPS001' ?
      //     <InputNumber defaultValue={row.subtotalAmt} onChange={onChange} disabled /> : <span>{row.subtotalAmt}</span>
      // )
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (value, row) => (
        <>
          <Button type="link" disabled onClick={() => {
            setReplaceWorkShow(true)
            setReplaceTitpop('更换工时')
          }}>更换</Button>
        </>
      )
    },
  ]
  const expandable = {
    expandedRowRender: record =>
      <div>
        <div className='accessoriesDetails'>
          <div>
            {record.thisTimePayment === 2 ?
              <>
                <span className='tableTabs'> {record.childOrderType === "service_item_type" ? '已购' : '套餐已购'}</span>
                <span className='tableorderId'>订单号:{record.originalOrderId}</span>
              </> : ''}
          </div>
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
                      columns={props.payStatus === 'OPS002' || props.payStatus === 'OPS001' ? columnsPartsPays : columnsParts}
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
                      columns={props.payStatus === 'OPS002' || props.payStatus === 'OPS001' ? columnsWorkpays : columnsWork}
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
                  columns={columnsPartsPays}
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
                  columns={columnsWorkpays}
                  dataSource={record.items}
                  rowKey="productItemId"
                  pagination={false}
                /></> : ''
          }

        </div>
      </div>,
    rowExpandable:
      // record => {
      //   console.log(record, '00000000000000')
      // }
      record => record.parts && record.parts.length > 0 || record.items && record.items.length > 0 ? true : false
  };
  const onExpandedRowsChange = (expanded, record) => {
    setOrderProductId(record.orderProductId)
  }
  return (
    <div className='localGood commomClass'>
      <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
        <Table
          bordered
          size="middle"
          columns={props.sign === 'haveGood' ? columnsHaveGood : props.goodType === 'meal' ? columnsmeal : props.payStatus === 'OPS002' || props.payStatus === 'OPS001' ? columnsPays : columns}
          // {...tableProps}
          dataSource={serviceItemsList}
          expandable={expandable}
          onExpand={onExpandedRowsChange}
          rowKey={props.goodType === 'meal' ? "childOrderId" : "orderProductId"}
          pagination={false}
        />
      </div>
      <ReplaceParts replacePartShow={replacePartShow} replacePartsCancel={replacePartsCancel}
        getReplacePartsData={getReplacePartsData} carModelId={props.carModelId} replaceTitpop={replaceTitpop}
        replaceWorkShow={replaceWorkShow} getWorkingHoursCallBack={getWorkingHoursCallBack}></ReplaceParts>{/* 更换配件&工时 */}
      <Dispatch dispatchShow={dispatchShow} onDispatchCancel={onDispatchCancel} selectDispatchData={selectDispatchData} onDispatchSucess={onDispatchSucess}></Dispatch>
      <ServiceProgress orderProductId={orderProductId} serviceShow={serviceShow} onServerCancel={onServerCancel}></ServiceProgress>

    </div>
  )
}

export default GoodMix
