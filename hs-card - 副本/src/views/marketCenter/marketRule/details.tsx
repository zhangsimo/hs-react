/** @format */

import React, { useEffect, useState } from 'react'
import { Form, Spin, Table } from 'antd'
import * as api from '@/api'

import './styles.less'
// import {PlusOutlined} from '@ant-design/icons'
// import UploadImg from '@/components/Upload/ImageQN'
// import useSearchParam from '@/hooks/useSearchParams'
import { useHistory } from 'react-router-dom'
import { ColumnProps } from 'antd/lib/table'
import { IActivityCardDetails } from '@/interface/activity'
import Moment from 'moment'


const dateFormat = 'YYYY-MM-DD'
interface IProps {
    next: (data: any, from: any) => void,
    isTheme: Boolean,
    editData: any
}

interface JProps {
    tableData: any[]
}

const CardsList: React.FC<JProps> = props => {
    const columns: ColumnProps<IActivityCardDetails>[] = [
        {
            title: '券类型',
            dataIndex: 'cardType',
            align: 'left',
            render: (a, row) => {
                let cardType: any = ''
                if (row.cardType == '1') {
                    cardType = '满减券'
                } else if (row.cardType == '2') {
                    cardType = '抵扣券'
                } else if (row.cardType == '3') {
                    cardType = '折扣券'
                } else if (row.cardType == '4') {
                    cardType = '兑换券'
                }

                return cardType
            },
        },
        {
            title: '券名称',
            dataIndex: 'subTitle',
            align: 'center',
        },
        {
            title: '有效期',
            dataIndex: 'validDays',
            align: 'center',
            render: (a, row) => {
                let validDays: any = ''
                if (row.validType == 1) {
                    validDays = Moment(row.validEnd).format(dateFormat)
                } else if (row.validType == 2) {
                    validDays = row.validDays
                }

                return validDays
            },
        }
    ]
    return (
        <Table
            columns={columns}
            rowKey={'cardId'}
            dataSource={props.tableData}
            size="small"
            bordered
            pagination={false}
            style={{ height: '192px', overflow: 'auto' }}
        />
    )
}


interface KProps {
    linkData: any[]
}

const LinkList: React.FC<KProps> = props => {
    // console.log('/////////////////props', props);
    return (
        <div>
            {
                props.linkData && props.linkData.map((item, i) => {
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                            <img
                                style={{ maxWidth: "120px", maxHeight: "320px", marginRight: '30px' }}
                                src={item?.imageUrl}
                            />
                            <span>链接：{item?.linkUrl}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

const ThemeDetails: React.FC<IProps> = props => {
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<any>({ oldCustomerSetting: {} })

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
    }, [parmId])


    return (
        <div className="activityPage">
            {/* {data.type === 2 && (<h3 style={{ marginBottom: '20px' }}>新客户营销页设置</h3>)} */}
            <Spin spinning={loading}>
                <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} layout="horizontal" form={form} size="middle">
                    <Form.Item label="活动类型">
                        <div>{data.type === 1 ? '主题活动' : '转介绍活动'}</div>
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
                    <Form.Item label={(data.type === 1 ? '主题' : "转介绍") + '活动页面设置内容'}>
                        <div>
                            {data.type === 2 && (<h2>新客户页面设置</h2>)}
                            <p>页面标题：{data.title}</p>
                            <LinkList linkData={data.links}></LinkList>
                            {
                                data.type === 2 && (
                                    <div>
                                        <h3 style={{ margin: '25px 0' }}>选择的卡券</h3>
                                        <CardsList tableData={data.cardsList}></CardsList>
                                    </div>
                                )
                            }
                            {(data.type === 2 && data.oldCustomerSetting) && (<h2 style={{ marginTop: '25px' }}>老客户页面设置</h2>)}
                            {(data.type === 2 && data.oldCustomerSetting) && (<p>营销页页面标题：{data.oldCustomerSetting.marketPageTitle}</p>)}
                            {
                                (data.type === 2 && data.oldCustomerSetting) && (
                                    <LinkList linkData={data.oldCustomerSetting.links}></LinkList>
                                )
                            }
                            {(data.type === 2 && data.oldCustomerSetting) && (<p>福利页页面标题：{data.oldCustomerSetting.welfarePageTitle}</p>)}
                            {
                                (data.type === 2 && data.oldCustomerSetting) && (
                                    <img
                                        style={{ width: '120px', height: '120px' }}
                                        src={data.oldCustomerSetting.welfarePageImg}
                                    />
                                )
                            }
                            {
                                (data.type === 2 && data.oldCustomerSetting) && (
                                    <div>
                                        <h3 style={{ margin: '25px 0' }}>选择的卡券</h3>
                                        <CardsList tableData={data.oldCustomerSetting.cardsList}></CardsList>
                                    </div>
                                )
                            }
                        </div>
                    </Form.Item>
                    <Form.Item label="渠道名称">
                        <div>
                            {data.channelList && data.channelList.map((item, i) => <div key={i}>{item.channelName}</div>)}
                        </div>
                    </Form.Item>
                    <Form.Item label="发布状态">
                        <div>{data.issueStatus === 0 ? '未发布' : data.issueStatus === 1 ? '已发布' : '下架'}</div>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}


ThemeDetails.defaultProps = {
    next: (): void => { },
    isTheme: false
}

export default ThemeDetails
