/** @format */

import React, { useState, useRef, useEffect } from 'react'
import { Table, Button, Modal, Form, message, Spin } from 'antd'
import '../style.less'
import RuleTable from '../../../components/ruleTable'
import RuleDetails from '../../../components/ruleDetails'

import { uniqueArr } from '@/utils/common'
import * as api from '@/api'
// import { useRequest } from '@umijs/hooks'
import { formatApplyType } from '@/utils/common'
import { useHistory } from 'react-router-dom'


interface IProps {
    next: (data: any, from: any) => void,
    prev: (e, data) => void,
    editData: any
}

const PageRulesSet: React.FC<IProps> = props => {
    const [form] = Form.useForm()
    const [dataList, setdataList] = useState<any>([])
    const [params, setParams] = useState<any>({ page: 1, pageSize: 8 })
    const [total, setTotal] = useState<any>(0)
    const [visibleRule, setVisibleRule] = useState<boolean>(false)
    const [visibleRuleDetails, setVisibleRuleDetails] = useState<boolean>(false)
    const history = useHistory()
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedRowRule, setSelectedRowRule] = useState<any[]>([])
    const [curRuleId, setCurRuleId] = useState<any>(0)
    const parmId = history.location.search.split('=')[1]



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
            api.getActivityRuleList({ ...params, id: parmId }).then((res: any) => {
                if (res.code == 1) {
                    setdataList(res.data)
                    setTotal(res.data.total)
                    setParams({ pageSize: res.data.pageSize, page: res.data.page })

                } else {
                    setdataList([])
                }
                setLoading(false)
            }).catch(err => {
                message.error(err.msg)
                setLoading(false)
            })


            // if (props.editData.rules && props.editData.rules.length > 0) {
            //     setdataList(props.editData.rules)
            // } else {
            //     setdataList([])
            // }


        } else {
            if (dataList.length > 0) {
                setdataList([])
            } else {
                setdataList(props.editData.rules)
            }

        }



    }, [parmId])

    // useRequest(() =>
    //     // setLoading(true)
    //     api.getActivityRuleList({ ...params, id: '5' }).then((res: any) => {
    //         if (res.code == 1) {
    //             setdataList(res.data.items)
    //             setTotal(res.data.total)
    //             setParams({ pageSize: res.data.pageSize, page: res.data.page })
    //             setLoading(false)
    //         } else {
    //             setdataList([])
    //         }
    //     })

    // )




    const delData = (index) => {
        console.log(index)
        dataList.splice(index, 1)
        setdataList([...dataList])
    }
    const showRule = () => {
        updateChildState()
        setVisibleRule(true)
    }

    const handleOkRule = () => {
        for (let i in selectedRowRule) {
            selectedRowRule[i].ruleId = selectedRowRule[i].id
        }
        let arr = uniqueArr(dataList, selectedRowRule, 'ruleId')
        console.log(arr)
        setdataList(arr)
        setVisibleRule(false)

    }

    const getRuleData = data => {
        console.log(data)
        setSelectedRowRule(data)
    }

    const getDataDetails = data => {
        console.log(data)
        setCurRuleId(data.ruleId || data.id) //ruleId 回显的数据  / id:新添加的
        setVisibleRuleDetails(true)

    }
    const nextStape = e => {
        if (!dataList || dataList.length == 0) {
            message.error('规则不能为空')
            return
        }
        props.editData.stape = 3
        for (let i in dataList) {
            dataList[i].ruleId = dataList[i].ruleId || dataList[i].id
        }
        props.editData.rules = dataList
        props.next(props.editData, form)
    }

    const prevStape = e => {
        props.prev(1, props.editData)
    }
    const columns: any = [
        {
            title: '序号',
            // dataIndex: 'name',
            width: 50,
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
                        <Button type="link" style={{ padding: '0' }}>
                            {row.name.length < 100 ? row.name : row.name.substr(0, 100) + '...'}
                        </Button>
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
        },

        {
            title: '操作',
            align: 'center',

            width: 80,
            render: (a, row) => {
                return (
                    <div>
                        <Button type="link" onClick={() => getDataDetails(row)} style={{ color: '#FB721F' }}>
                            详细
            </Button>

                        <Button type="link" onClick={() => delData(row)} style={{ color: '#FB721F' }}>
                            删除
            </Button>

                    </div >
                )
            },
        },
    ]

    return (
        <div>
            <div><label><span style={{ color: 'red' }}>*</span>活动规则:</label><Button type="primary" onClick={showRule} style={{ background: '#304156', color: '#fff', border: '1px solid #304156' }}>选择</Button>
            </div>
            <div style={{ backgroundColor: 'white', marginTop: '15px' }}>
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        size="middle"
                        rowKey="id"
                        bordered
                        dataSource={dataList}
                        pagination={{
                            total: total,
                            showTotal: total => `共 ${total} 条`,
                            pageSize: 8,
                            showSizeChanger: true,
                        }}
                    />

                </Spin>
            </div>

            <br />
            <div style={{ textAlign: 'center' }}><Button htmlType="submit" onClick={prevStape}>上一步</Button>&nbsp;&nbsp;&nbsp;<Button type="primary" htmlType="submit" onClick={nextStape}>下一步</Button></div>

            < Modal
                title="选择规则"
                centered
                visible={visibleRule}
                onOk={handleOkRule}
                // confirmLoading={loading}
                width={700}
                onCancel={() => setVisibleRule(false)}
                bodyStyle={{ padding: '0px 20px 0px 0px ' }}>
                <RuleTable getRuleData={getRuleData} cRef={childRef} applyType={props.editData.type}></RuleTable>

            </ Modal>

            < Modal
                title="规则详细"
                centered
                visible={visibleRuleDetails}
                footer={null}
                // confirmLoading={loading}
                width={600}
                onCancel={() => setVisibleRuleDetails(false)}
                bodyStyle={{ padding: '20px 0px 20px 80px ' }}>
                <RuleDetails ruleId={curRuleId}></RuleDetails>

            </ Modal>


        </div>
    )
}

export default PageRulesSet
