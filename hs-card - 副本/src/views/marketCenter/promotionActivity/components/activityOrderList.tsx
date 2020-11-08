/** @format */

import React from 'react'
import { Table, Button, Form, Spin, Input, DatePicker } from 'antd'
import '../style.less'
import useAntdTable from '@/hooks/useAntdTable'

import ToolsBar from '@/components/ToolsBar'
import { ITableResult, IUser } from '@/interface'
// import Moment from 'moment'
import 'moment/locale/zh-cn'
import * as api from '@/api'
// import { useRequest } from '@umijs/hooks'
import { formatOrderStatus } from '@/utils/common'
import { SearchOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

const { RangePicker } = DatePicker

interface IProps {
    activityId: any
}

const PageRulesSet: React.FC<IProps> = props => {

    const [form] = Form.useForm();

    const history = useHistory()


    const getTableData = (tableParams, params) =>
        api.getTeamBuyOrder({ ...api.formatParams(tableParams, { ...params, activityId: props.activityId }) }).then(res => ({
            list: res.data.items,
            total: res.data.total
        }))

    const { tableProps, search, loading } = useAntdTable<ITableResult<IUser>, IUser>(getTableData, {
        defaultPageSize: 10,
        form
    })

    const { submit } = search || {}

    const searchBt = () => {
        submit()
    }

    const getDataDetails = (row) => {
        const turl = `/ordermanage/orderdetail?orderId=${row.orderId}`
        history.push(turl)
    }


    // const selectTimeRange = e => {
    //     if (!e) {
    //         setTimeRange([null, null])
    //     } else {
    //         setTimeRange([Moment(e[0]), Moment(e[1])])
    //         form.setFieldsValue({ payStartTime: Moment(e[0]).format(dateFormat) })
    //         form.setFieldsValue({ payEndTime: Moment(e[1]).format(dateFormat) })
    //     }
    // }


    const orderConlums: any = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'customerId',
            width: 100,
            render: (text, record, index) => `${index + 1}`
        },
        {
            title: '订单信息',
            align: 'center',
            dataIndex: 'orderId',
            width: 300,
            render: (val, row) => (
                <div style={{ textAlign: 'left' }}>
                    <p>订单号：{row.orderId}</p>
                    <p>交易单号：{row.txnOrderNo}</p>
                    <p>支付流水号：{row.payTransNo}</p>

                </div>
            )
        },
        {
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodsName',
            width: 200
        },
        {
            title: '商品数量',
            align: 'center',
            dataIndex: 'amount',
            width: 200
        },
        {
            title: '买家',
            align: 'center',
            dataIndex: 'customerName',
            width: 200,
            render: (val, row) => (
                <div>
                    {row.customerName}/{row.mobile}
                </div>
            )
        },
        {
            title: '车辆',
            align: 'center',
            dataIndex: '车辆',
            width: 200,
            render: (val, row) => (
                <div>
                    {row.carModel}/{row.carNo}
                </div>
            )
        },
        {
            title: '支付时间',
            align: 'center',
            dataIndex: 'payTime',
            width: 200
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            align: 'center',
            width: 200,
            render: (a, row) => {
                return formatOrderStatus(row.status)

            },
        },
        {
            title: '实付金额',
            align: 'center',
            dataIndex: 'actualPayAmount',
            width: 200,
            render: (a, row) => {
                return '￥' + row.actualPayAmount

            },
        },
        {
            title: '操作',
            align: 'center',
            width: 80,
            render: (a, row) => {
                return (
                    <div>
                        <Button type="link" onClick={() => getDataDetails(row)} style={{ color: '#FB721F' }}>
                            查看详细
                       </Button>

                    </div >
                )
            },
        },

    ]

    // const clickExportReport = () => {
    //     const params = handerExportReportparams(tableProps.pagination, form)
    //     api.exportData('newCustomerReceives', params)
    // }

    return (
        <div style={{ marginTop: '20px' }}>
            <h2>活动订单</h2>
            <ToolsBar visible={false}>
                <Form form={form} layout="inline">
                    <Form.Item name="childOrderId" label="订单号">
                        <Input placeholder="请输入订单号" style={{ width: '150px' }} allowClear></Input>
                    </Form.Item>
                    <Form.Item name="customerName" label="买家姓名">
                        <Input placeholder="请输入手机号" style={{ width: '120px' }} allowClear></Input>
                    </Form.Item>
                    <Form.Item name="mobile" label="手机号">
                        <Input placeholder="请输入手机号" style={{ width: '120px' }} allowClear></Input>
                    </Form.Item>
                    <Form.Item name="carNo" label="车牌号">
                        <Input placeholder="请输入车牌" style={{ width: '110px' }} allowClear></Input>
                    </Form.Item>
                    <Form.Item label="支付时间">
                        <RangePicker
                            style={{ marginLeft: '10px', width: '240px' }}
                            placeholder={['开始日期', '结束日期']}
                            onChange={(dates, dateStrs) => api.setFormDateRange(dateStrs, form, 'payStartTime', 'payEndTime')}
                        />
                        {/* <RangePicker
                            value={timeRange}
                            allowClear={false}
                            onChange={(e: any) => {
                                selectTimeRange(e)
                            }}
                            // onFocus={() => setPeriodStatus('')}
                            style={{ marginLeft: '10px', width: '240px' }}
                        /> */}
                    </Form.Item>


                    <Form.Item>
                        <div>
                            <Button type="primary" icon={<SearchOutlined />} onClick={searchBt}>搜索</Button>
                            {/* <Button type="primary" icon={<DownloadOutlined />} disabled={hasPermi('getCard:list:import')} onClick={() => clickExportReport()}>导出</Button> */}
                        </div>
                    </Form.Item>
                </Form>
            </ToolsBar>
            {/* 表格内容 */}
            <div className="tableConent">
                <Spin spinning={loading}>
                    <Table
                        columns={orderConlums}
                        rowKey="customerId"
                        {...tableProps}
                        bordered
                    // pagination={{
                    // 	total: tableProps.pagination.total,
                    // 	showTotal: total => `共 ${total} 条`,
                    // 	pageSize: tableProps.pagination.pageSize,
                    // 	showSizeChanger: true,
                    // }}
                    />
                </Spin>
            </div >
        </div >
    )

}

export default PageRulesSet
