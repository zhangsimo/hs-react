/**
 *  数据趋势图表
 *
 * @format
 */

import React, { useEffect } from 'react'
// import useFetch from '@hooks'
// import { getCardGetAnalysis } from '@/api'
// import { useRequest } from '@umijs/hooks'
// import Dist from '@/components/Select/dict'
import { Form, Button, Checkbox } from 'antd'
import { useHistory } from 'react-router-dom'
// import * as api from '@/api'
// import ModalSelectComp from '../../../components/modalSelectComp'
// import { uniqueArr } from '@/utils/common'

// const { Search } = Input

interface IProps {
    next: (data: any, from: any) => void,
    prev: (e, data) => void,
    editData: any
}


const PublishActivity: React.FC<IProps> = props => {
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [form] = Form.useForm()
    // const [visible, setVisible] = useState<boolean>(false)
    // const [isAll, setIsAll] = useState<number>(1)
    // const [params, setParams] = useState<any>({ page: 1, pageSize: 8 })
    // const [shopList, setShopList] = useState<any>([])
    // const [shopListCache, setShopListCache] = useState<any>([])

    // const [loading, setLoading] = useState<boolean>(false)
    // const [total, setTotal] = useState<any>(0)
    // const [selectCompList, setSelectCompList] = useState<any>([])

    useEffect(() => {
        console.log("活动发布props.editData", props.editData);
        if (parmId) {
            props.editData.issueStatus = 0
            props.editData.finish = false
            if (props.editData.channelList && props.editData.channelList.length > 0) {
                const channel: string[] = []
                for (const key of props.editData.channelList) {
                    channel.push(key.channel)
                }
                // console.log('channel-channel-channel', channel);
                form.setFieldsValue({ 'channelList': channel })
            } else {
                props.editData.channelList = []
            }


            // api.getShopList({ ...params, id: parmId }).then((res: any) => {
            //     if (res.code == 1) {
            //         setTotal(res.data.total)
            //         setParams({ pageSize: res.data.pageSize, page: res.data.page })
            //         if (res.data.length > 0 && res.data[0].shopCode == "*") {
            //             console.log("111111111111")
            //             form.setFieldsValue({ 'isAll': 1 })  //回显全部
            //             setIsAll(1)
            //         } else {
            //             console.log("222222222")
            //             setShopList(res.data)
            //             setShopListCache(res.data)
            //             form.setFieldsValue({ 'isAll': 2 })  //回显部分
            //             setIsAll(2)
            //         }
            //         console.log(111, res.data)
            //         // let arr: any = res.data
            //         // setShopList([{
            //         //     areaId: '*',
            //         //     areaName: '全部',
            //         //     shopCode: '*',
            //         //     shopName: '全部'
            //         // }])
            //         // console.log(shopList)
            //         setLoading(false)
            //     } else {
            //         form.setFieldsValue({ 'isAll': 1 })  //默认显示全部
            //         setIsAll(1)
            //         setShopList([])
            //     }
            //     setLoading(false)
            // }).catch(err => {
            //     message.error(err.msg)
            //     setLoading(false)
            // })



            // if (props.editData.shopList && props.editData.shopList.length > 0 && props.editData.shopList[0].shopCode == "*") {



            // } else {


            //     form.setFieldsValue({ 'isAll': 2 })

            // }
        } else {
            form.setFieldsValue({ 'isAll': 1 })

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

    const prevStape = e => {
        props.prev(2, props.editData)
    }

    // 点击保存或者发布按钮
    const saveOrPubilish = status => {
        console.log('点击保存或者发布按钮', status);
        props.editData.issueStatus = status  // 0 保存    1 发布
    }



    // const onSelectCompType = e => {
    //     console.log(e)
    //     setIsAll(e.target.value)
    // }


    // const handleOk = e => {
    //     setShopList(shopListCache)
    //     let arr: any = []
    //     if (e == 1) {
    //         arr = uniqueArr(shopListCache, selectCompList, 'shopCode')
    //     } else {
    //         arr = uniqueArr(shopList, selectCompList, 'shopCode')
    //     }

    //     console.log(arr)
    //     setShopList([...arr])
    //     setVisible(false)
    // }
    // const handleCancel = e => {
    //     setVisible(false)
    // }

    // const showComp = e => {
    //     setVisible(true)
    // }


    const data = {
        'h5': {
            channel: 'h5',
            channelName: '官网'
        },
        'cgj_applet': {
            channel: 'cgj_applet',
            channelName: '车管家小程序'
        }
    }
    const onFinish = e => {
        // console.log('活动发布', e);
        // const curCard = getStore('curCard')
        // if (isAll !== 1) {
        //     if (selectComp.length == 0) {
        //         message.error('部分门店时，门店不能为空，请添加！')
        //         return
        //     }
        // }
        const channelList: any[] = []
        e.channelList.forEach(item => {
            channelList.push(data[item])
        })
        props.editData.channelList = channelList
        // if (isAll == 1) {
        //     props.editData.shopList = [{
        //         areaId: '*',
        //         areaName: '全部',
        //         shopCode: '*',
        //         shopName: '全部'
        //     }]

        // }
        // if (isAll == 2) {
        //     props.editData.shopList = shopList

        // }

        props.editData.finish = true
        console.log();
        props.next(props.editData, form)
    }

    // const setSelectComp = data => {
    //     console.log(data)
    //     let arr: any = []
    //     for (let i in data) {
    //         if (data[i].shopNo) {
    //             delete data[i].children
    //             arr.push(data[i])
    //         }
    //     }
    //     console.log(arr)
    //     setSelectCompList(arr)

    // }

    // const delData = (index) => {

    //     shopList.splice(index, 1)
    //     console.log(shopList)

    //     // { items: [], total: 0, pageSize: 8, size: 1 }
    //     setShopList([...shopList])

    // }

    // const columns: any = [
    //     {
    //         title: '序号',
    //         // dataIndex: 'name',
    //         width: 50,
    //         render: (val, row, index) => `${index + 1}`,
    //     },
    //     {
    //         title: '区域名称',
    //         dataIndex: 'areaName',
    //         align: 'center',
    //         width: 150,
    //     },
    //     {
    //         title: '门店名称',
    //         dataIndex: 'shopName',
    //         align: 'center',
    //         width: 200,
    //     },
    //     {
    //         title: '操作事件',
    //         dataIndex: 'operateEvent',
    //         align: 'center',
    //         fixed: 'right',
    //         width: 100,
    //         render: (val, row, index) => {
    //             return (
    //                 <div>
    //                     <Button type="link" onClick={() => delData(index)} style={{ color: '#FB721F' }}>
    //                         删除
    //         </Button>

    //                 </div>
    //             )
    //         },
    //     },
    // ]

    return (
        <div>
            <Form layout="vertical" form={form} onFinish={onFinish} onError={() => props.editData.finish = false}>
                <Form.Item name="channelList" label="发布渠道" rules={[{ required: true, message: '请选择发布渠道' }]}>
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Checkbox value="h5">官网</Checkbox>
                        <Checkbox value="cgj_applet">车管家小程序</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                {/* <Form.Item name="isAll" label="适用门店" rules={[{ required: true, message: '请选择适用门店' }]}>
                    <Radio.Group onChange={onSelectCompType} >
                        <Radio value={1}>全部门店</Radio>
                        <Radio value={2}>部分门店</Radio>
                        {isAll === 2 ? (
                            <Button type="primary" ghost onClick={e => showComp(e)} >
                                添加
                            </Button>
                        ) : null}
                    </Radio.Group>

                </Form.Item>
                <Form.Item>
                    {isAll === 2 ? (
                        <Spin spinning={loading}>
                            <Table
                                columns={columns}
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
                    ) : null}
                </Form.Item> */}
                <Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button htmlType="submit" onClick={prevStape}>上一步</Button>&nbsp;&nbsp;&nbsp;
                    <Button type="default" htmlType="submit" onClick={() => saveOrPubilish(0)}>保存</Button>
                        <Button type="primary" htmlType="submit" onClick={() => saveOrPubilish(1)}>发布</Button>
                    </div>
                </Form.Item>

            </Form>



            {/* <br />

            <div style={{ textAlign: 'center' }}>
                <Button type="default" htmlType="submit" onClick={() => saveOrPubilish(0)}>保存</Button>
                <Button type="primary" htmlType="submit" onClick={() => saveOrPubilish(1)}>发布</Button>
            </div> */}


            {/* 
            <Modal title="选择门店" visible={visible} onOk={handleOk} onCancel={handleCancel}>
                <ModalSelectComp setSelectComp={setSelectComp} ></ModalSelectComp>
            </Modal> */}

        </div >
    )
}


PublishActivity.defaultProps = {
    next: (): void => { },
}

export default PublishActivity
