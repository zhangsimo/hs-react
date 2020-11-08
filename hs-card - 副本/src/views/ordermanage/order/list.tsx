/** @format */

import React, { useState, useEffect } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Form,
  Input,
  Button,
  Table,
  DatePicker,
  Select,
  Modal,
  message,
  Spin,
  Tooltip,
  //Popconfirm
} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import { useHistory } from 'react-router-dom'
import {
  SearchOutlined,
  //QuestionCircleOutlined
} from '@ant-design/icons'
import PayWay from '../components/payWay'
import Refund from '../components/refund'
import hasPermi from '@/components/directive'
import moment from 'moment'
import { yearMonthDay } from '@/utils/common'
const orderStatus = [
  // { id: '', name: '全部' },
  { id: 'OPS001', name: '待付款' },
  { id: 'OPS002', name: '已付款' },
]
const payType = [
  { id: 'W01', name: '微信支付' },
  { id: 'A01', name: '支付宝支付' },
  { id: 'U01', name: '银联支付' },
  { id: 'C01', name: '现金支付' },
  { id: 'B01', name: '余额支付' },
  { id: 'T01', name: '挂账' },
]
interface IProps {
  orderType
}
const OrderList: React.FC<IProps> = props => {
  const { confirm } = Modal
  const [loading, setLoading] = useState<boolean>(true)
  const [form] = Form.useForm()
  const history = useHistory()
  const dataSource: any = []
  const [refundShow, setRefundShow] = useState<boolean>(false)
  const [refundPopData, setRefundPopData] = useState<any>(null)
  const [receiptShow, setReceiptShow] = useState<boolean>(false)
  const [receiptPopData, setReceiptPopData] = useState<any>()
  const { RangePicker } = DatePicker
  //默认选择7天
  let dayDate = new Date().getTime()
  let sevenDayFront = 7 * 24 * 60 * 60 * 1000 // 7天
  const defaultStart: any = yearMonthDay(dayDate - sevenDayFront)
  const defaultEnd: any = yearMonthDay(dayDate)

  useEffect(() => {
    if (props.orderType) {
      api.setFormDateRange([defaultStart, defaultEnd], form, 'startTime', 'endTime')
    }
  }, [props.orderType])

  const getTableData = (tableParams, params) =>
    //getOrderFindPage
    api.getOrderFindPage({ ...api.formatParams(tableParams, params), ...{ orderChannel: props.orderType } }).then(res => {
      setLoading(false)
      return {
        list: res.data.items,
        total: res.data.total,
      }
    })

  const { tableProps, search } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  const { submit } = search || {}
  const onSearch = () => {
    if (form.getFieldValue('startTime') && form.getFieldValue('endTime')) {
      submit()
    } else {
      message.error('请选择时间范围！')
    }
  }
  // const addOrder = () => {
  //   const turl = `/ordermanage/add`
  //   history.push(turl)
  // }
  const onDetail = row => {
    const turl = `/ordermanage/orderdetail?orderId=${row.orderId}&orderType=${props.orderType}`
    history.push(turl)
  }
  const getOrderRefund = row => {
    setRefundShow(true)
    setRefundPopData(row.orderId)
  }

  const onRefundSuccess = () => {
    setRefundShow(false)
    onSearch()
  }
  const onRefundCancel = () => {
    setRefundShow(false)
  }

  const onReceiptCancel = () => {
    setReceiptShow(false)
  }
  const onReceiptPaySuccess = () => {
    setReceiptShow(false)
    onSearch()
  }
  const showConfirm = row => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '当前用户身份为游客，且订单中包含未派工项目，请补充客户手机号和姓名进行收款，或删除未派工的项目进行收款',
      cancelText: '取消',
      okText: '去修改',
      onOk() {
        onDetail(row)
        console.log('OK')
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  const getOrderReceipt = row => {
    if (row.customerId === '0' && row.readyRepairNum > 0) {
      //游客身份不能直接收款
      showConfirm(row)
      return
    }

    if (row.readyRepairNum != 0) {
      message.error('存在未派工项目，请先行派工再付款')
      return
    }

    setReceiptShow(true)
    let receiptPopData = {
      orderId: row.orderId,
      payableAmt: row.payableAmt,
      paidAmt: row.paidAmt ? row.paidAmt : 0,
    }
    setReceiptPopData(receiptPopData)
  }

  // 日期框滚动下拉固定
  const datePicketScollFixed = trigger => {
    return trigger.parentNode || document.body
  }
  const columns: ColumnProps<any>[] = [
    // {
    //   title: '序号',
    //   align: 'center',
    //   render: (text, record, index) => `${index + 1}`,
    // },
    {
      title: '订单号',
      dataIndex: 'orderId',
      align: 'center',
      width: '140px',
    },
    {
      title: '用户',
      dataIndex: 'realName',
      align: 'center',
    },
    {
      title: '销售门店',
      dataIndex: 'compName',
      align: 'center',
    },
    {
      title: '订单来源',
      dataIndex: 'orderChannel',
      align: 'center',
      render: (a, row) => {
        switch (row.orderChannel) {
          case 'micro_mall':
            return '微商城'
            break
          case 'offline_store':
            return '线下门店'
            break
          default:
            return ''
        }
      },
    },
    {
      title: '订单状态',
      dataIndex: 'payState',
      align: 'center',
      render: (a, row) => {
        switch (row.payState) {
          case 'OPS001':
            return '待付款'
            break
          case 'OPS002':
            return '已付款'
          default:
            return ''
        }
      },
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
      title: '商品数量',
      dataIndex: 'productNum',
      align: 'center',
    },
    // {
    //   title: '付款方式',
    //   dataIndex: 'payTypeName',
    //   align: 'center',
    // },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      align: 'center',
      width: '140px',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: '100px',
      ellipsis: true,
      render: remark => (
        <Tooltip placement="topLeft" title={remark}>
          {remark}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'payState',
      width: '130px',
      fixed: 'right',
      render: (value, row) => {
        return (
          // className='operating'
          /*
          //<Popconfirm title="您确定取消该订单吗？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} 
          onConfirm={() => cancelOrder(row)}
          >
            <Button type="primary" danger style={{marginTop: '8px'}}>
            取消订单</Button>
          </Popconfirm>
          */
          <div>
            <Button type="link" onClick={() => onDetail(row)} disabled={hasPermi('ordermanage:orderList:detail')}>
              详情
            </Button>
            <div>
              {row.payState === 'OPS001' && props.orderType == 'offline_store' ? (
                <div>
                  <Button
                    type="primary"
                    disabled={hasPermi('ordermanage:orderList:receipt')}
                    onClick={() => getOrderReceipt(row)}
                    style={{
                      background: hasPermi('ordermanage:orderList:receipt') ? '' : '#057108',
                      border: hasPermi('ordermanage:orderList:receipt') ? '' : '1px solid #057108',
                    }}>
                    立即收款
                  </Button>
                </div>
              ) : ''}
              {row.payState === 'OPS002' && props.orderType == 'micro_mall' ?
                (
                  <Button
                    type="primary"
                    className="refundBtn"
                    disabled={true}
                    onClick={() => getOrderRefund(row)}
                    style={{
                      background: row.readyRepairNum > 0 && row.refundNum !== row.productNum ? '#DC612B' : '',
                      border: row.readyRepairNum > 0 && row.refundNum !== row.productNum ? '1px solid #DC612B' : '',
                      marginBottom: '10px',
                      padding: '0 27px',
                    }}>
                    退款
                  </Button>
                ) : ''}
            </div>
          </div>
        )
      },
    },
  ]
  // const cancelOrder = (row) => {
  // 	api.getOrderCancel({ orderId: row.orderId }).then(res => {
  // 	  if (res.code === 1) {
  // 	    message.success('取消订单成功')
  // 	    setRefundShow(false)
  // 	    onSearch()
  // 	  }
  // 	})
  // }
  const expandable = {
    expandedRowRender: record => (
      <div>
        {
          props.orderType == 'offline_store' ?
            <>
              <span>{`待派工:${record.readyRepairNum}`}</span>
              <span>{`已派工:${record.repairNum}`}</span>
            </>
            : ''
        }
        <span>{`已核销:${record.alrWriteOffNum}`}</span>
        <span>{`已退款:${record.refundNum}`}</span>
      </div>
    ),
    rowExpandable: record => true,
  }


  const [dates, setDates] = useState<any>([])
  const disabledDate = current => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 30
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 30
    return tooEarly || tooLate
  }

  return (
    <div className="orderList">
      <Spin spinning={loading}>
        <PayWay
          onReceiptCancel={onReceiptCancel}
          receiptShow={receiptShow}
          receiptPopData={receiptPopData}
          onReceiptPaySuccess={onReceiptPaySuccess}
        />
        <Refund
          onRefundCancel={onRefundCancel}
          refundShow={refundShow}
          refundPopData={refundPopData}
          onRefundSuccess={onRefundSuccess}
        />
        <ToolsBar>
          <Form layout="inline" form={form}>
            <Form.Item name="orderId">
              <Input placeholder="请输入订单号" allowClear style={{ width: 160 }}></Input>
            </Form.Item>
            <Form.Item name="realName">
              <Input placeholder="请输入用户" allowClear style={{ width: 160 }}></Input>
            </Form.Item>
            <Form.Item name="carNo">
              <Input placeholder="请输入车牌号" allowClear style={{ width: 160 }}></Input>
            </Form.Item>
            <Form.Item name="payState">
              <Select allowClear placeholder="请选择状态" style={{ width: 160 }}>
                {orderStatus.map(item => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="payType">
              <Select allowClear placeholder="请选择支付方式" style={{ width: 160 }}>
                {payType.map(item => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <RangePicker
                style={{ width: 260 }}
                defaultValue={[moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]}
                placeholder={['下单开始时间', '下单截止时间']}
                getPopupContainer={datePicketScollFixed}
                disabledDate={disabledDate}
                onCalendarChange={dates => {
                  setDates(dates)
                }}
                onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'startTime', 'endTime')}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
                disabled={hasPermi('ordermanage:orderList:search')}>
                搜索
              </Button>
              {/* {
                props.orderType === 'offline_store' ? <Button type="primary" onClick={addOrder} disabled={hasPermi('ordermanage:orderList:add')} className='buttonNew'>新建订单</Button> : ''
              } */}
            </Form.Item>
          </Form>
        </ToolsBar>
        <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
          {tableProps.dataSource && tableProps.dataSource.length > 0 ? (
            <Table
              size="middle"
              columns={columns}
              {...tableProps}
              rowKey={record => record.orderId}
              expandIconColumnIndex={-1}
              defaultExpandAllRows={true}
              expandable={expandable}
              scroll={{ x: 1000 }}
              pagination={{
                showSizeChanger: true,
                total: tableProps.pagination.total,
                current: tableProps.pagination.current,
                showTotal: total => `共 ${total} 条`,
                pageSize: tableProps.pagination.pageSize,
              }}
            />
          ) : (
              <div>
                <Table size="middle" columns={columns} dataSource={dataSource} rowKey={record => record.orderId} />
              </div>
            )}
        </div>

      </Spin>
    </div>
  )
}

export default OrderList
