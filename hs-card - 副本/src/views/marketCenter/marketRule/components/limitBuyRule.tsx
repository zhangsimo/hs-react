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
    const [curId, setCurId] = useState<any>()
    // const [dataList, setdataList] = useState<any>([])

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
                    form.setFieldsValue({ 'limitAmount': data.rule.limitAmount })
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
            type: 'LimitBuyRule',
            applyType: '99',
            rule: {
                limitAmount: form.getFieldValue('limitAmount'),
                giveType: 'LimitBuyRule',
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

                    <Form form={form} initialValues={{ giveType: 1 }} style={{ marginTop: '10px', width: '100%' }}>

                        <Form.Item name="limitAmount" label="活动限购" rules={[{ required: true }]}>

                            {/* <Input prefix="￥" suffix="件" disabled /> */}

                            <InputNumber
                                placeholder="商品数量"
                                step={1}
                                min={0}
                                style={{ width: '150px' }}

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




