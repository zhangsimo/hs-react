/** @format */
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Button, Form, InputNumber, message, Spin } from 'antd'
// import { useBoolean } from '@umijs/hooks'
import * as api from '@/api'
// import { useForm } from 'antd/lib/form/Form'
// import { useEffect } from 'react'
// import { formatRuleType, formatApplyType } from '@/utils/common'
import ToolsBar from '@/components/ToolsBar'


interface IProps {
    cRef: any,
    ruleId: any,
    closeModal: () => void
}


const BuyOrGive: React.FC<IProps> = (props) => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    // const [dataList, setdataList] = useState<any>([])
    const [curId, setCurId] = useState<any>('')

    useImperativeHandle(props.cRef, () => ({
        // changeVal 就是暴露给父组件的方法,初始化
        changeVal: () => {
            console.log("==============")
            // setdataList([])
            form.resetFields()
        }
    }));


    useEffect(() => {
        if (props.ruleId) {
            let params = {
                id: props.ruleId
            }
            api.getMarketRuleDetails(params).then((res: any) => {
                if (res.code === 1) {
                    let data = res.data
                    setCurId(data.id)
                    form.setFieldsValue({ 'fullMoney': data.rule.fullMoney })
                    form.setFieldsValue({ 'reduceMoney': data.rule.reduceMoney })
                } else {
                    message.error(
                        res.msg
                    );
                }
                setLoading(false)

            }).catch((err) => {
                message.error(err.msg)
                setLoading(false)
            })
        }

    }, [props.ruleId])

    const saveData = () => {
        let params = {
            id: curId || '',
            type: 'FullReduceRule',
            applyType: '7',
            rule: {
                fullMoney: form.getFieldValue('fullMoney'),
                reduceMoney: form.getFieldValue('reduceMoney'),
                giveType: 'FullReduceRule',
            },

        }
        setLoading(true)
        api.saveMarketRule(params).then((res: any) => {
            if (res.code === 1) {
                message.success('保存成功')
            } else {
                message.error(

                    res.msg
                );
            }
            props.closeModal()
            setLoading(false)

        }).catch((err) => {
            message.error(err.msg)
            setLoading(false)
        })
    }

    const cancel = () => {
        props.closeModal()
    }











    return (
        <div>
            <Spin spinning={loading} >
                <ToolsBar visible={false}>

                    <Form layout="inline" form={form} style={{ marginTop: '10px', width: '100%' }}>

                        <Form.Item name="fullMoney" label="满" rules={[{ required: true }]}>
                            <InputNumber
                                placeholder="金额"
                                step={1}
                                min={0}
                            // onChange={}

                            />
                        </Form.Item>
                        <Form.Item name="reduceMoney" label="送" rules={[{ required: true }]} >
                            <InputNumber
                                placeholder="金额"
                                step={1}
                                min={0}


                            />
                        </Form.Item>



                    </Form>
                </ToolsBar>


                <div className="ruleBlock">
                    <div style={{ textAlign: 'center' }}><Button htmlType="submit" onClick={cancel}>取消</Button>&nbsp;&nbsp;&nbsp;<Button htmlType="submit" type="primary" onClick={saveData}>保存</Button></div>


                </div>


            </Spin>
        </div >

    )
}


export default BuyOrGive




