/** @format */

import React, { useState, useRef, useEffect } from 'react'
import { Table, Button, Form, Modal, Input, Radio, Row, Col, InputNumber, message, Spin } from 'antd'
import '../style.less'
import * as api from '@/api'
import GoodTable from '../../../components/goodTable'
import { toDecimal2, uniqueArr } from '@/utils/common'
import { useHistory } from 'react-router-dom'
import ModalSelectComp from '../../../components/modalSelectComp'

// import { useHistory } from 'react-router-dom'
// import { useRequest } from '@umijs/hooks'

interface IProps {
    next: (data: any, from: any) => void,
    prev: (e, data) => void,
    editData: any
}
const PageGoodsSet: React.FC<IProps> = props => {
    const history = useHistory()
    const [form] = Form.useForm()
    const [visibleGood, setVisibleGood] = useState<boolean>(false)
    const [stockVisible, setStockVisible] = useState<boolean>(false)
    const [priceVisible, setPriceVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedRowGood, setSelectedRowGood] = useState<any[]>([])
    const [dataList, setdataList] = useState<any>([])
    const [total, setTotal] = useState<any>(0)
    const [params, setParams] = useState<any>({ page: 1, pageSize: 8 })
    const [curIndex, setCurIndex] = useState<any>(0)
    const [curPriceData, setCurPriceData] = useState<any>({ type: 1, price: '', disPrice: '' })
    const [curStock, setCurStock] = useState<any>('')
    const parmId = history.location.search.split('=')[1]
    const [isAll, setIsAll] = useState<number>(1)
    const [shopList, setShopList] = useState<any>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [shopListCache, setShopListCache] = useState<any>([])
    const [selectCompList, setSelectCompList] = useState<any>([])
    const [shopCodes, setShopCodes] = useState<any>([])


    // const history = useHistory()
    const childRef = useRef();
    const updateChildState = () => {
        // changeVal就是子组件暴露给父组件的方法
        (childRef?.current as any)?.changeVal();
    }


    useEffect(() => {
        console.log("活动发布props.editData", props.editData);
        if (parmId) {
            props.editData.issueStatus = 0
            props.editData.finish = false
            setLoading(true)
            api.getActivityGoodsList({ ...params, id: parmId }).then((res: any) => {
                if (res.code == 1) {
                    setdataList(res.data)
                    setTotal(res.data.total)
                    setParams({ pageSize: res.data.pageSize, page: res.data.page })

                    setLoading(false)
                } else {
                    setdataList([])
                }
                setLoading(false)
            }).catch(err => {
                message.error(err.msg)
                setLoading(false)
            })

            api.getShopList({ ...params, id: parmId }).then((res: any) => {
                if (res.code == 1) {
                    setTotal(res.data.total)
                    setParams({ pageSize: res.data.pageSize, page: res.data.page })
                    if (res.data.length > 0 && res.data[0].shopCode == "*") {
                        console.log("111111111111")
                        form.setFieldsValue({ 'isAll': 1 })  //回显全部
                        setIsAll(1)
                    } else {
                        console.log("222222222")
                        setShopList(res.data)
                        setShopListCache(res.data)
                        form.setFieldsValue({ 'isAll': 2 })  //回显部分
                        setIsAll(2)
                    }

                    setLoading(false)
                } else {
                    form.setFieldsValue({ 'isAll': 1 })  //默认显示全部
                    setIsAll(1)
                    setShopList([])
                }
                setLoading(false)
            }).catch(err => {
                message.error(err.msg)
                setLoading(false)
            })


            // if (props.editData.goodsList && props.editData.goodsList.length > 0) {
            //     setdataList(props.editData.goodsList)
            // } else {
            //     setdataList([])
            // }


        } else {

            //从上一页返回，回显
            console.log(props.editData.goodsList)
            //商品
            if (dataList.length > 0) {
                setdataList([])
            } else {
                setdataList(props.editData.goodsList)
            }

            //店铺
            console.log(props.editData.shopList)
            if (shopList.length > 0) {
                setShopList([])
            } else {
                setShopList(props.editData.shopList)
            }

            if (props.editData.isAll) {
                setIsAll(props.editData.isAll)
                form.setFieldsValue({ 'isAll': props.editData.isAll })  //回显全部
            } else {
                setIsAll(1)
            }



        }



    }, [parmId])


    // useEffect(() => {
    //     if (isAll == 1) {
    //         setShopList([])
    //     }

    //     if (isAll == 2) {
    //         handleOk(1)
    //     }


    // }, [isAll])

    const delData = (index) => {
        console.log(index)
        dataList.splice(index, 1)
        setdataList([...dataList])
    }

    const showAddGoods = () => {
        if (!shopList || shopList.length == 0) {
            message.error('请先选择门店!')
            return
        }
        updateChildState()
        setVisibleGood(true)
    }

    const getGoodsData = data => {
        setSelectedRowGood(data)

    }

    const setShowPrice = (row, index) => {
        setCurIndex(index)
        // console.log(dataList[index])
        setCurPriceData({ type: 1, price: '', disPrice: '' })
        setPriceVisible(true)
    }

    const setShowStock = (row, index) => {
        setCurIndex(index)
        setCurStock('')
        setStockVisible(true)
    }

    const handleOkPrice = e => {
        if (curPriceData.type == 2) {
            console.log("2222222222")
            if (curPriceData.price > dataList[curIndex].salePrice) {
                message.error("活动价不能大于售价")
                return
            } else {
                dataList[curIndex].price = curPriceData.price || dataList[curIndex].salePrice
            }
            dataList[curIndex].type = 2
        }
        if (curPriceData.type == 1) {
            console.log("11111111111")
            dataList[curIndex].type = 1
            dataList[curIndex].disPrice = curPriceData.disPrice
            // dataList[curIndex].price = toDecimal2(dataList[curIndex].salePrice * (curPriceData.disPrice / 10)) || 0.1
            let price = Number(toDecimal2(dataList[curIndex].salePrice * (curPriceData.disPrice / 10)))
            dataList[curIndex].price = price ? price : 0.01
        }

        console.log(dataList[curIndex])
        setdataList(dataList)
        setPriceVisible(false)

    }
    const handleCancelPrice = e => {
        setPriceVisible(false)

    }

    const handleCancelStock = e => {
        setStockVisible(false)

    }


    const selectPriceType = e => {
        //     console.log(e)
        if (e.target.value == 1) {
            setCurPriceData({ type: e.target.value, price: '' })
        }

        if (e.target.value == 2) {
            setCurPriceData({ type: e.target.value, disPrice: '' })
        }

    }



    const setPrice = (value, type) => {
        if (type == 2) {
            console.log(value)
            console.log("22222222")
            console.log(dataList[curIndex].salePrice)
            if (value > dataList[curIndex].salePrice) {
                message.error("活动价不能大于售价")

            } else {
                setCurPriceData({ type: type, price: value, disPrice: '' })
            }
        }

        if (type == 1) {
            console.log("111111")
            setCurPriceData({ type: type, disPrice: value, price: '' })
        }

    }

    const setStock = (value) => {
        if (value > dataList[curIndex].goodsStock) {
            message.error("活动库存不能大于商品库存")
        }
        setCurStock(value)
    }

    const showComp = e => {
        updateChildState()
        setVisible(true)
    }

    const handleOkGood = () => {
        let arr = uniqueArr(dataList, selectedRowGood, 'goodsId')
        console.log(arr)
        setdataList(arr)
        setVisibleGood(false)

    }

    const handleOkStock = () => {
        if (curStock > dataList[curIndex].goodsStock) {
            message.error("活动库存不能大于商品库存")
            return
        }
        dataList[curIndex].stock = curStock || dataList[curIndex].goodsStock
        console.log(dataList[curIndex])
        setdataList(dataList)
        setStockVisible(false)

    }

    const setSelectComp = (data, checkedKeys) => {
        console.log(data)
        console.log(checkedKeys)
        // let keys = [...checkedKeys, ...shopCodes]
        let keys: any = []
        let arr: any = []
        for (let i in data) {
            if (data[i].shopNo) {
                delete data[i].children
                arr.push(data[i])
                keys.push(data[i].shopCode)
            }
        }
        console.log(arr)
        console.log(keys)
        let newKeys = [...shopCodes, ...keys]
        // let arr = uniqueArr(shopCodes, selectedRowGood, 'goodsId')
        setShopCodes([...new Set(newKeys)])
        setSelectCompList(arr)


    }
    const onSelectCompType = e => {
        console.log(e)
        setIsAll(e.target.value)
    }

    // const onFinish = e => {
    //     // console.log('活动发布', e);
    //     // const curCard = getStore('curCard')
    //     // if (isAll !== 1) {
    //     //     if (selectComp.length == 0) {
    //     //         message.error('部分门店时，门店不能为空，请添加！')
    //     //         return
    //     //     }
    //     // }

    // }

    const delShopData = (index) => {

        shopList.splice(index, 1)
        console.log(shopList)

        // { items: [], total: 0, pageSize: 8, size: 1 }
        setShopList([...shopList])

    }
    const nextStape = e => {
        // console.log('eeeeeeeeee', e);

        console.log(dataList)
        if (!dataList || dataList.length == 0) {
            message.error('商品不能为空')
            return
        }
        props.editData.stape = 2
        props.editData.isAll = isAll
        props.editData.goodsList = dataList
        // if (isAll == 1) {
        //     props.editData.shopList = [{
        //         areaId: '*',
        //         areaName: '全部',
        //         shopCode: '*',
        //         shopName: '全部'
        //     }]

        // }
        // if (isAll == 2) {
        props.editData.shopList = shopList

        // }

        props.next(props.editData, form)



    }

    const prevStape = e => {
        // setCurrent(0)
        // props.editData.goodsList = dataList
        props.prev(0, props.editData)
    }

    const handleOk = e => {
        setShopList(shopListCache)
        let arr: any = []
        if (e == 1) {
            arr = uniqueArr(shopListCache, selectCompList, 'shopCode')
        } else {
            arr = uniqueArr(shopList, selectCompList, 'shopCode')
        }

        console.log(arr)
        setShopList([...arr])
        setVisible(false)
    }
    const handleCancel = e => {
        setVisible(false)
    }

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
        {
            title: '操作事件',
            dataIndex: 'operateEvent',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (val, row, index) => {
                return (
                    <div>
                        <Button type="link" onClick={() => delShopData(index)} style={{ color: '#FB721F' }}>
                            删除
            </Button>

                    </div>
                )
            },
        },
    ]


    const columns: any = [
        {
            title: '商品ID',
            dataIndex: 'goodsId',
            align: 'left',
            width: 60,
            ellipsis: true,

        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            align: 'left',
            width: 200,
            ellipsis: true,
            render: (a, row) => {
                return (
                    <div>
                        <Button type="link" style={{ padding: '0' }}>
                            {row.goodsName.length < 15 ? row.goodsName : row.goodsName.substr(0, 15) + '...'}
                        </Button>
                    </div>
                )
            },
        },

        {
            title: '类目',
            dataIndex: 'classify',
            align: 'center',
            width: 130,

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
            width: 120,
            render: (val, row, index) => {
                return (
                    <div style={{ display: 'flex', 'alignItems': 'center' }}>
                        <Input placeholder="活动价" onClick={() => setShowPrice(row, index)} readOnly value={row.price} prefix={row.type == 1 ? "折后价" : null} />
                        {row.type == 1 ? <div style={{ width: '70px' }}>{row.disPrice}折</div> : null}
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
            render: (val, row, index) => {
                return (
                    <div>
                        <Input placeholder="活动库存" onClick={() => setShowStock(row, index)} readOnly value={row.stock} />

                    </div>
                )
            },

        },

        {
            title: '操作',
            align: 'center',

            width: 80,
            render: (val, row, index) => {
                return (
                    <div>
                        <Button type="link" onClick={() => delData(index)} style={{ color: '#FB721F' }}>
                            删除
            </Button>

                    </div>
                )
            },
        },
    ]

    return (
        <div>
            <Form layout="vertical" form={form} onError={() => props.editData.finish = false} initialValues={{ "isAll": 2 }}>
                <Form.Item name="isAll" label="适用门店" rules={[{ required: true, message: '请选择适用门店' }]}>
                    <Radio.Group onChange={onSelectCompType} >
                        {/* <Radio value={1}>全部门店</Radio> */}
                        <Radio value={2}>选择门店</Radio>
                        {/* {isAll === 2 ? ( */}
                        <Button type="primary" ghost onClick={e => showComp(e)} >
                            添加
                            </Button>
                        {/* ) : null} */}
                    </Radio.Group>

                </Form.Item>
                <Form.Item>
                    {/* {isAll === 2 ? ( */}
                    <Spin spinning={loading}>
                        <Table
                            columns={columnsShop}
                            rowKey="shopCode"
                            dataSource={shopList}
                            bordered
                            size="small"
                            pagination={{
                                total: total,
                                showTotal: total => `共 ${total} 条`,
                                pageSize: 8,
                            }}
                            style={{ width: '60%' }}
                        />
                    </Spin>
                    {/* ) : null} */}
                </Form.Item>


            </Form>


            <div><label><span style={{ color: 'red' }}>*</span>活动商品:</label><Button type="primary" style={{ background: '#304156', color: '#fff', border: '1px solid #304156' }} onClick={() => showAddGoods()}>添加商品</Button>
            </div>
            <div style={{ backgroundColor: 'white', marginTop: '15px' }}>
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        size="middle"
                        rowKey="goodsId"
                        bordered
                        dataSource={dataList}
                        pagination={{
                            total: total,
                            showTotal: total => `共 ${total} 条`,
                            pageSize: params.pageSize,
                            showSizeChanger: false,

                        }}
                    />
                </Spin>
            </div>



            <br />
            <div style={{ textAlign: 'center' }}><Button htmlType="submit" onClick={prevStape}>上一步</Button>&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={nextStape}>下一步</Button>
            </div>
            {
                visibleGood ? < Modal
                    title="选择商品"
                    centered
                    visible={visibleGood}
                    onOk={handleOkGood}
                    confirmLoading={loading}
                    width={1100}
                    onCancel={() => setVisibleGood(false)}
                    bodyStyle={{ padding: '0px 20px 0px 0px ' }}>
                    <GoodTable getGoodsData={getGoodsData} cRef={childRef} shopCodes={shopCodes}></GoodTable>

                </ Modal> : null
            }


            <Modal
                title="设置价格"
                width="400px"
                visible={priceVisible}
                onOk={handleOkPrice}
                onCancel={handleCancelPrice}
            >
                <Radio.Group name="type" value={curPriceData.type} onChange={selectPriceType}>

                    <Row>
                        <Col flex={1} style={{ lineHeight: '30px' }}><Radio value={1}>折&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;扣</Radio></Col>
                        <Col flex={4}>
                            <InputNumber
                                placeholder="输入折扣"
                                step={0.01}
                                min={0}
                                max={9.9}
                                style={{ width: '230px' }}
                                onChange={(e) => setPrice(e, 1)}
                                value={curPriceData.disPrice} /> 折</Col>
                    </Row>
                    <Row style={{ height: '10px' }}></Row>

                    <Row>
                        <Col flex={1} style={{ lineHeight: '30px' }}><Radio value={2}>固定金额</Radio></Col>
                        <Col flex={4} >
                            <InputNumber
                                placeholder="输入固定金额"
                                step={0.01}
                                min={0}
                                style={{ width: '230px' }}
                                onChange={(e) => setPrice(e, 2)}
                                value={curPriceData.price} /> 元</Col>
                    </Row>

                </Radio.Group>

            </Modal>


            <Modal
                title="设置库存"
                width="400px"
                visible={stockVisible}
                onOk={handleOkStock}
                onCancel={handleCancelStock}
            >

                <Row>
                    <Col flex={1} style={{ lineHeight: '30px' }}>库存</Col>
                    <Col flex={4} >
                        <InputNumber
                            placeholder="输入库存"
                            step={1}
                            min={0}
                            style={{ width: '230px' }}
                            onChange={(e) => setStock(e)}
                            value={curStock} />
                    </Col>
                </Row>



            </Modal>

            <Modal title="选择门店" visible={visible} onOk={handleOk} onCancel={handleCancel}>
                <ModalSelectComp setSelectComp={setSelectComp} cRef={childRef} ></ModalSelectComp>
            </Modal>

        </div >
    )
}

PageGoodsSet.defaultProps = {
    next: (): void => { },

}

export default PageGoodsSet
