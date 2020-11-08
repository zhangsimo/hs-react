/** @format */

import React, {useState} from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table, DatePicker, Select, Modal, Spin, message} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {SearchOutlined} from '@ant-design/icons'
import SelectComp from '@/components/Select/comp'
import ServiceProgress from '../components/serviceProgress'
import hasPermi from '@/components/directive'
import {useRequest} from '@umijs/hooks'
import moment from 'moment'
import {yearMonthDay} from '@/utils/common'
const orderStatus = [
  {id: 'OPS001', name: '待付款'},
  {id: 'OPS002', name: '已付款'},
  {id: 'OPS004', name: '已退款'},
]
const payType = [
  {id: 'W01', name: '微信支付'},
  {id: 'A01', name: '支付宝支付'},
  {id: 'U01', name: '银联支付'},
  {id: 'C01', name: '现金支付'},
  {id: 'B01', name: '余额支付'},
  {id: 'T01', name: '挂账'},
]
const construType = [
  {id: 1, name: '待派工'},
  {id: 2, name: '已派工'},
  {id: 3, name: '已完工'},
]
//默认选择7天
let dayDate = new Date().getTime()
let sevenDayFront = 7 * 24 * 60 * 60 * 1000 // 7天
const defaultStart: any = yearMonthDay(dayDate - sevenDayFront)
const defaultEnd: any = yearMonthDay(dayDate)
const WorkList = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [form] = Form.useForm()
  const dataSource: any = []
  const {RangePicker} = DatePicker
  const [serviceShow, setServiceShow] = useState<boolean>(false)
  const [orderProductId, setOrderProductId] = useState<string>('')
  useRequest(() => {
    api.setFormDateRange([defaultStart, defaultEnd], form, 'startTime', 'endTime')
  })
  const getTableData = (tableParams, params) =>
    //getOrderProFindPage
    api
      .getOrderProFindPage({...api.formatParams(tableParams, params), ...{orderChannel: 'offline_store'}})
      .then(res => {
        setLoading(false)
        return {
          list: res.data.items,
          total: res.data.total,
        }
      })

  const {tableProps, search} = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })
  const onDetail = row => {
    if (row.useState === 1) {
      Modal.warning({
        content: `该子单未派工，请派工!`,
      })
      return
    }
    setServiceShow(true)
    setOrderProductId(row.orderProductId) //
  }
  const onServerCancel = val => {
    setServiceShow(false)
  }
  const onChangeCompCode = () => {}

  const {submit} = search || {}
  const onSearch = () => {
    if (form.getFieldValue('startTime') && form.getFieldValue('endTime')) {
      submit()
    } else {
      message.error('请选择时间范围！')
    }
  }
  const columns: ColumnProps<any>[] = [
    {
      title: '订单号',
      dataIndex: 'orderId',
      align: 'center',
      width: 190,
    },
    {
      title: '子单号',
      dataIndex: 'childOrderId',
      align: 'center',
      width: 120,
    },
    {
      title: '订单来源',
      dataIndex: 'orderChannel',
      align: 'center',
      width: 100,
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
      title: '订单商品ID',
      dataIndex: 'orderProductId',
      align: 'center',
      width: 130,
    },
    {
      title: '商品名称',
      dataIndex: 'storeName',
      align: 'center',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'payStateName',
      align: 'center',
      width: 100,
    },
    {
      title: '支付方式',
      dataIndex: 'payTypeName',
      align: 'center',
      width: 100,
    },
    {
      title: '施工状态',
      dataIndex: 'useStateName',
      align: 'center',
      width: 90,
      render: (value, row) => {
        return (
          <Button type="link" onClick={() => onDetail(row)}>
            {row.useStateName}
          </Button>
        ) //
      },
    },
    {
      title: '销售金额',
      dataIndex: 'saleAmt',
      align: 'center',
      width: 100,
    },

    {
      title: '实付金额',
      dataIndex: 'subtotalAmt',
      align: 'center',
      width: 100,
    },
    {
      title: '销售门店',
      dataIndex: 'payCompName',
      align: 'center',
      width: 110,
    },
    {
      title: '核销门店',
      dataIndex: 'usedCompName',
      align: 'center',
      width: 110,
    },
    {
      title: '用户电话',
      dataIndex: 'userPhone',
      align: 'center',
      width: 130,
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      align: 'center',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 110,
    },
  ]
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
    <div className="block">
      <Spin spinning={loading}>
        <div className="block_title">
          <span>门店订单明细</span>
        </div>
        <ServiceProgress serviceShow={serviceShow} onServerCancel={onServerCancel} orderProductId={orderProductId} />
        <div className="storeList">
          <ToolsBar>
            <Form layout="inline" form={form}>
              <Form.Item name="orderId">
                <Input placeholder="请输入订单号" allowClear style={{width: 160}}></Input>
              </Form.Item>
              <Form.Item name="payCompCode">
                <SelectComp
                  disabled={false}
                  showSearch
                  allowClear
                  placeholder="请选择销售门店"
                  filterOption={(input, option) => option?.children.indexOf(input) >= 0}
                  onChange={onChangeCompCode}
                  style={{width: 160}}
                />
              </Form.Item>
              <Form.Item name="usedCompCode">
                <SelectComp
                  disabled={false}
                  showSearch
                  allowClear
                  placeholder="请选择核销门店"
                  filterOption={(input, option) => option?.children.indexOf(input) >= 0}
                  onChange={onChangeCompCode}
                  style={{width: 160}}
                />
              </Form.Item>

              <Form.Item name="payState">
                <Select allowClear placeholder="请选择状态" style={{width: 160}}>
                  {orderStatus.map(item => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="payType">
                <Select allowClear placeholder="请选择支付方式" style={{width: 160}}>
                  {payType.map(item => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="userPhone">
                <Input placeholder="请输入用户电话" allowClear style={{width: 160}}></Input>
              </Form.Item>
              <Form.Item name="carNo">
                <Input placeholder="请输入车牌号" allowClear style={{width: 160}}></Input>
              </Form.Item>
              <Form.Item name="useState">
                <Select allowClear placeholder="请选择施工状态" style={{width: 160}}>
                  {construType.map(item => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <RangePicker
                  style={{width: 260}}
                  placeholder={['创建开始时间', '创建截止时间']}
                  defaultValue={[moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]}
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
                  disabled={hasPermi('ordermanage:storelist:search')}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </ToolsBar>
          <div style={{backgroundColor: 'white', marginTop: '12px'}}>
            {tableProps.dataSource && tableProps.dataSource.length > 0 ? (
              <Table
                bordered
                size="middle"
                scroll={{x: 1500}}
                columns={columns}
                {...tableProps}
                rowKey={record => record.orderId}
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
                <Table
                  bordered
                  size="middle"
                  columns={columns}
                  dataSource={dataSource}
                  rowKey={record => record.orderId}
                />
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default WorkList
