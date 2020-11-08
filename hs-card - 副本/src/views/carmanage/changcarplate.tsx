/** @format */
import React, { useState, } from 'react'
import { Row, Button, Steps, Space } from 'antd'
import { useHistory } from 'react-router-dom'
import TagViewStore from '@/store/tag-view'
import useSearchParam from '@/hooks/useSearchParam'
import Step1 from './components/step1'
import Step2 from './components/step2'
import Step3 from './components/step3'
import './style.less'
// import * as api from '@/api'
interface IProps { }
const { Step } = Steps;
const Changcarplate: React.FC<IProps> = props => {
    const history = useHistory()
    const [current, setCurrent] = useState<number>(0)
    const [nextSign, setNextSign] = useState<boolean>(false)
    const [constomerInf, setConstomerInf] = useState<any>()
    const vin = useSearchParam('vin')
    const carId = useSearchParam('carId')
    const { delView } = TagViewStore.useContainer()
    const ClickNext = () => {
        setCurrent(current === 2 ? current : current + 1)
    }
    const closeTabs = () => {
        delView({ pathname: "/carmanage/changcarplate", state: { title: '创建车辆' } })
        history.push(`/carmanage/detail?vin=${vin}&carId=${carId}`)
    }
    const next = (val, data) => {
        setNextSign(val)
        setConstomerInf(data)
    }

    return (
        <div className="changcarplate block">
            <div className="block_title">
                <span>变更车牌</span>
            </div>
            <div className="block_content">
                <Steps progressDot current={current} style={{ width: '750px', margin: '20px 0' }}>
                    <Step title="查找车辆" />
                    <Step title="变更车牌" className={current > 0 ? 'step2' : ''} />
                    <Step title="店总审核" />
                </Steps>
                {
                    function tabList(current) {
                        return (
                            <div>
                                {{
                                    [0]: <Step1 next={next} vin={vin} carId={carId} />,
                                    [1]: <Step2 constomerInf={constomerInf} closeTabs={closeTabs} />,
                                    [2]: <Step3 />,
                                }[current]}
                            </div>
                        )
                    }(current)
                }
                <Row>
                    <Space size="large">
                        {
                            nextSign && current === 0 ? <div>
                                <Space size="large">
                                    <Button type="primary" onClick={ClickNext}>下一步</Button>
                                    <Button onClick={closeTabs}>
                                        关闭
                                    </Button>
                                </Space>
                            </div> : ''
                        }

                    </Space>
                </Row>
            </div>
        </div>
    )
}

export default Changcarplate
