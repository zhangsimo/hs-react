/** @format */

import React, { useEffect, useState } from 'react'
import { Form, Input, Row, Col, Button, Modal, Spin, Pagination } from 'antd'
import * as api from '@/api'
// import {IEditType} from '@/interface'
import '../styles.less'
import UploadImg from '@/components/Upload/ImageQN'
import Moment from 'moment'
import 'moment/locale/zh-cn'
// import {PlusOutlined} from '@ant-design/icons'
import Table, { ColumnProps } from 'antd/lib/table'

import { IActivityCardDetails } from '@/interface/activity'
// import useSearchParam from '@/hooks/useSearchParams'
import { useHistory } from 'react-router-dom'
// 老客户页面配置
// import OldCustomerPageConfiguration from './themeDetails'
// import Icon from '@ant-design/icons'
// import {stripBasename} from 'history/PathUtils'
const dateFormat = 'YYYY-MM-DD'
interface IProps {
    next: (data: any, from: any) => void,
    editData: any
}

const OldCustomerPage: React.FC<IProps> = props => {
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [form] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [selectedRow, setSelectedRow] = useState<string[]>([])
    const [cardTypeDetailsDataList, setCardTypeDetailsDataList] = useState<any>([])
    const [cardTypeVisible, setCardTypeVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [cardTypeData, setCardTypeData] = useState<any>()
    const [welfarePageImg, setWelfarePageImg] = useState<string>('')
    const [fileList, setfileList] = useState<any>([{ imageUrl: '', linkUrl: '' }])


    useEffect(() => {
        if (parmId) {
            // 设置老客户营销页面的图片和链接
            const old = props.editData.oldCustomerSetting;
            console.log('oldoldoldold', old);
            if (Object.keys(old).length === 0) return
            setWelfarePageImg(old.welfarePageImg)
            form.setFieldsValue({
                welfarePageTitle: old.welfarePageTitle
            })
            form.setFieldsValue({
                marketPageTitle: old.marketPageTitle
            })
            old.cardsList && setCardTypeDetailsDataList(old.cardsList)
            old.links && setfileList(old.links)
        }
    }, [props])

    const changeImg = (index: React.ReactText, imgUrl: any) => {
        fileList[index].imageUrl = imgUrl
        const fliterFilelist = fileList.filter(item => item.imageUrl)
        if (!fileList[index].id) {
            let newFileList = [...fliterFilelist, ...[{ imageUrl: '', linkUrl: '' }]]
            setfileList(newFileList)
        }
    }

    const changeLink = (e, index: any) => {
        console.log('页面设置，老客户', e);
        fileList[index].linkUrl = e.target.value
        setfileList(fileList)
    }

    const nextStep = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault()
        form.validateFields().then(async values => {
            props.editData.oldCustomerSetting = {
                welfarePageImg,
                marketPageTitle: values.marketPageTitle,
                welfarePageTitle: values.welfarePageTitle,
                links: fileList.filter(item => item.imageUrl),
                cardsList: cardTypeDetailsDataList
            }
            props.editData.stape = 2
            props.editData.showOld = false
            props.next(props.editData, form)
        })
    }

    const onSelectChange = (selectedRowKeys, selectedRow) => {
        console.log(selectedRowKeys)
        setSelectedRowKeys(selectedRowKeys)
        setSelectedRow(selectedRow)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const uniqueArr = (arr1, arr2) => {
        let arr3 = arr1 || []
        let arr4 = arr2 || []
        let c = [...arr3, ...arr4] //两个数组合并一个的简单方法
        let d = []
        let hash = {}
        d = c.reduce((item, next) => {
            hash[next.cardId] ? '' : (hash[next.cardId] = true && item.push(next))
            return item
        }, [])
        return d
    }

    const saveSelectCard = () => {
        // setCardTypeDetailsData
        console.log(selectedRow)
        let arr = uniqueArr(selectedRow, cardTypeDetailsDataList)
        setCardTypeDetailsDataList(arr)
        setCardTypeVisible(false)
    }

    const cardTypeCancel = () => {
        setCardTypeVisible(false)
    }

    const showCardType = data => {
        setLoading(true)
        let params = {
            pageSize: data.pageSize || 8,
            page: data.page || 1,
            channel: data.channel || '007',
        }
        api.getActivityCardTypeList(params).then((res: any) => {
            if (res.code == 1) {
                setCardTypeData(res.data)
            }
            setCardTypeVisible(true)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    const delCardTypeDetails = (cardId: number) => {
        console.log(cardId)

        var filterItems = cardTypeDetailsDataList.filter(function (item) {
            return item.cardId !== cardId
        })
        // setCardTypeDetailsData(cardTypeDetailsData)
        setCardTypeDetailsDataList(filterItems)
    }

    const changeCarImg = (imgUrl: any) => {
        setWelfarePageImg(imgUrl)
    }

    const onChangeCardType = (page, pageSize) => {
        setSelectedRowKeys([]) // 下一页 清空其他页的勾选
        // setSelectedRowGoodKey([])
        let params = {
            page: page,
            pageSize: pageSize,
            channel: '007',
            cardsShelvesId: parmId,
        }
        showCardType(params)
    }
    const onShowSizeChange = e => { }

    const setName = e => {
        form.setFieldsValue({ name: e.target.value })
    }

    const setTitle = e => {
        form.setFieldsValue({ title: e.target.value })
    }
    const fomartUsetype = val => {
        console.log(val)
        let str: string = ''
        if (val == 1) {
            str = '满减券'
        }

        if (val == 2) {
            str = '抵扣券'
        }

        if (val == 3) {
            str = '折扣券'
        }

        if (val == 4) {
            str = '兑换券'
        }

        return str
    }
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
        },
        {
            title: '操作',
            align: 'center',
            render: (a, b, index) => {
                return (
                    <div>
                        <Button type="link" onClick={() => delCardTypeDetails(a.cardId)} style={{ color: '#FB721F' }}>删除</Button>
                    </div>
                )
            },
        },
    ]

    const columnsType: ColumnProps<IActivityCardDetails>[] = [
        {
            title: '卡券类型',
            dataIndex: 'cardType',
            align: 'left',
            width: 80,
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
            title: '卡券名称',
            dataIndex: 'subTitle',
            align: 'center',
            width: 220,
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
        },
        {
            title: '库存',
            dataIndex: 'cardNum',
            align: 'center',
        },
    ]


    return (
        <div className="cardPage">
            <Spin spinning={loading}>
                {/* 老客户的页面展示 */}
                <div style={{ height: '780px' }}>
                    <h3 style={{ marginBottom: '20px' }}>老客户营销页设置</h3>
                    <Spin spinning={loading}>
                        <Row style={{ height: '780px' }}>
                            <Col className="preview" style={{ overflow: 'hidden' }}>
                                <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '16px' }}>{form.getFieldValue('marketPageTitle')}</div>
                                <div style={{ height: '478px', overflow: 'auto' }}>
                                    {fileList.map((item: { imageUrl: any; linkUrl: string }, idx: any) => (
                                        <div key={idx}>
                                            <img src={item.imageUrl} style={{ width: '100%' }} />
                                        </div>
                                    ))}
                                </div>
                            </Col>
                            &nbsp; &nbsp;
                            <Col flex={5}>
                                <div>
                                    <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} layout="horizontal" form={form} size="middle">
                                        <Form.Item label="营销页面标题" name="marketPageTitle" rules={[{ required: true, message: '活动名称必填' }]}>
                                            <Input
                                                placeholder="请输入营销页面标题"
                                                allowClear
                                                onChange={e => {
                                                    setName(e)
                                                }}
                                            />
                                        </Form.Item>
                                    </Form>
                                    <br />
                                    <div style={{ maxHeight: '430px', overflow: 'auto' }}>
                                        <p>上传图片时，建议图片大小为：640*320px</p>
                                        {fileList.map((item: { imageUrl: any; linkUrl: string }, idx: any) => (
                                            <div className="flex item" key={idx}>
                                                <UploadImg
                                                    className="theme-img-upload"
                                                    disabled={false}
                                                    value={item.imageUrl}
                                                    onChange={(e: any) => changeImg(idx, e)}></UploadImg>
                                                <div style={{ width: '100%' }}>
                                                    链接：
                                                    <Input
                                                        placeholder="图片链接"
                                                        style={{ width: '80%' }}
                                                        defaultValue={item.linkUrl}
                                                        // value={item.linkUrl}
                                                        onChange={e => changeLink(e, idx)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Spin>
                </div>
                {/* 老客户选择福利 */}
                <Row>
                    <Col className="preview" style={{ overflow: 'hidden' }}>
                        <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '16px' }}>{form.getFieldValue('welfarePageTitle')}</div>
                        <div style={{ height: '590px', overflow: 'auto' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <img src={welfarePageImg} style={{ width: '100%' }}></img>
                            </div>
                            <div style={{ padding: '0 10px' }}>
                                {cardTypeDetailsDataList.map((item, idx) => (
                                    <div className="cdWrap" key={idx}>
                                        <div className="cd-body1">
                                            <div className="cd-body">
                                                <div className="cd-body-title">
                                                    <div className="tag1">{fomartUsetype(item.cardType)}</div>
                                                    {item.mainTitle}
                                                </div>
                                                <div className="b">{item.subTitle}</div>
                                                <div>{item.storeTitle}</div>
                                                <div>
                                                    {item.got && !item.isUsed && (
                                                        <span>{item.validDays > 0 ? item.validDays + '天后过期' : '已过期'}</span>
                                                    )}
                                                </div>
                                                <div className="btn1">{/* {showTip()} */}</div>
                                            </div>
                                        </div>
                                        <div className="cd-footer">
                                            <div className="flex">
                                                <div className="flex-item">使用详情</div>
                                            </div>
                                        </div>
                                        {item.got && (
                                            <div className="cd-flag">{item.validDays > 0 ? item.validDays + '天后过期' : '已过期'}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                    &nbsp; &nbsp;
                    <Col flex={6}>
                        <div>
                            <Form labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} layout="horizontal" form={form} size="middle">
                                <Form.Item label="福利页面标题" name="welfarePageTitle" rules={[{ required: true, message: '福利页面标题必填' }]}>
                                    <Input
                                        placeholder="请输入福利页面标题"
                                        allowClear
                                        onChange={e => {
                                            setTitle(e)
                                        }}
                                    />
                                </Form.Item>
                                <p style={{ marginLeft: '112px', marginTop: '-8px' }}>
                                    用于后期发券数量统计，建议填写规范：门店/地区/第三方+活动主题，
                                    <br />
                                    例：华胜总部20年双十一活动发券
                                </p>
                            </Form>
                            <br />
                            <div>
                                <div className="item">
                                    <p>选择卡券招牌 (大图片建议尺寸：640像素 * 400像素)</p>
                                    <div className="flex">
                                        <div style={{ width: '100%' }}>
                                            <UploadImg
                                                className="id-img-upload"
                                                disabled={false}
                                                value={welfarePageImg}
                                                onChange={(e: any) => changeCarImg(e)}></UploadImg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item">
                                <div style={{ marginBottom: '10px' }}>
                                    选择需要上架的卡券
                                    <Button type="primary" onClick={showCardType}>
                                        导入
                                    </Button>
                                </div>
                                <Table
                                    columns={columns}
                                    rowKey={'cardId'}
                                    dataSource={cardTypeDetailsDataList}
                                    size="small"
                                    bordered
                                    pagination={false}
                                    style={{ height: '192px', overflow: 'auto' }}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="btnBox">
                    <Button type="primary" onClick={nextStep} loading={loading}>
                        下一步
                    </Button>
                </div>
            </Spin>
            <Modal title="选择卡券" visible={cardTypeVisible} onOk={saveSelectCard} onCancel={cardTypeCancel} width={650}>
                <Spin spinning={loading}>
                    <Table
                        rowSelection={rowSelection}
                        columns={columnsType}
                        rowKey={'cardId'}
                        dataSource={cardTypeData?.items}
                        size="small"
                        bordered
                        pagination={false}
                        style={{ height: '192px', overflow: 'auto' }}
                    />

                    <Pagination
                        size="small"
                        total={cardTypeData?.total}
                        onChange={onChangeCardType}
                        onShowSizeChange={onShowSizeChange}
                        style={{ marginTop: '15px', textAlign: 'right' }}
                    />
                </Spin>
            </Modal>
        </div>
    )
}

OldCustomerPage.defaultProps = {
    next: (): void => { }
}

export default OldCustomerPage
