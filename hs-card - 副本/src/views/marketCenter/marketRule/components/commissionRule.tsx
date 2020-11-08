/** @format */
import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Button, Form, InputNumber, message, Radio, Spin } from 'antd'
// import { useBoolean } from '@umijs/hooks
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
    const [data, setdata] = useState<any>({ otherCommission: {type: 1, objType: 'other'}, staffCommission: {type: 1, objType: 'staff'} })


    

    useImperativeHandle(props.cRef, () => ({
        // changeVal 就是暴露给父组件的方法,初始化
        changeVal: () => {
            console.log("==============")
            form.resetFields()
        }
    }));

    useEffect(() => {
        if (props.ruleId) {
            let params = {
                id: props.ruleId
            }
            setLoading(true)
            api.getMarketRuleDetails(params).then((res: any) => {
                if (res.code === 1) {
                    let data = res.data.rule
                   console.log(data)
                   data.id = res.data.id || ''
                   if(data.staffCommission && data.staffCommission.priceValue){
                       console.log("11111111")
											 data.staffCommission.objType = 'staff'
                       form.setFieldsValue({'staff':1})
                   }

                   if(data.staffCommission && data.staffCommission.retailValue){
										 data.staffCommission.objType = 'staff'
                    console.log("222222222222")
                    form.setFieldsValue({'staff':2})
                   }


                   if(data.otherCommission && data.otherCommission.priceValue){
										 data.otherCommission.objType = 'other'
                    form.setFieldsValue({'other':1})
                    
                   }

                   if(data.otherCommission && data.otherCommission.retailValue){
										 data.otherCommission.objType = 'other'
                    form.setFieldsValue({'other':2})
                   
                   }
                                     
                  
                  
                    setdata(data)
                } else {

                    message.error(
                        res.msg
                    );
                }
                setLoading(false)

            }).catch((err) => {
                console.log(err)
                message.error(err.msg)
                setLoading(false)
            })
        }

    }, [props.ruleId])

    const saveData = () => {
        console.log(data)
        let params = {
            id:data.id,
            type: 'CommissionRule',
            applyType: '5',
            rule: {
                otherCommission: data.otherCommission,
                staffCommission: data.staffCommission
            },

        }
        setLoading(true)
        api.saveMarketRule(params).then((res: any) => {
            if (res.code === 1) {
                message.success("保存成功")
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

    const changeRetail = (e, type) => {
        console.log(e)
				
        if (type == 1) {
						data.staffCommission.objType = 'staff'
						data.staffCommission.type = e.target.value
            if (e.target.value == 1) {
								
                data.staffCommission.retailValue = ''

                console.log(data)

                setdata({ ...data })
            }

            if (e.target.value == 2) {
                data.staffCommission.priceValue = ''

                setdata({ ...data })
            }
        }

        if (type == 2) {
					data.otherCommission.objType = 'other'
					data.otherCommission.type = e.target.value
            if (e.target.value == 1) {
                data.otherCommission.retailValue = ''
                console.log(data)
                setdata({ ...data })
            }

            if (e.target.value == 2) {
                data.otherCommission.priceValue = ''
                setdata({ ...data })
            }
        }


    }
    const changeStaff = (e, type) => {
        console.log(e)
				data.staffCommission.objType = 'staff'
				data.staffCommission.type = type
				form.setFieldsValue({'staff': type})
        if (type == 1) {
            data.staffCommission.priceValue = e
						data.staffCommission.retailValue = null
        } else {
						data.staffCommission.priceValue = null
            data.staffCommission.retailValue = e
        }
        data.staffCommission.value = e
        setdata({ ...data })
    }

    const changeOther = (e, type) => {
			data.otherCommission.objType = 'other'
			data.otherCommission.type = type
			form.setFieldsValue({'other': type})
        if (type == 1) {
            data.otherCommission.priceValue = e
						data.otherCommission.retailValue = null
        } else {
						data.otherCommission.priceValue = null
            data.otherCommission.retailValue = e
        }
        data.otherCommission.value = e
        console.log(e)
        setdata({ ...data })
    }



    return (
        <div>
            <Spin spinning={loading} >
                <br />
                <p style={{ color: '#000' }}>一级分佣设置（直销）</p>
                <ToolsBar visible={false}>
             
                    <Form form={form} labelCol={{ span: 4 }} initialValues={{staff:1,other:1}} style={{ marginTop: '10px', width: '100%' }}>

                        <Form.Item label="员工佣金" name='staff' rules={[{ required: true }]}>
                            <Radio.Group onChange={e => changeRetail(e, 1)} >
                                <Radio value={1}>商品售价 &nbsp;X&nbsp; <InputNumber
                                    placeholder=""
                                    step={0.1}
                                    min={0}
                                    value={data.staffCommission.priceValue}
                                    onChange={e => changeStaff(e, 1)}
                                /> %</Radio>

&nbsp;<span style={{ color: '#000' }}>或</span> &nbsp;&nbsp;&nbsp;

                                <Radio value={2}>固定佣金 X <InputNumber
                                    placeholder=""
                                    step={0.1}
                                    min={0}
                                    value={data.staffCommission.retailValue}
                                    onChange={e => changeStaff(e, 2)}
                                /> 元</Radio>

                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="非员工佣金" name='other' rules={[{ required: true }]}>
                            <Radio.Group onChange={e => changeRetail(e, 2)} >
                                <Radio value={1}>商品售价 &nbsp;X &nbsp; <InputNumber
                                    placeholder=""
                                    step={0.1}
                                    min={0}
                                    value={data.otherCommission.priceValue}
                                    onChange={e => changeOther(e, 1)}

                                /> %</Radio>

&nbsp;<span style={{ color: '#000' }}>或</span> &nbsp;&nbsp;&nbsp;

                                <Radio value={2}>固定佣金 X <InputNumber
                                    placeholder=""
                                    step={0.1}
                                    min={0}
                                    value={data.otherCommission.retailValue}
                                    onChange={e => changeOther(e, 2)}

                                /> 元</Radio>


                            </Radio.Group>
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




