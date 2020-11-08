/** @format */
import React, { useEffect, useState } from 'react'
import { Modal, message, Table } from 'antd'
import * as api from '@/api'
import { ColumnProps } from 'antd/lib/table'
import '../style.less'
import { CaretDownOutlined } from '@ant-design/icons'//CaretRightOutlined
interface IProps {
  haveGoodShow,
  customerId,
  haveGoodpopCancel,
  carModelId
}
const OrderList: React.FC<IProps> = props => {
  const [projectData, setProjectData] = useState<any>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  useEffect(() => {
    if (props.haveGoodShow) {
      console.log('已购项目展示')
      getTableData()
    }
  }, [props.haveGoodShow])
  const getTableData = async () => {
    const orderData: any = await api.getOrderCustomerOrder({ customerId: props.customerId })
    const mealData: any = await api.getOrderCustomerPackage({ customerId: props.customerId })
    let newOrderData: any = []
    orderData.data.map((d, index) => {
      d.products && d.products.length > 0 ? d.products.map((i, Cindex) => {
        newOrderData.push({ ...d, products: [i], createTime: Cindex })
      }) : []
    })
    newOrderData = newOrderData && newOrderData.length > 0 ? newOrderData : orderData.data
    console.log([...mealData.data, ...newOrderData], '---v[...mealData.data, ...newOrderData]')
    setProjectData([...mealData.data, ...newOrderData])
  }

  const onMenuCancel = () => {
    props.haveGoodpopCancel()
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }
  const onMenuOk = () => {
    if (!selectedRows.length) {
      message.warning('请选择项目')
      return false
    }
    console.log(selectedRows, '已选好的项目')
    return 1
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
      dataIndex: 'productTypeName',
      width: 120,
      align: 'center',
      render: (value, row) => (
        <span>{row.products && row.products.length > 0 ? row.products[0].productTypeName : ''}</span>
      )
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
  const expandable = {
    expandedRowRender: record =>
      <div>
        <div className='accessoriesDetails'>
          <div className='operating'>
            <CaretDownOutlined />
            <p>明细</p>
          </div>
          <div>
            <p>配件</p>
          </div>
          <Table
            bordered
            size="middle"
            columns={columnsParts}
            dataSource={record.products && record.products.length > 0 ? record.products[0].parts : []}
            rowKey="oemCode"
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
            rowKey="itemCode"
            pagination={false}
          />
        </div>
      </div>,
    rowExpandable:// record => record ? true : false
      record => record.products && record.products.length > 0 ? true : false
  };
  return (
    <div className='haveGoodsPop commomClass'>
      <Modal title='客户已购项目' visible={props.haveGoodShow} onCancel={onMenuCancel} onOk={onMenuOk} width={1100} getContainer={false} >
        <Table
          bordered
          size="middle"
          columns={columns}
          dataSource={projectData}
          rowKey="createTime"
          pagination={false}
          rowSelection={rowSelection}
          expandable={expandable}
        />
      </Modal>

    </div>
  )
}

export default OrderList
