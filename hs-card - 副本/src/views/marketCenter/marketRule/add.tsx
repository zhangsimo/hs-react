/**
 *  数据趋势图表
 *
 * @format
 */

import React, { useState,useEffect,useRef } from 'react'
import { Button, Col, Modal, Row } from 'antd'
import 'moment/locale/zh-cn'
import { useHistory } from 'react-router-dom'
import './styles.less'

import TeamBuyRule from './components/teamBuyRule'
import BuyGiveRule from './components/buyGiveRule'
import LimitBuyRule from './components/limitBuyRule'
import UseCardRule from './components/useCardRule'
import DiscountRule from './components/discountRule'
import CommissionRule from './components/commissionRule'
import FullReduceRule from './components/fullReduceRule'

interface IProps {
    next: (data: any, from: any) => void,
    editData: any
}


const AddRule: React.FC<IProps> = props => {
    // console.log('Form.useForm()', Form.useForm());
    const history = useHistory()
    const parmId = history.location.search.split('=')[1]
    const [visibleTeamBuy, setVisibleTeamBuy] = useState<boolean>(false)
    const [visibleBuyOrGive, setVisibleBuyOrGive] = useState<boolean>(false)
    const [visibleManGoJian, setVisibleManGoJian] = useState<boolean>(false)
    const [visibleDiscount, setVisibleDiscount] = useState<boolean>(false)
    const [visibleCurrency, setVisibleCurrency] = useState<boolean>(false)
    const [visibleCurrencyCard, setVisibleCurrencyCard] = useState<boolean>(false)
    const [visibleRetail, setVisibleRetail] = useState<boolean>(false)


    
    // const tformat = (num: number) => (num === 0 ? '0' : num)
        // const history = useHistory()
        const childRef = useRef();
        const updateChildState = () => {
            // changeVal就是子组件暴露给父组件的方法
            (childRef?.current as any)?.changeVal();
        }
    

    useEffect(() => {

    }, [props, parmId])


    const setTeamBuy = () => {
        updateChildState()
        setVisibleTeamBuy(true)
    }
    
    const setBuyOrGive = () => {
        updateChildState()
        setVisibleBuyOrGive(true)
    }

    const setManGoJian = () => {
        updateChildState()
        setVisibleManGoJian(true)
    }


    const setDiscount = () => {
        updateChildState()
        setVisibleDiscount(true)
    }

    const setCurrency = () => {
        updateChildState()
        setVisibleCurrency(true)
    }

    const setCurrencyCard = () => {
        updateChildState()
        setVisibleCurrencyCard(true)
    }
    
    const setRetail = () => {
        updateChildState()
        setVisibleRetail(true)
    }

    const closeModal = () => {
        setVisibleTeamBuy(false)
        setVisibleRetail(false)
        setVisibleCurrency(false)
        setVisibleCurrencyCard(false)
        setVisibleDiscount(false)
        setVisibleManGoJian(false)
        setVisibleBuyOrGive(false)

    }
    
    
    
    return (
        <div style={{ background: '#fff', padding: '15px' }}>
            <div className="ruleBlock">
                <Row>

                    <Col span={24} className="blockTitle">团购规则</Col>
                </Row>
                <Row>

                    <Col span={24} >
                    <Row>
                    <Col span={12}>成团达标人数/开团有效时间</Col>
                    <Col span={12}> <Button type="primary" size="small" onClick={setTeamBuy}> 新建规则</Button> </Col>
                    </Row>
                    </Col>
                </Row>

            </div>

            <div className="ruleBlock">
                <Row>

                    <Col span={24} className="blockTitle">买赠规则
                 
                    </Col>
                </Row>
                <Row>
               
                <Col span={24} >
                    <Row>
                    <Col span={12}>买X送Y </Col>
                    <Col span={12}><Button type="primary" size="small" onClick={setBuyOrGive}> 新建规则</Button></Col>
                    </Row>
                    </Col>

                    
                  
                   
                </Row>

            </div>


            <div className="ruleBlock">
                <Row>

                    <Col span={24} className="blockTitle">满减规则
                 
                    </Col>
                </Row>

                <Row>
                <Col span={24} >
                    <Row>
                    <Col span={12}>买X元减Y元 </Col>
                    <Col span={12}><Button type="primary" size="small" onClick={setManGoJian}> 新建规则</Button></Col>
                    </Row>
                    </Col>

                    
                    </Row>


            </div>


            <div className="ruleBlock">
                <Row>

                    <Col span={24} className="blockTitle">折扣规则</Col>
                </Row>

                <Row>
                <Col span={24} >
                    <Row>
                    <Col span={12}>买X件打Y折 </Col>
                    <Col span={12}><Button type="primary" size="small" onClick={setDiscount}> 新建规则</Button></Col>
                    </Row>
                    </Col>

                    
                    </Row>


             

            </div>

            <div className="ruleBlock">
                <Row>

                    <Col span={24} className="blockTitle">通用规则</Col>
                </Row>

                <Row>
                <Col span={24} >
                    <Row>
                    <Col span={12}>活动限购</Col>
                    <Col span={12}><Button type="primary" size="small" onClick={setCurrency}> 新建规则</Button></Col>
                    </Row>

                    <Row style={{margin:'10px 0'}}>
                    <Col span={12}>活动用券限制</Col>
                    <Col span={12}><Button type="primary" size="small" onClick={setCurrencyCard}> 新建规则</Button></Col>
                    </Row>
                    </Col>

                    
                    </Row>
             

            </div>

            <div className="ruleBlock">
                <Row>

                    <Col span={24} className="blockTitle">分销规则</Col>
                </Row>

                
                <Row>
                <Col span={24} >
                    <Row>
                    <Col span={12}>分销佣金</Col>
                    <Col span={12}><Button type="primary" size="small" onClick={setRetail}> 新建规则</Button></Col>
                    </Row>
                    </Col>
                </Row>


            </div>

            
            < Modal
                title="团购规则"
                centered
                visible={visibleTeamBuy}
                footer={null}
                // confirmLoading={loading}
                width={500}
                onCancel={() => setVisibleTeamBuy(false)}
                bodyStyle={{ padding: '0px 20px' }}>
                <TeamBuyRule cRef={childRef} closeModal={closeModal}  ruleId={''}></TeamBuyRule>

            </ Modal>

            < Modal
                title="买X送Y"
                centered
                visible={visibleBuyOrGive}
                footer={null}
                // confirmLoading={loading}
                width={800}
                onCancel={() => setVisibleBuyOrGive(false)}
                bodyStyle={{ padding: '0px 20px' }}>
                <BuyGiveRule cRef={childRef} closeModal={closeModal} ruleId={''}></BuyGiveRule>

            </ Modal>

            < Modal
                title="满X元减Y元"
                centered
                visible={visibleManGoJian}
                footer={null}
                // confirmLoading={loading}
                width={500}
                onCancel={() => setVisibleManGoJian(false)}
                bodyStyle={{ padding: '0px 20px' }}>
                <FullReduceRule cRef={childRef} closeModal={closeModal} ruleId={''}></FullReduceRule>

            </ Modal>

            < Modal
                title="买X件打Y折"
                centered
                visible={visibleDiscount}
                footer={null}
                // confirmLoading={loading}
                width={450}
                onCancel={() => setVisibleDiscount(false)}
                bodyStyle={{ padding: '0 20px' }}>
                <DiscountRule cRef={childRef} closeModal={closeModal} ruleId={''}></DiscountRule>

            </ Modal>

            < Modal
                title="活动限购"
                centered
                visible={visibleCurrency}
                footer={null}
                // confirmLoading={loading}
                width={400}
                onCancel={() => setVisibleCurrency(false)}
                bodyStyle={{ padding: '0 20px' }}>
                <LimitBuyRule cRef={childRef} closeModal={closeModal} ruleId={''}></LimitBuyRule>

            </ Modal>

            < Modal
                title="活动用券限制"
                centered
                visible={visibleCurrencyCard}
                footer={null}
                // confirmLoading={loading}
                width={830}
                onCancel={() => setVisibleCurrencyCard(false)}
                bodyStyle={{ padding: '0px 20px' }}>
                <UseCardRule cRef={childRef} closeModal={closeModal} ruleId={''}></UseCardRule>

            </ Modal>

            < Modal
                title="分销佣金"
                centered
                visible={visibleRetail}
                footer={null}
                // confirmLoading={loading}
                width={620}
                onCancel={() => setVisibleRetail(false)}
                bodyStyle={{ padding: '0px 20px' }}>
                <CommissionRule cRef={childRef} closeModal={closeModal} ruleId={''}></CommissionRule>

            </ Modal>

           

           
        </div >
    )
}

export default AddRule
