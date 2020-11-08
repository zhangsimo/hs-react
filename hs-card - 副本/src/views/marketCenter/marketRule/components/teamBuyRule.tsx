/** @format */
import React, { useState, useImperativeHandle } from 'react';
import { Button, Col, InputNumber, message, Row, Spin } from 'antd'
// import { useBoolean } from '@umijs/hooks'
import * as api from '@/api'
// import { useForm } from 'antd/lib/form/Form'
import { useEffect } from 'react'
// import { formatRuleType, formatApplyType } from '@/utils/common'

interface IProps {
    cRef: any,
    ruleId: any,
    closeModal: () => void
}

let RuleDetails: React.FC<IProps> = (props) => {
    const [teamBuyData, setTeamBuyData] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)

    useImperativeHandle(props.cRef, () => ({
        // changeVal 就是暴露给父组件的方法,初始化
        changeVal: () => {
            console.log("99999999999")
            teamBuyData.standard = ''
            teamBuyData.timeLength = ''
            setTeamBuyData(teamBuyData)
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
                    console.log("888888888888888")
                    teamBuyData.id = res.data.id || ''
                    teamBuyData.standard = data.standard
                    teamBuyData.timeLength = data.timeLength
                    setTeamBuyData({ ...teamBuyData })

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
            id: teamBuyData.id || '',
            type: 'TeamBuyRule',
            applyType: '4',
            rule: {
                standard: teamBuyData.standard,
                timeLength: teamBuyData.timeLength,
                type: 'TeamBuyRule'
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
            setLoading(false)
            props.closeModal()

        }).catch((err) => {
            message.error(err.msg)
            setLoading(false)

            console.log(err);
        })
    }

    const cancel = () => {
        props.closeModal()
    }

    const setStandard = (e) => {
        console.log(e)
        teamBuyData.standard = e
        setTeamBuyData({ ...teamBuyData })
    }

    const setTimeLength = (e) => {
        teamBuyData.timeLength = e
        setTeamBuyData({ ...teamBuyData })
    }


    return (
        <div>
            <Spin spinning={loading} >
                <div className="ruleBlock">
                    <Row>

                        <Col span={24} className="blockTitle">成团达标人数</Col>
                    </Row>
                    <br />

                    <Row>
                        <Col span={24} >
                            &nbsp; &nbsp; &nbsp; &nbsp; 满 <InputNumber
                                placeholder="成团人数"
                                step={1}
                                min={0}
                                style={{ width: '60%' }}
                                value={teamBuyData.standard} onChange={setStandard}
                            />

                          人，成团

                    </Col>
                    </Row>


                </div>


                <div className="ruleBlock">
                    <Row>

                        <Col span={24} className="blockTitle">开团有效时间</Col>
                    </Row>
                    <br />

                    <Row>
                        <Col span={24} >
                            开团后 <InputNumber
                                placeholder="有效时长"
                                step={1}
                                min={0}
                                style={{ width: '60%' }}
                                value={teamBuyData.timeLength}
                                onChange={setTimeLength}
                            />

                          小时内，有效

                    </Col>
                    </Row>


                </div>
                <div className="ruleBlock">
                    <div style={{ textAlign: 'center' }}><Button htmlType="submit" onClick={cancel}>取消</Button>&nbsp;&nbsp;&nbsp;<Button htmlType="submit" type="primary" onClick={saveData}>保存</Button></div>


                </div>
            </Spin>
        </div >

    )
}


export default RuleDetails




