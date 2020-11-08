/** @format */
import React, { useEffect, useState } from 'react'
import { Table, Button, message } from 'antd'
import * as api from '@/api'
import { ColumnProps } from 'antd/lib/table'
import '../style.less'
import Dispatch from './dispatch'
import ServiceProgress from './serviceProgress'
// import { CaretDownOutlined } from '@ant-design/icons'//CaretRightOutlined
interface IProps {
  haveGoodShow,
  customerId,
  haveGoodpopCancel,
  carModelId,
  orderId,
  delChildOrderId,
  payStatus,
  childRefund,

}
const OrderList: React.FC<IProps> = props => {
  const [projectData, setProjectData] = useState<any>()
  const [dispatchShow, setDispatchShow] = useState<boolean>(false)
  const [serviceShow, setServiceShow] = useState<boolean>(false)
  const [orderProductId, setOrderProductId] = useState<string>('')
  const [selectDispatchData, setSelectDispatchData] = useState<any>([])
  useEffect(() => {
    if (props.customerId) {
      getTableData()
    }
  }, [props.customerId])
  const getTableData = async () => {
    const orderData: any = await api.getOrderDetailBuyProduct({ customerId: props.customerId, orderId: props.orderId })
    // let newOrderData: any = []
    // // orderData.data.map((d, index) => {
    // //   d.products && d.products.length > 0 ? d.products.map((i, Cindex) => {
    // //     newOrderData.push({ ...d, products: [i], createTime: Cindex })
    // //   }) : []
    // // })
    // orderData.data.map((d, index) => {
    //   if (d.orderType === "package_type") {
    //     newOrderData.push({ ...d, subItemVos: d.products, })
    //   }
    // })
    // // newOrderData = newOrderData && newOrderData.length > 0 ? newOrderData : orderData.data
    // console.log(newOrderData, '---newOrderData')
    setProjectData([...orderData])
  }
  const deleteOperating = (row) => {
    console.log(row, '删除')
    let data: any = ''
    if (row.orderType === "package_type") {
      api.delChildOrderIdProject(row.childOrderId).then(res => {
        console.log(res, '删除')
        data = res.data
      })
    } else {
      api.delChildOrderIdProduct(row.orderProductId).then(res => {
        console.log(res, '删除')
        data = res.data
      })
    }
    if (data.code === 1) {
      message.success('删除成功')
      getTableData()
    } else {
      message.error(data.msg)
    }
  }
  const onDispatchCancel = () => {
    setDispatchShow(false)
  }
  const onServerCancel = () => {
    setServiceShow(false)
  }
  const childRefund = (row) => {
    console.log(row)
    props.childRefund(row)
  }
  const columns: ColumnProps<any>[] = [
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
    },
    {
      title: '订单商品ID',
      dataIndex: 'orderProductId',
      align: 'center',
      render: (value, row) => (
        <span>{row.products && row.products.length > 0 ? row.products[0].orderProductId : ''}</span>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
      width: 120,
      render: (value, row) => (
        <p>{row.products && row.products.length > 0 ? row.products[0].storeName : ''}</p>
      )
    },
    {
      title: '商品类型',
      dataIndex: 'orderName',
      width: 120,
      align: 'center',
      // render: (value, row) => (
      //   <span>{row.products && row.products.length > 0 ? row.products[0].productTypeName : ''}</span>
      // )
    },
    {
      title: '实付金额',
      width: 80,
      dataIndex: 'subtotalAmt',
      align: 'center',
      render: (value, row) => (
        <span>{row.products && row.products.length > 0 ? row.products[0].subtotalAmt : ''}</span>
      )
    },
    {
      title: '数量',
      dataIndex: 'productNum',
      align: 'center',
      width: 60,
      render: (value, row) => (
        <span>{row.products && row.products.length > 0 ? row.products[0].productNum : ''}</span>
      )
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      render: (value, row) => (
        <>
          <Button type="link" danger disabled={row.isDispatch ? true : false} onClick={() => deleteOperating(row)}>删除</Button>
        </>
      )
    },
  ]
  const columnsPays: ColumnProps<any>[] = [
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
    },
    {
      title: '订单商品ID',
      dataIndex: 'orderProductId',
      align: 'center',
      render: (value, row) => (
        row.products && row.products.length > 0 ? row.products.map(o => (
          <p>{o.orderProductId}</p>
        )) : ""
      )
    },
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
      width: 150,
      render: (value, row) => (
        row.products && row.products.length > 0 ? row.products.map(o => (
          <p>{o.storeName}</p>
        )) : ""
      )
    },

    {
      title: '商品类型',
      dataIndex: 'orderName',
      width: 120,
      align: 'center',
      // render: (value, row) => (
      //   row.products && row.products.length > 0 ? row.products.map(o => (
      //     <p>{o.productTypeName}</p>
      //   )) : ""
      // )
    },
    {
      title: '销售金额',
      width: 80,
      dataIndex: 'totalAmt',
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
        <span>{row.products && row.products.length > 0 ? row.products[0].productNum : ''}</span>
      )
    },
    {
      title: '施工状态',
      dataIndex: 'isDispatch',
      align: 'center',
      width: 80,
      render: (value, row) => (
        <span style={{ color: '#1890ff', cursor: 'pointer' }}>{row.isDispatch ? <span onClick={() => {
          setServiceShow(true)
          setOrderProductId(row.orderProductId)
        }}>已施工</span> : <span >待派工</span>}</span>
      )
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: 80,
      render: (value, row) => (
        <> {
          row.isDispatch ? '' : <Button type="link" onClick={() => {
            setSelectDispatchData(row)
            setDispatchShow(true)

          }}>派工</Button>
        }
          {
            row.payStatus === 'OPS001' ? <Button type="link" disabled={row.isDispatch ? true : false} danger onClick={() => deleteOperating(row)}>删除</Button> : <Button type="link" disabled={row.isDispatch ? true : false} danger onClick={() => childRefund(row)}>退款</Button>
          }

        </>
      )
    },
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
      title: '数量',
      dataIndex: 'qty',
      align: 'center',
    },
    {
      title: '销售金额',
      dataIndex: 'partAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
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
      dataIndex: 'itemAmt',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
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
      dataIndex: 'orderName',
      align: 'center',
      // render: (value, row) => (
      //   row.type === 1 ? '普通商品' : row.type === 2 ? '工时' : row.type === 3 ? '配件' : row.type === 4 ? '项目' : '套餐'
      // )
    },
    {
      title: '商品来源',
      dataIndex: 'sourceId',
      align: 'center',
      render: (value, row) => (
        row.sourceId === 2 ? '维保标准库 未对接' : '本地库未对接'
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
    },
  ]

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

        </div>
      </div>,
    rowExpandable:
      // record => {
      //   console.log(record, '00000000000000')
      // }
      record => record.parts && record.parts.length > 0 || record.items && record.items.length > 0 ? true : false
  };
  const expandable = {
    expandedRowRender: record =>
      <div>
        <div className='accessoriesDetails'>
          <div>
            <p>配件</p>
          </div>
          {
            record.subItemVos && record.subItemVos.length > 0 ?
              <Table
                bordered
                size="middle"
                columns={columnsmealChild}
                expandable={expandableChild}
                dataSource={record.subItemVos}
                rowKey="orderProductId"
                pagination={false}

              /> : <>
                <Table
                  bordered
                  size="middle"
                  columns={columnsParts}
                  dataSource={record.products && record.products.length > 0 ? record.products[0].parts : []}
                  rowKey="orderProductId"
                  pagination={false}
                />
                <div className='workTime'>
                  <p>工时</p>
                </div>
                <Table
                  bordered
                  size="middle"
                  columns={columnsWork}
                  dataSource={record.products && record.products.length > 0 ? record.products[0].items : []}
                  rowKey="orderProductId"
                  pagination={false}
                />
              </>}
        </div>
      </div>,
    rowExpandable: record => record.products && record.products.length > 0 ? true : false
  };
  return (
    <div className='haveGoodsPop commomClass'>
      <Table
        bordered
        size="middle"
        columns={props.orderId ? columnsPays : columns}
        dataSource={projectData}
        rowKey="createTime"
        pagination={false}
        expandable={expandable}
      />
      <Dispatch dispatchShow={dispatchShow} onDispatchCancel={onDispatchCancel} selectDispatchData={selectDispatchData}></Dispatch>
      <ServiceProgress orderProductId={orderProductId} serviceShow={serviceShow} onServerCancel={onServerCancel}></ServiceProgress>
    </div>
  )
}

export default OrderList
