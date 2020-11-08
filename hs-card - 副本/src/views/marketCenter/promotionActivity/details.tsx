/** @format */

import React, { useEffect, useState } from 'react'
import { Form, Spin, Table } from 'antd'
import * as api from '@/api'

import './style.less'
// import {PlusOutlined} from '@ant-design/icons'
// import UploadImg from '@/components/Upload/ImageQN'
// import useSearchParam from '@/hooks/useSearchParams'
import { useHistory } from 'react-router-dom'

import { formatApplyType } from '@/utils/common'

interface IProps {
    next: (data: any, from: any) => void,
    isTheme: Boolean,
    editData: any
}




const PromotionDetails: React.FC<IProps> = props => {
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>({})
    const [shopList, setShopList] = useState<any>([])
    const [rules, setRules] = useState<any>([])
    const [goodsList, setGoodsList] = useState<any>([])


    useEffect(() => {
        setLoading(true)
        let params = {
            id: parmId
        }
        api
            .getActivityThemeDetails(params)
            .then((res: any) => {
                setLoading(false)
                // console.log('活动详情页resresresres', res);
                if (res.code === 1) {
                    setData(res.data)

                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })

        api
            .getActivityGoodsList(params)
            .then((res: any) => {
                setLoading(false)
                // console.log('活动详情页resresresres', res);
                if (res.code === 1) {
                    setGoodsList(res.data)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })

        api
            .getActivityRuleList(params)
            .then((res: any) => {
                setLoading(false)
                // console.log('活动详情页resresresres', res);
                if (res.code === 1) {
                    setRules(res.data)
                    setData(data)

                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
        api
            .getShopList(params)
            .then((res: any) => {
                setLoading(false)
                // console.log('活动详情页resresresres', res);
                if (res.code === 1) {
                    setShopList(res.data)
                    setData(data)

                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [parmId])



    const columns: any = [

        {
            title: '商品名称',
            dataIndex: 'goodsName',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (a, row) => {
                return (
                    <div>

                        {row.goodsName.length < 15 ? row.goodsName : row.goodsName.substr(0, 15) + '...'}

                    </div>
                )
            },
        },

        {
            title: '类目',
            dataIndex: 'classify',
            align: 'center',
            width: 120,

        },
        {
            title: '原价',
            dataIndex: 'originalPrice',
            align: 'center',
            width: 80,

        },
        {
            title: '售价',
            dataIndex: 'salePrice',
            align: 'center',
            width: 80,

        },
        {
            title: '库存',
            dataIndex: 'goodsStock',
            align: 'center',
            width: 80,

        },
        {
            title: '活动价',
            dataIndex: 'price',
            align: 'center',
            width: 80,
            render: (val, row, index) => {
                return (
                    <div>
                        {row.type == 1 ? row.price + '折' : row.price}
                    </div>
                )
            },

        },

        {
            title: '活动库存',
            dataIndex: 'stock',
            align: 'center',
            width: 80,
            ellipsis: true,


        },


    ]


    const columnsShop: any = [
        {
            title: '序号',
            // dataIndex: 'name',
            width: 50,
            render: (val, row, index) => `${index + 1}`,
        },
        {
            title: '区域名称',
            dataIndex: 'areaName',
            align: 'center',
            width: 150,
        },
        {
            title: '门店名称',
            dataIndex: 'shopName',
            align: 'center',
            width: 200,
        },

    ]


    const columnsRule: any = [
        {
            title: '序号',
            // dataIndex: 'name',
            width: 30,
            render: (val, row, index) => `${index + 1}`,
        },
        {
            title: '规则名称',
            dataIndex: 'name',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (a, row) => {
                return (
                    <div>

                        {row.name.length < 100 ? row.name : row.name.substr(0, 100) + '...'}

                    </div>
                )
            },
        },

        {
            title: '适用',
            dataIndex: 'applyType',
            align: 'center',
            width: 80,
            render: (a, row) => formatApplyType(row.applyType)
        }

    ]

    return (
        <div className="activityPage" style={{ background: '#fff', padding: '20px 10px' }}>
            {/* {data.type === 2 && (<h3 style={{ marginBottom: '20px' }}>新客户营销页设置</h3>)} */}
            <Spin spinning={loading}>
                <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} layout="horizontal" form={form} size="middle">
                    <Form.Item label="活动类型">
                        <div>{formatApplyType(data.type)}</div>
                    </Form.Item>
                    <Form.Item label="活动主题">
                        <div>{data.theme}</div>
                    </Form.Item>
                    <Form.Item label="分享文案">
                        <div>{data.shareDesk}</div>
                    </Form.Item>
                    <Form.Item label="分享图标">
                        <img
                            style={{ width: '120px', height: '120px' }}
                            src={data.shareImg}
                        />
                    </Form.Item>
                    <Form.Item label="活动有效期">
                        <div>{data.validType === 2 ? '永久有效' : (
                            <div>
                                <div>开始时间：{data.startTime}</div>
                                <div>结束时间： {data.endTime}</div>
                            </div>
                        )}</div>
                    </Form.Item>
                    <Form.Item label="活动说明">
                        <div>{data.illustrate || '无'}</div>
                    </Form.Item>

                    <Form.Item label="渠道名称">
                        <div>
                            {data.channelList && data.channelList.map((item, i) => <div key={i}>{item.channelName}</div>)}
                        </div>
                    </Form.Item>
                    <Form.Item label="发布状态">
                        <div>{data.issueStatus === 0 ? '未发布' : data.issueStatus === 1 ? '已发布' : '下架'}</div>
                    </Form.Item>
                    <Form.Item label="商品">
                        <Table
                            columns={columns}
                            size="middle"
                            rowKey="goodsId"
                            bordered
                            dataSource={goodsList}
                            pagination={{
                                total: goodsList.length,
                                showTotal: total => `共 ${total} 条`,
                                pageSize: 8,
                                showSizeChanger: false,

                            }}
                        />
                    </Form.Item>

                    <Form.Item label="规则">
                        <Table
                            columns={columnsRule}
                            size="middle"
                            rowKey="ruleId"
                            bordered
                            dataSource={rules}
                            pagination={{
                                total: rules.length,
                                showTotal: total => `共 ${total} 条`,
                                pageSize: 8,
                                showSizeChanger: false,

                            }}
                        />


                    </Form.Item>

                    <Form.Item label="门店">
                        <Table
                            columns={columnsShop}
                            size="middle"
                            rowKey="shopCode"
                            bordered
                            dataSource={shopList}
                            pagination={{
                                total: shopList.length,
                                showTotal: total => `共 ${total} 条`,
                                pageSize: 8,
                                showSizeChanger: false,

                            }}
                        />


                    </Form.Item>

                </Form>
            </Spin>
        </div>
    )
}


PromotionDetails.defaultProps = {
    next: (): void => { },
    isTheme: false
}

export default PromotionDetails
