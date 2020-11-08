/** @format */

import React, { useEffect, useState } from 'react'
import ToolsBar from '@/components/ToolsBar'
import { Form, Row, Col, Input, Button, message } from 'antd'
import '../style.less'
import * as api from '@/api'
interface IProps {
    next,
    vin,
    carId
}
const Changcarplate: React.FC<IProps> = props => {
    const [form] = Form.useForm()
    const [searchSign, setSearchSign] = useState<boolean>(false)
    const [simpleCusCarDtos, setSimpleCusCarDtos] = useState<Array<any>>([])
    useEffect(() => {
        if (props.carId) {
            getCarQueryCarInfo('')
        }
    }, [props.carId])
    const onSearch = () => {
        form
            .validateFields()
            .then(res => {
                let params = (form.getFieldValue as any)()
                getCarQueryCarInfo(params.vin)
            })
            .catch(err => {
                message.warning('请输入vin码')
            })
    }
    const getCarQueryCarInfo = (vin) => {
        api.getCarQueryCarInfo({ vin: vin, carId: vin ? '' : props.carId }).then(res => {
            const data: any = res.data;
            if (data.carId) {
                setSearchSign(true)
                setSimpleCusCarDtos(data.simpleCusCarDtos)
                for (let [key] of Object.entries(data)) {
                    data[key] = data[key] ? data[key] : '无'
                }
                props.next(true, data)
                form.setFieldsValue(data)
            } else {
                setSearchSign(false)
                props.next(false)
                message.warning('查询不到相关vin车辆信息')
            }
        })
    }
    return (
        <div className="changcarplate block">
            <ToolsBar>
                <Form layout="inline" form={form}>
                    <Form.Item name="vin" label="VIN码" rules={[{ required: true }]}>
                        <Input placeholder="请输入VIN号" allowClear style={{ width: '350px' }} ></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={onSearch}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>
            </ToolsBar>
            {
                searchSign ?

                    <Form labelCol={{ span: 8 }} form={form}>
                        <Row>
                            <Col span={5}>
                                <Form.Item name="carId" label="车辆ID" labelAlign='left'>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item name="vin" label="VIN码">
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item name="carModel" label="车型">
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={5}>
                                <Form.Item name="engineNumber" label="发动机号" labelAlign='left'>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item name="carNo" label="车牌号">
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        {
                            simpleCusCarDtos && simpleCusCarDtos.length > 0 ? simpleCusCarDtos.map(item => {
                                item.type === 1 ? <div>
                                    <Row>
                                        <Col span={5}>
                                            <Form.Item name="creator" label="车主" labelAlign='left'>
                                                <Input disabled></Input>
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item name="mobile" label="手机号">
                                                <Input disabled></Input>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div> :
                                    <div>
                                        <Row>
                                            <Col span={5}>
                                                <Form.Item name="name" label="绑定客户" labelAlign='left'>
                                                    <Input disabled></Input>
                                                </Form.Item>
                                            </Col>
                                            <Col span={5}>
                                                <Form.Item name="mobile" label="手机号">
                                                    <Input disabled></Input>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                            }) : <Row>
                                    <Col span={5}>
                                        <Form.Item name="creator" label="车主" labelAlign='left'>
                                            无
                                </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item name="mobile" label="手机号">
                                            无
                                </Form.Item>
                                    </Col>
                                </Row>
                        }
                    </Form>
                    : ''}
        </div>
    )
}

export default Changcarplate
