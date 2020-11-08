/** @format */

import React, { useState, useEffect } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { Form, Input, DatePicker, Button, Table, Space, message, Select, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import * as api from '@/api'
import useAntdTable from '@/hooks/useAntdTable'
import { ITableResult } from '@/interface'
import { ColumnProps } from 'antd/lib/table'
import CustomerSetting from './_customerSetting'
import { useBoolean, useRequest } from '@umijs/hooks'
import SelectComp from '@/components/Select/comp'
import SelectMember from '@/components/Select/member'
import { useHistory } from 'react-router-dom'
import { checkMobile } from '@/interface/customer'
import './style.less'
import hasPermi from '@/components/directive'
const formatParams = (tableParams, params) => {
  let sortType
  if (tableParams?.sorter) {
    if (!tableParams.sorter.order) {
      sortType = null
    } else if (tableParams.sorter.order === 'ascend') {
      sortType = '0'
    } else if (tableParams.sorter.order === 'descend') {
      sortType = '1'
    }
  }
  return {
    ...tableParams, //可删除  留作参考
    ...params,
    sort: sortType,
    sortField: tableParams?.sorter?.field,
    pageNo: tableParams?.current,
    pageSize: tableParams?.pageSize,
  }
}

const PageDataCustomer = () => {
  const history = useHistory()
  const showSetting = useBoolean(false)
  const [form] = Form.useForm()
  const { RangePicker } = DatePicker
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<Array<any>>([])
  const [compCode, setCompCode] = useState('')

  const getTableData = (tableParams, params) =>
    api.getCumstomerList({ ...formatParams(tableParams, params) }).then(res => ({
      list: res.data.items,
      total: res.data.total,
    }))

  const { tableProps, search } = useAntdTable<ITableResult<any>, any>(getTableData, {
    defaultPageSize: 20,
    form,
  })

  const { data: groupList, run: groupRun, loading } = useRequest(
    () => api.getCompGroupMember({ compCode: compCode }).then(res => res.data),
    {
      manual: true,
    },
  )

  useEffect(() => {
    form.setFieldsValue({
      employeeName: undefined,
      groupId: undefined,
    })
    if (compCode) {
      groupRun()
    }
  }, [compCode])

  const { submit } = search || {}
  const onSearch = () => {
    form.validateFields().then(res => {
      let params = (form.getFieldValue as any)()
      if (params.mobile && !checkMobile(params.mobile)) {
        message.error('请输入正确手机号码')
        return
      }
      submit()
    })
  }

  const selectValidate = () => {
    if (!selectedRows.length) {
      message.warning('请先选择客户')
      return false
    }
    // const compCodeDiffArr = selectedRows.filter((item, index, array) => {
    //   return item.compCode !== array[0].compCode
    // })
    // if (compCodeDiffArr.length > 0) {
    //   message.warning('只能选择同一家门店哦')
    //   return false
    // }
    return true
  }

  const settingCustomer = () => {
    if (!selectValidate()) {
      return
    }
    showSetting.setTrue()
  }
  const goDetails = row => {
    const turl = `/customer/detail?id=${row.id}`
    history.push(turl)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys)
      console.log(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
      setSelectedRows(selectedRows)
    },
  }

  const onChangeCompCode = value => {
    setCompCode(value)
  }

  const columnsGroup: ColumnProps<any>[] = [
    {
      title: '归属门店',
      dataIndex: 'compName',
      align: 'left',
      width: 200,
    },
    {
      title: '归属员工',
      dataIndex: 'employeeName',
      align: 'left',
      width: 200,
    },
    {
      title: '服务小组',
      dataIndex: 'groupName',
      align: 'left',
    },
  ]

  const expandable = {
    expandedRowRender: record => (
      <div style={{ padding: '20px 0px' }}>
        <p style={{ marginLeft: '10%' }}>更多归属信息：</p>
        <Table
          columns={columnsGroup}
          dataSource={record.ascription}
          rowKey="compName"
          size="small"
          pagination={false}
          bordered
          style={{ width: 600, marginLeft: '10%' }}
        />
      </div>
    ),
    rowExpandable: record => record.ascription.length >= 2,
  }

  const columns: ColumnProps<any>[] = [
    {
      title: '客户ID',
      dataIndex: 'id',
      align: 'center',
      width: 120
    },
    {
      title: '客户姓名',
      dataIndex: 'name',
      align: 'center',
      width: 120
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
      width: 150
    },
    // {
    //   title: '车牌号',
    //   dataIndex: 'amount',
    //   align: 'center',
    // },
    // {
    //   title: '车险信息',
    //   dataIndex: 'paymentTime',
    //   align: 'center',
    // },
    // {
    //   title: '会员等级',
    //   dataIndex: 'grade',
    //   align: 'center',
    // },
    // {
    //   title: '客户类型',
    //   dataIndex: 'type',
    //   align: 'center',
    // },
    // {
    //   title: '分类',
    //   dataIndex: 'sort',
    //   align: 'center',
    // },
    // {
    //   title: '最近消费',
    //   dataIndex: 'paymentTime',
    //   align: 'center',
    // },

    {
      title: '车辆',
      dataIndex: 'cars',
      align: 'center',
      // rowSpan: 2,
      width: 130,
      className: 'no-padding no-paddingcarNo',
      render: (value, row) => {
        return (
          row.cars && row.cars.length > 0 ?
            row.cars.map(item => (
              <div>
                <p>0</p>
                <p>{item.carNo ? item.carNo : ''}</p>
                <p>0</p>
              </div>
            )) : ''
          // row.cars && row.cars.length > 0 ?
          //   <Table
          //     columns={columnsGroupT}
          //     dataSource={row.cars}
          //     rowKey="compName"
          //     size="small"
          //     pagination={false}
          //     bordered

          //   /> : ''
        )
      },
    },
    {
      title: '车况',
      dataIndex: 'cars',
      align: 'center',
      className: 'no-padding',
      width: 230,
      render: (value, row) => {
        return (
          row.cars && row.cars.length > 0 ?
            row.cars.map(item => (
              <div>
                <p> 里程：{item.mileage ? item.mileage : '无'} </p>
                <p>生产日期：{item.produceDate && item.produceDate ? item.produceDate : '无'}</p>
                <p>vin：{item.vin ? item.vin : '无'}</p>
              </div>
            )) : ''
        )
      },
    },
    {
      title: '保险',
      dataIndex: 'cars',
      align: 'center',
      width: 230,
      className: 'no-padding',
      render: (value, row) => {
        return (
          row.cars && row.cars.length > 0 ?
            row.cars.map(item => (
              <div>
                <p>保险公司：{item.extra && item.extra.insuranceName ? item.extra.insuranceName : '无'}</p>
                <p>状态：{item.extra && item.extra.insuranceName ? item.extra && item.extra.insuranceValidated ? '已到期' : <span>生效中</span> : '无'}</p>
                <p>到期时间：{item.extra && item.extra.insuranceExpireTime ? item.extra.insuranceExpireTime.substr(0, 10) : '无'}</p>
              </div>
            )) : ''
        )
      },
    },
    {
      title: '最近接待人',
      dataIndex: 'receiver',
      align: 'center',
      width: 130
    },
    {
      title: '归属门店',
      dataIndex: 'paymentTime',
      align: 'center',
      width: 200,
      render: (value, row) => row.ascription[0]?.compName,
    },
    {
      title: '归属员工',
      dataIndex: 'paymentTime',
      align: 'center',
      width: 120,
      render: (value, row) => row.ascription[0]?.employeeName,
    },
    {
      title: '服务小组',
      dataIndex: 'paymentTime',
      align: 'center',
      width: 120,
      render: (value, row) => row.ascription[0]?.groupName,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (value, row) => {
        return (
          <Button type="link" onClick={() => goDetails(row)}>
            查看详情
          </Button>
        )
      },
    },
    // {
    //   title: '操作',
    //   align: 'center',
    //   render: (value, row) => {
    //     return (
    //       <div>
    //         <Button type="link">车辆信息</Button>
    //         <Button type="link">消费记录</Button>
    //         <Button type="link">订单</Button>
    //         <Button type="link">优惠券</Button>
    //         <Button type="link">积分明细</Button>
    //         <Button type="link">查看详情</Button>
    //       </div>
    //     )
    //   },
    // },
  ]
  return (
    <div className="block customerlist">
      <div className="block_title">
        <Row>
          <Col span={19}>
            <span className="borderlf">客户列表</span>
          </Col>
          <div className='customerRight'>
            <Space size="small">
              <Button type="primary" onClick={settingCustomer} disabled={hasPermi('customer:list:distribution')}>
                客户分配
              </Button>
              <Button
                type="primary"
                disabled={hasPermi('customer:list:creat')}
                onClick={() => {
                  history.push('/customer/add')
                }}>
                创建档案
              </Button>
            </Space>
          </div>
        </Row>
      </div>

      <ToolsBar>
        <Form layout="inline" form={form}>
          <Form.Item name="name">
            <Input placeholder="请输入客户姓名" allowClear style={{ width: 130 }}></Input>
          </Form.Item>
          <Form.Item name="mobile">
            <Input placeholder="请输入手机号" allowClear style={{ width: 130 }}></Input>
          </Form.Item>
          <Form.Item name="id">
            <Input placeholder="请输入客户ID" allowClear style={{ width: 130 }}></Input>
          </Form.Item>
          <Form.Item name="compCode">
            <SelectComp
              showSearch
              allowClear
              placeholder="归属门店"
              filterOption={(input, option) => option?.children.indexOf(input) >= 0}
              onChange={onChangeCompCode}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item name="employeeCode">
            <SelectMember
              showSearch
              allowClear
              placeholder="归属员工"
              compCode={compCode}
              filterOption={(input, option) => option?.children.indexOf(input) >= 0}
              disabled={!compCode}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item name="groupId">
            <Select placeholder="归属服务小组" allowClear disabled={!compCode} loading={loading} style={{ width: 120 }}>
              {groupList?.length && groupList?.map(item => <Select.Option value={item.id}>{item.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item>
            <RangePicker
              style={{ width: 240 }}
              placeholder={['最近到店日期', '最近到店日期']}
              onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'cameStartTime', 'cameEndTime')}
            />
          </Form.Item>
          <Form.Item>
            <Space size="middle">
              <Button
                type="primary"
                onClick={onSearch}
                icon={<SearchOutlined />}
                disabled={hasPermi('customer:list:search')}>
                搜索
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </ToolsBar>
      <div style={{ backgroundColor: 'white', marginTop: '12px' }}>
        <Table
          scroll={{ x: 1400 }}
          bordered
          rowSelection={rowSelection}
          size="middle"
          columns={columns}
          {...tableProps}
          rowKey="id"
          expandable={expandable}
          pagination={{
            showSizeChanger: true,
            total: tableProps.pagination.total,
            current: tableProps.pagination.current,
            showTotal: total => `共 ${total} 条`,
            pageSize: tableProps.pagination.pageSize,
          }}
        />
      </div>

      <CustomerSetting
        isShow={showSetting.state}
        selectRow={selectedRows}
        onOk={() => {
          showSetting.setFalse()
          submit()
        }}
        onClose={() => {
          showSetting.setFalse()
        }}
      />
    </div>
  )
}

export default PageDataCustomer
