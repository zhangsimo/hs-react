/** @format */

import React, {useState} from 'react'
import ToolsBar from '@/components/ToolsBar'
import {Form, Input, Button, Table, DatePicker, Select, Spin, message} from 'antd'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import {ITableResult} from '@/interface'
import {ColumnProps} from 'antd/lib/table'
import {useHistory} from 'react-router-dom'
import {SearchOutlined} from '@ant-design/icons'
// import SelectComp from '@/components/Select/comp'
import hasPermi from '@/components/directive'
import {useRequest} from '@umijs/hooks'
import moment from 'moment'
import {yearMonthDay} from '@/utils/common'
const orderStatus = [
  {id: 2, name: '施工中'},
  {id: 3, name: '已完工'},
]
// const serviceType = [
//   { id: 0, name: '全部' },
//   { id: 1, name: '到点服务' },
//   { id: 2, name: '快递物流' },
// ]
//默认选择7天
let dayDate = new Date().getTime()
let sevenDayFront = 7 * 24 * 60 * 60 * 1000 // 7天
const defaultStart: any = yearMonthDay(dayDate - sevenDayFront)
const defaultEnd: any = yearMonthDay(dayDate)
const WorkList = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [form] = Form.useForm()
  const history = useHistory()
  const dataSource: any = []
  const {RangePicker} = DatePicker
  useRequest(() => {
    api.setFormDateRange([defaultStart, defaultEnd], form, 'startWorkTime', 'finishWorkTime')
  })

  const getTableData = (tableParams, params) =>
    api.getOrderPageList({...api.formatParams(tableParams, params)}).then(res => {
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

  // const onChangeCompCode = () => {

  // }
  const {submit} = search || {}
  const onSearch = () => {
    console.log(form.getFieldValue('startWorkTime'))
    if (form.getFieldValue('startWorkTime') && form.getFieldValue('finishWorkTime')) {
      submit()
    } else {
      message.error('请选择时间范围！')
    }
  }
  const onDetail = row => {
    const turl = `/ordermanage/workldetail?workId=${row.workId}`
    history.push(turl)
  }
  const columns: ColumnProps<any>[] = [
    // {
    //   title: '序号',
    //   align: 'center',
    //   render: (text, record, index) => `${index + 1}`,
    // },
    {
      title: '工单号',
      dataIndex: 'workCode',
      align: 'center',
      width: '140px',
    },
    {
      title: '服务门店',
      dataIndex: 'compName',
      align: 'center',
    },
    {
      title: '用户',
      dataIndex: 'customerName',
      align: 'center',
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      align: 'center',
    },
    {
      title: '车型',
      dataIndex: 'carModel',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (a, row) => {
        switch (row.status) {
          case 1:
            return '未施工'
            break
          case 2:
            return '施工中'
          default:
            return '已完工'
        }
      },
    },

    {
      title: '项目数量',
      dataIndex: 'projectNum',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'startWorkTime',
      align: 'center',
      width: 90,
    },
    {
      title: '操作',
      align: 'center',
      render: (value, row) => {
        return (
          <Button type="link" onClick={() => onDetail(row)} disabled={hasPermi('ordermanage:worklist:detail')}>
            详情
          </Button>
        )
      },
    },
  ]
  const expandable = {
    expandedRowRender: record => (
      <div>
        <span>{`待施工:${record.noRepairNum}`}</span>
        <span>{`领料中:${record.pickingNum}`}</span>
        <span>{`施工中:${record.repairIngNum}`}</span>
        <span>{`已完工:${record.finishNum}`}</span>
        <span>{`已终止:${record.stopNum}`}</span>
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
    <div className="block workList">
      <Spin spinning={loading}>
        <div className="block_title">
          <span>工单管理</span>
        </div>

        <div className="orderList">
          <ToolsBar>
            <Form layout="inline" form={form}>
              <Form.Item name="workCode">
                <Input placeholder="请输入工单号" allowClear style={{width: 160}}></Input>
              </Form.Item>
              <Form.Item name="customerName">
                <Input placeholder="请输入用户" allowClear style={{width: 160}}></Input>
              </Form.Item>
              <Form.Item name="carNo">
                <Input placeholder="请输入车牌号" allowClear style={{width: 160}}></Input>
              </Form.Item>
              <Form.Item name="status">
                <Select allowClear placeholder="请选择状态" style={{width: 160}}>
                  {orderStatus.map(item => (
                    <Select.Option value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item name="compCode">
                <SelectComp
                  disabled={false}
                  showSearch
                  allowClear
                  placeholder="请选择服务门店"
                  filterOption={(input, option) => option?.children.indexOf(input) >= 0}
                  onChange={onChangeCompCode}
                  style={{ width: 160 }}
                />
              </Form.Item> */}
              <Form.Item>
                <RangePicker
                  style={{width: 260}}
                  placeholder={['下单开始时间', '下单截止时间']}
                  defaultValue={[moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')]}
                  disabledDate={disabledDate}
                  onCalendarChange={dates => {
                    setDates(dates)
                  }}
                  onChange={(dates, dateStrs) =>
                    api.setFormDateRange(dateStrs, form, 'startWorkTime', 'finishWorkTime')
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={onSearch}
                  disabled={hasPermi('ordermanage:worklist:search')}>
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </ToolsBar>
          <div style={{backgroundColor: 'white', marginTop: '12px'}} className="workListTable">
            {tableProps.dataSource && tableProps.dataSource.length > 0 ? (
              <Table
                size="middle"
                columns={columns}
                {...tableProps}
                rowKey={record => record.orderId}
                scroll={{x: 1100}}
                expandIconColumnIndex={-1}
                defaultExpandAllRows={true}
                expandable={expandable}
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
        </div>
      </Spin>
    </div>
  )
}

export default WorkList
